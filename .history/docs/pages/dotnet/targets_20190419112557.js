
import { useRef } from 'react'
import Head from 'next/head';
import { faPuzzlePiece } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'
import Code from '../../components/Code'


export default function Targets() {

  const toc =
  [ 
    { id: "influxdb-target", title: "InfluxDb Target", ref: useRef(null) },
    { id: "file-target", title: "File target (alpha level)", ref: useRef(null) },
    { id: "stackdriver-target", title: "Stackdriver target", ref: useRef(null) },
    { id: "jtt", title: "Jaeger Tracing target", ref: useRef(null) },
    { id: "alst", title: "AliYun Log Service target", ref: useRef(null) },
    { id: "maait", title: "Microsoft Azure Application Insights target", ref: useRef(null) },
    { id: "commercial-targets", title: "Commercial Targets", ref: useRef(null) },
    // { id: "me", title: "Metrics & EventProcessing pipeline", ref: useRef(null) },
    // { id: "building", title: "Building", ref: useRef(null) },
  ]
  
  return (
    <DocPage name="all-target" title="Target / Sinks" faIcon={faPuzzlePiece} colour="pink" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">Target / Sinks</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">InfluxDb Target</h2>
        <p>
          Suppose you're measuring values coming from a car. This is what that could look like:
        </p> 
        <ul>
          <li>Events will be logged to InfluxDb like such:<span className="_code"> "pointName, event=template, ctx1=ctxval1, ctx2=ctxval2 field1=fieldval1, field2=fieldval2 value=1i 14566666xxxx"</span></li>
          <br></br>
          <li>In other words, fields will be influx values and context fields will be influx tags.</li>
          <br></br>
          <li>The timestamp of the Message will be at the end as the timestamp of the sent line</li>
          <br></br>
          <li>
            Events will be logged in these influx measure names, so that you could e.g. put <span className="_code"> "event_fatal" </span>as an annotation in Grafana:
            
            <ul>
            <br></br>
              <li><span className="_code"> event_verbose </span></li>
              <li><span className="_code"> event_debug </span></li>
              <li><span className="_code"> event_info</span></li>
              <li><span className="_code"> event_warn </span></li>
              <li><span className="_code"> event_error </span></li>
              <li><span className="_code"> event_fatal </span></li>
            </ul>
          </li>
        </ul>
      </DocSection>
      <DocSection {...toc[1]}>
        <h2 className="section-title">File target (alpha level)</h2>
        <p>
          Logary's file target is primarily geared towards systems that are running on single machines as it prints a human-readable format, rather than a machine- readable one.
        </p> 

        <h3>Configuration</h3>
          <p>
            The default configuration of the file target rotates log files greater than 200 MiB and deletes log files when the configured folder size is larger than 3 GiB.
          </p>
          <p>
            Folders that don't exist when the target starts are automatically created on target start-up in the current service's security context. Should the calls to create the folder fail, the target is never started, but will restart continuously like any ther Logary target.
          </p>
          <Code language="fsharp" value={
            preval`
            const fs = require('fs')
            const val = fs.readFileSync(__dirname + '/../../../examples/TargetCode/Doc1.fs', 'utf8')
            module.exports = val
            `
          } />
          <p>
            Or in C#:
          </p>
          <Code language="csharp" value={
            preval`
            const fs = require('fs')
            const val = fs.readFileSync(__dirname + '/../../../examples/TargetCode/Doc2.cs', 'utf8')
            module.exports = val
            `
          } />

        <h3>Policies & specifications</h3>
          <p>You can specify a number of deletion and rotation policies when configuring the file target. The deletion policies dictate when the oldest logs should be deleted, whilst the rotation policies dictates when the files should be rotated (thereby the previous file archived).</p>
          <p>Furthermore, you can specify a naming specification that dictates how the files should be named on disk.</p>
          <ul>
            <li>Deletion of files happen directly when at least one deletion policy has triggered.</li>
            <li>Rotation of files happen directly when at least one rotation policy has triggered.</li>
            <li>Naming specifications should automatically be amended with sequence number, should that be required.</li>
          </ul>

        <h3>Performance</h3>
          <p>The <span className="_code"> File </span> target is a performance-optimised target. Logging always happens on a separate thread from the caller, so we try to reach a balance between throughput and latency on ACKs.</p>
          <p>On Windows, overlapped IO is not used, because the files are opened in Append mode, should have equivalent performance. This means we should have similar performance on Linux and Windows.</p>
          <p>The formatters used for the <span className="_code">File</span> target should be writing to<span className="_code"> TextWriter</span> instances to avoid creating extra string copies in memory.</p>

        <h3>Handling of errors</h3>
          <p>The file target is thought as a last-chance target, because by default, logs should be shipped from your nodes/machines to a central logging service. It can also be nicely put to use for local console apps that need to log to disk.</p>
          <ul>
            <li>Non-target-fatal <span className="_code">IOExceptions</span>, for example when NTFS ACKs file deletes but still keeps the file listable and available for some duration afterwards are retried on a case-by-case basis. Internal Warn-level messages are logged.</li><br></br>
            <li>Fatal <span className="_code">IOExceptions</span> – more other cases; directory not found, file not found, etc. are not retried. The target should crash and restart. Its current batch is then retried forever, while logging internal Fatal-level exceptions.</li>
          </ul>
        
        <h3>Invariants</h3>
          <ul>
            <li>The File target is modelled as a transaction log and trades speed against safety that the contents have been written to disk, but does not do the bookkeeping required to use FILE_FLAG_NO_BUFFER.</li>
            <br></br>
            <li>Fatal level events are automatically flushed/fsync-ed.</li>
            <br></br>
            <li>Only a single writer to a file is allowed at any given time. This invariant exists because atomic flushes to files are only possible on Linux up to the page size used in the page cache.</li>
            <br></br>
            <li>Only asynchronous IO is done, i.e. the Logary worker thread is not blocked by calls into the operating system. Because of the overhead of translating callbacks into Job/Alt structures, we try to write as much data as possible on every call into the operating system. This means that Messages to be logged can be ACKed in batches rather than individually.</li>
            <br></br>
            <li>If your disk collapses while writing log messages (which happens once in a while and happens frequently when you have thousands of servers), the target should save its last will and then retry a configurable number of times after waiting an exponentially growing duration between each try. It does this by crashing and letting the supervisor handle the failure. After exhausting the tries, the batch of log messages is discarded.</li>
            <br></br>
            <li>If there are IO errors on writing the log messages to disk, there's no guarantee that there won't be duplicate log lines written; however, they're normally timestamped, so downstream log ingestion systems can do de-duplication. This is from the batched nature of the File target.</li>
            <br></br>
          </ul>
      </DocSection>
    </DocPage>
  )
}