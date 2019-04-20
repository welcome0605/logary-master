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
    <DocPage name="all-target" title="Target / Sinks" faIcon={faPuzzlePiece} colour="purple" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">Target / Sinks</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">InfluxDb Target</h2>
        <p>
          Suppose you're measuring values coming from a car. This is what that could look like:
        </p> 
      
      </DocSection>
    </DocPage>
  )
}