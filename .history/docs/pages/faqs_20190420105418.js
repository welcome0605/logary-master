
import { useRef } from 'react'
import Head from 'next/head';
import { faLifeRing } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../components/DocPage'
import DocSection from '../components/DocSection'
import Code from '../components/Code'
// import stn from '../../images/SinkTargetNames.png'




export default function Targets() {

  const toc =
  [ 
    { id: "ctnal", title: "Comparison to NLog and log4net", ref: useRef(null) },
    { id: "ctcmm", title: "Comparison to Codahale metrics & Metrics.NET", ref: useRef(null) },
    { id: "cws", title: "Comparison with Serilog", ref: useRef(null) },
    { id: "jtt", title: "Jaeger Tracing target", ref: useRef(null) },
  ]
  
  return (
    <DocPage name="all-target" title="FAQs" faIcon={faLifeRing} colour="green" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">FAQs</title>
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
    </DocPage>
  )
}

