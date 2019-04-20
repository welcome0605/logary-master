import Link from 'next/link'
import Layout from '../../components/Layout'
import ConfTable from '../../components/ConfTable'
import { useRef } from 'react'
import Head from 'next/head';
import { faBooks } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'
import Code from '../../components/Code'


export default function Targets() {

  const toc =
  [ 
    { id: "pointName", title: "InfluxDb Target", ref: useRef(null) },
    { id: "context", title: "File target (alpha level)", ref: useRef(null) },
    { id: "rhfm", title: "Stackdriver target", ref: useRef(null) },
    { id: "log-level", title: "Jaeger Tracing target", ref: useRef(null) },
    { id: "logging-from-modules", title: "Logging from modules", ref: useRef(null) },
    { id: "logging-from-class", title: "Logging from a class", ref: useRef(null) },
    { id: "lt", title: "Logging fields & templating", ref: useRef(null) },
    // { id: "me", title: "Metrics & EventProcessing pipeline", ref: useRef(null) },
    // { id: "building", title: "Building", ref: useRef(null) },
  ]
  
  return (
    <DocPage name=".net-documentation" title=".Net Core Documentation" faIcon={faBooks} colour="purple" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">.Net Core Documentation</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">PointName</h2>
        <p>
          Suppose you're measuring values coming from a car. This is what that could look like:
        </p> 
      
      </DocSection>
    </DocPage>
  )
}