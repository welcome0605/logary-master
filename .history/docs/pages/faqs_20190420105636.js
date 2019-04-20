
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
    { id: "faq", title: "FAQ", ref: useRef(null) },
  ]
  
  return (
    <DocPage name="all-target" title="FAQs" faIcon={faLifeRing} colour="green" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">FAQs</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">Comparison to NLog and log4net</h2>
        <p>
          Why Logary instead of one of the classic logging frameworks?
        </p> 
        <ul>
          <li>You get semantic logging with Logary</li>
          <br></br>
          <li>More targets to choose from</li>
          <br></br>
          <li>Larger community of target writers</li>
          <br></br>
          <li>Easier to write targets; they can crash and that's handled by Logary internally</li>
        </ul>
      </DocSection>
    </DocPage>
  )
}

