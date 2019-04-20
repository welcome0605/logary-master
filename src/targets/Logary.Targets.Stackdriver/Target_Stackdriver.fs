﻿/// This module contains targets and configuration for logging to Google's Stackdriver logging and analytics package.
/// Documentation for Stackdriver Logging itself can be found here: https://cloud.google.com/logging/docs/
module Logary.Targets.Stackdriver

#nowarn "44"

open Google.Api
open Google.Api.Gax.Grpc
open Google.Cloud.Logging.Type
open Google.Cloud.Logging.V2
open Google.Protobuf
open Google.Protobuf.WellKnownTypes
open Hopac
open Hopac.Infixes
open Logary
open Logary.Configuration
open Logary.Internals
open Logary.Message
open Logary.Formatting
open System
open System.IO
open System.Collections.Generic
open System.Runtime.CompilerServices

[<assembly:InternalsVisibleTo("Logary.Targets.Stackdriver.Tests")>]
do()

/// A structure that enforces certain labeling invariants around monitored resources
/// TO CONSIDER: add more resource types.
/// SEE: https://cloud.google.com/logging/docs/api/v2/resource-list#service-names
/// SEE: https://cloud.google.com/logging/docs/migration-v2#monitored-resources
type ResourceType =
  /// An API provided by the producer.
  /// `service` (1): The API service name, such as "cloudsql.googleapis.com".
  /// `method` (2): The API method, such as "disks.list".
  /// `version`: The API version, such as "v1".
  /// `location`: The service specific notion of location. This can be the name of a zone, region, or "global".
  | Api of service:string * method:string * version:string * location:string
  /// A virtual machine instance hosted in Google Compute Engine (GCE).
  /// `instance_id` (1): The numeric VM instance identifier assigned by Compute Engine.
  /// `zone`: The Compute Engine zone in which the VM is running.
  | GCEInstance of zone:string * instance:string
  /// A Google Container Engine (GKE) container instance.
  /// `cluster_name` (1): An immutable name for the cluster the container is running in.
  /// `namespace_id` (2): Immutable ID of the cluster namespace the container is running in.
  /// `instance_id`: Immutable ID of the GCE instance the container is running in.
  /// `pod_id`: Immutable ID of the pod the container is running in.
  /// `container_name`: Immutable name of the container.
  /// `zone`: The GCE zone in which the instance is running.
  | Container of clusterName:string
               * namespaceId:string
               * instanceId:string
               * podId:string
               * containerName:string
               * zone:string
  /// A resource type used to indicate that a log is not associated with any specific resource.
  | Global
  /// AppEngine services are isolated units segregated by application module id
  /// and the version of the application
  | AppEngine of moduleId:string * versionId: string
  member x.key =
    match x with
    | Api _ ->
      "api"
    | GCEInstance _ ->
      "gce_instance"
    | Container _ ->
      "container"
    | Global ->
      "global"
    | AppEngine _ ->
      "gae_app"

  /// See https://cloud.google.com/logging/docs/api/v2/resource-list for the list of resources
  /// as well as required keys for each one
  member x.labels projectId =
    dict <|
    ("project_id", projectId) ::
    match x with
    | Api (service, method, version, location) ->
      [ "service", service
        "method", method
        "version", version
        "location", location ]

    | GCEInstance (zone, instance) ->
      [ "zone", zone
        "instance_id", instance ]

    | Container (cluster, ns, instance, pod, container, zone) ->
      [ "cluster_name", cluster
        "namespace_id", ns
        "instance_id", instance
        "pod_id", pod
        "container_name", container
        "zone", zone ]

    | Global ->
      []

    | AppEngine (moduleId, versionId) ->
      [ "module_id", moduleId
        "version_id", versionId ]

  member x.toMonitoredResource project: MonitoredResource =
    let r = MonitoredResource(Type = x.key)
    r.Labels.Add(x.labels project)
    r

  static member createGCEInstance(zone, instance) =
    GCEInstance(zone, instance)

  static member createComputeInstance (zone, instance) =
    GCEInstance (zone, instance)

  static member createContainer(cluster, ns, instance, pod, container, zone) =
    Container(cluster, ns, instance, pod, container, zone)

  static member createAppEngine(moduleId, version) =
    AppEngine(moduleId, version)

type StackdriverConf =
  { /// Google Cloud Project Id
    projectId: string option
    /// Name of the log to which to write
    logId: string
    /// Resource currently being monitored
    resource: ResourceType
    /// Additional user labels to be added to the messages
    labels: HashMap<string,string>
    /// Maximum messages to send as a batch.
    maxBatchSize: uint16 }

  static member create (?projectId, ?logId, ?resource, ?labels, ?batchSize) =
    { projectId = projectId
      logId = defaultArg logId "apps"
      resource = defaultArg resource Global
      labels = defaultArg labels HashMap.empty
      maxBatchSize = defaultArg batchSize 50us }

let empty: StackdriverConf =
  StackdriverConf.create()

module internal Impl =
  open Google.Api.Gax
  open Logary.Internals.Chiron

  type LogLevel with
    member x.toSeverity(): LogSeverity =
      match x with
      | LogLevel.Debug -> LogSeverity.Debug
      | LogLevel.Error -> LogSeverity.Error
      | LogLevel.Fatal -> LogSeverity.Critical
      | LogLevel.Info -> LogSeverity.Info
      | LogLevel.Warn -> LogSeverity.Warning
      | LogLevel.Verbose -> LogSeverity.Debug

  type V = WellKnownTypes.Value

  let rec toValue (json: Json) =
    match json with
    | Json.Number f ->
      match Double.TryParse f with
      | false, _ ->
        V.ForString f
      | true, f ->
        V.ForNumber f
    | Json.String s when isNull s ->
      V.ForString "🕷" // spider = null
    | Json.String s ->
      V.ForString s
    | Json.True ->
      V.ForBool true
    | Json.False ->
      V.ForBool false
    | Json.Null ->
      V.ForNull ()
    | Json.Array arr ->
      let vs =
        arr
          |> List.fold (fun acc item -> (toValue item) :: acc) []
          |> List.toArray
      V.ForList vs
    | Json.Object jObj ->
      jObj
        |> JsonObject.toMap
        |> Seq.fold (fun (acc: Struct) (KeyValue (k, v)) -> acc.Fields.[k] <- toValue v; acc) (Struct ())
        |> V.ForStruct

  let addToStruct (s: WellKnownTypes.Struct) (k, value: obj): WellKnownTypes.Struct =
    if isNull value then s else
    s.Fields.[k] <- Json.encode value |> toValue
    s

  // When logging error data from App Engine, Kubernetes Engine or Compute Engine, the only requirement is for the log entry to contain the full error message and stack trace. 
  // It should be logged as a multi-line textPayload or in the message field of jsonPayload
  // https://cloud.google.com/error-reporting/docs/formatting-error-messages
  let formatMessageField (m: Message) =   
    use sw = new StringWriter()
    MessageWriter.verbatim.write sw m
    
    let error = m |> tryGetField "error"
    if error.IsSome then
      sw.Write Environment.NewLine
      sw.Write (error.Value.ToString())
      
    let errorST: StacktraceLine[] option = m |> tryGetField "error"
    if errorST.IsSome then
      sw.Write Environment.NewLine
      for line in Option.get errorST do
        match line with
        | ExnType (exnType, message) ->
          sw.Write exnType
          sw.Write ": "
          sw.Write message
          sw.WriteLine()
        | Line line ->
          sw.Write "   at "
          sw.Write line.site
          line.file |> Option.iter (fun file ->
            sw.Write " in "
            sw.Write file)
          line.lineNo |> Option.iter (fun no ->
            sw.Write ":"
            sw.Write no)
          sw.WriteLine()
        | StacktraceDelim ->
          sw.WriteLine("-----------")
        | LineOutput data ->
          sw.WriteLine data
      sw.Write (error.Value.ToString())

    getExns m 
      |> Seq.iter (fun exn ->
        sw.Write Environment.NewLine
        sw.Write exn)
    
    sw.ToString()

  [<Literal>]
  let MessageKey = "message"
  [<Literal>]
  let ValueKey = "value"

  type Message with
    // https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry
    member x.toLogEntry () =
      // Labels are used in Stackdriver for classification, so lets put context there.
      // They expect only simple values really in the labels, so it's ok to just stringify them
      let labels =
        Seq.concat [
          Seq.singleton ("logger", PointName.format x.name)
          Message.getOthers x |> Seq.map (fun (k, v) -> k, string v)
        ]
        |> dict

      let addMessageFields (values: seq<string * obj>): seq<_> =
        seq {
          yield MessageKey, box (formatMessageField x)
          yield ValueKey, box x.value
          yield! values
        }

      let payloadFields =
        Message.getAllFields x
        |> addMessageFields
        |> Seq.fold addToStruct (WellKnownTypes.Struct())
        
      // TO CONSIDER: entry.InsertId <- m |> Message.messageId

      let entry = LogEntry(Severity = x.level.toSeverity(), JsonPayload = payloadFields)
      entry.Timestamp <- Timestamp.FromDateTime (DateTime.ofEpoch x.timestamp)
      entry.Labels.Add labels
      entry

  type State =
    { logName: string
      logger: LoggingServiceV2Client
      resource: MonitoredResource
      labels: IDictionary<string, string>
      cancellation: System.Threading.CancellationTokenSource
      /// used as a wrapper around the above cancellation token
      callSettings: CallSettings }

  let writeBatch (state: State) (entries: LogEntry list): Job<unit> =
    Job.Scheduler.isolate (fun () ->
      let request = WriteLogEntriesRequest(LogName = state.logName, Resource = state.resource)
      request.Entries.AddRange entries
      request.Labels.Add state.labels
      state.logger.WriteLogEntries(request, state.callSettings)
      |> ignore)
    
  let loop (conf: StackdriverConf) (api: TargetAPI) =
    let logger = api.runtime.logger
    
    let rec initialise (conf: StackdriverConf) =
      job {
        let! platform = Platform.InstanceAsync()
        // TO CONSIDER: feed everything of platform into the context and choose the monitored resource from it.
        // https://github.com/googleapis/google-cloud-dotnet/blob/b36872c110349c3d73106d333396c9e24dc494e2/apis/Google.Cloud.Logging.Log4Net/Google.Cloud.Logging.Log4Net/GoogleStackdriverAppender.cs#L245
        let source = new System.Threading.CancellationTokenSource()
        let client = LoggingServiceV2Client.Create()
        let projectId = conf.projectId |> Option.defaultValue platform.ProjectId
        let resource = conf.resource.toMonitoredResource projectId
        let logName = sprintf "projects/%s/logs/%s" projectId (System.Net.WebUtility.UrlEncode conf.logId)

        do! logger.infoWithBP (
              eventX "Started Stackdriver target with project {projectId}, writing to {logName}."
              >> setField "projectId" projectId
              >> setField "logName" conf.logId)
        
        let state =
          { logger = client
            resource = resource
            labels = conf.labels |> HashMap.toDictionary
            logName = logName
            cancellation = source
            callSettings = CallSettings.FromCancellationToken(source.Token) }
          
        return! running state
      }

    and running (state: State): Job<unit> =
      Alt.choose [
        // either shutdown, or
        api.shutdownCh ^=> fun ack ->
          logger.verbose (eventX "Shutting down Stackdriver target.")
          state.cancellation.Cancel()
          ack *<= () :> Job<_>

        RingBuffer.takeBatch conf.maxBatchSize api.requests ^=> fun messages ->
          let entries, acks, flushes =
            // Make a single pass over the array, accumulating the entries, acks and flushes.
            messages |> Array.fold (fun (entries, acks, flushes) -> function
              | Log (message, ack) ->
                message.toLogEntry() :: entries,
                ack *<= () :: acks,
                flushes
              | Flush (ackCh, nack) ->
                entries,
                acks,
                ackCh *<= () :: flushes)
              ([], [], [])

          job {
            do logger.verbose (eventX "Writing {count} messages." >> setField "count" entries.Length)
            do! writeBatch state entries
            do logger.verbose (eventX "Acking messages.")
            do! Job.conIgnore acks
            do! Job.conIgnore flushes
            return! running state
          }

      ] :> Job<_>

    initialise conf

/// Create a new StackDriver target
[<CompiledName "Create">]
let create conf name =
  { TargetConf.createSimple (Impl.loop conf) name
      with bufferSize = 2048us }

type Builder(conf, callParent: Target.ParentCallback<Builder>) =

  /// Assign the projectId for this logger
  member x.ForProject(project) =
    !(callParent <| Builder({ conf with projectId = project }, callParent))

  /// Name the feed that this logger will log to
  member x.Named(logName) =
    !(callParent <| Builder({ conf with logId = logName }, callParent))

  /// Assign a Monitored Resource to this logger
  member x.ForResource(resource) =
    !(callParent <| Builder({ conf with resource = resource }, callParent))

  member x.WithLabel(key, value) =
    !(callParent <| Builder({ conf with labels = conf.labels |> HashMap.add key value }, callParent))

  member x.WithLabels(labels: IDictionary<_,_>) =
    let labels' = labels |> Seq.fold (fun hm (KeyValue (key, value)) -> hm |> HashMap.add key value) conf.labels
    !(callParent <| Builder({ conf with labels = labels' }, callParent))

  member x.BatchesOf(size) =
    !(callParent <| Builder({ conf with maxBatchSize = size }, callParent))

  // c'tor, always include this one in your code
  new(callParent: Target.ParentCallback<_>) =
    Builder(empty, callParent)

  interface Target.SpecificTargetConf with
    member x.Build name = create conf name
