import Link from 'next/link'
import Layout from '../../components/Layout'
import ConfTable from '../../components/ConfTable'
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
          <li>
            Events will be logged in these influx measure names, so that you could e.g. put <span className="_code"> "event_fatal" </span>as an annotation in Grafana:
            <ul>
              <li>asdf</li>
              <li>asdf</li>
              <li>asdf</li>
              <li>asdf</li>
            </ul>
          </li>
          <br></br>
        </ul>
      
      </DocSection>
    </DocPage>
  )
}