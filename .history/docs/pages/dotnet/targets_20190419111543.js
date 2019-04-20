
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
      </DocSection>
    </DocPage>
  )
}