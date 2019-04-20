﻿module Program

open Expecto
open Google.Cloud.Logging.Type
open Hopac
open Logary
open Logary.Tests
open Logary.Internals
open Logary.Message
open Logary.Targets
open Logary.Targets.Stackdriver
open System
open System.IO

let stackdriver =
  lazy (
    let project = env "crucial-baton-203418" "STACKDRIVER_PROJECT"
    let logName = env "logary-tests" "STACKDRIVER_LOG"
    StackdriverConf.create(project, logName, Global)
  )

open Stackdriver.Impl

[<Tests>]
let target =
  testList "stackdriver" [
    TargetBaseline.basicTests "Google Stackdriver" (fun name ->
      Stackdriver.create stackdriver.Value name) true

    testCase "serialise with error" <| fun () ->
      let subject =
        Message.eventWarn "Testing started"
        |> Message.setField "data-key" "data-value"
        |> Message.setField "tags" [ "integration" ]
        |> Message.setContext "service" "tests"
        |> Message.setField "error" "Error at x"
        |> fun m -> m.toLogEntry()

      Expect.equal subject.Severity LogSeverity.Warning "severity should be warning"
      Expect.equal (subject.Labels.["service"]) "tests" "should have correct context"

      let expectedMessage = "Testing started" + Environment.NewLine + "Error at x"
      Expect.equal subject.JsonPayload.Fields.["message"].StringValue expectedMessage "should have message with error"
    
    testCase "serialise with exception" <| fun () ->
      let exn = raisedExnWithInner "raised exception" (raisedExn "inner")
      let subject =
        Message.eventWarn "Testing started"
        |> Message.setField "data-key" "data-value"
        |> Message.setField "tags" [ "integration" ]
        |> Message.setContext "service" "tests"
        |> Message.addExn exn
        |> fun m -> m.toLogEntry()

      Expect.equal subject.Severity LogSeverity.Warning "severity should be warning"
      Expect.equal (subject.Labels.["service"]) "tests" "should have correct context"

      let expectedMessage = "Testing started" + Environment.NewLine + exn.ToString() 
      Expect.equal subject.JsonPayload.Fields.["message"].StringValue expectedMessage "should have message with error"
 
 
    testCaseJob "send" <| job {
      let ri = RuntimeInfo.create "tests" "localhost"
      let targetConf = Stackdriver.create stackdriver.Value "logary-stackdriver"
      let! target = Target.create ri targetConf

      for i in 0..20 do
        let! ack =
          Target.tryLog target (event LogLevel.Error "thing happened at {blah}" |> setField "application" "logary tests" |> setContext "zone" "foobar" |> addExn (raisedExnWithInner "outer exception" (raisedExn "inner exception")))
        do! ack |> function Ok ack -> ack | Result.Error e -> failtestf "Failure placing in buffer %A" e

      do! finalise target
    }
  ]

[<EntryPoint>]
let main argv =
  let privKey = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "stackdriver-service-account.json")
  Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", privKey)
  Tests.runTestsInAssembly defaultConfig argv