import { useRef } from 'react'
import Head from 'next/head';
import { faBooks } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'
import Code from '../../components/Code'

// '@fortawesome/pro-light-svg-icons'


export default function DotnetDocs() {
  const toc =
    [ 
      { id: "pointName", title: "PointName", ref: useRef(null) },
      { id: "context", title: "Context", ref: useRef(null) },
      { id: "rhfm", title: "Rule & Hierarchical logging & Filter & Minimum level", ref: useRef(null) },
      { id: "log-level", title: "Log Level", ref: useRef(null) },
      { id: "logging-from-modules", title: "Logging from modules", ref: useRef(null) },
      { id: "logging-from-class", title: "Logging from a class", ref: useRef(null) },
      { id: "lt", title: "Logging fields & templating", ref: useRef(null) },
      { id: "me", title: "Metrics & EventProcessing pipeline", ref: useRef(null) },
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
      <DocSection {...toc[1]}>
        <h2 className="section-title">.net core 2.2</h2>
        
      </DocSection>
      <DocSection {...toc[2]}>
        <h2 className="section-title">create your first application</h2>
      
      </DocSection>

    </DocPage>
  )
}
