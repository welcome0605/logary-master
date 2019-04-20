
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
          <br></br>
          <li>Support for zero-dependency usage through Logary.Facade</li>
          <br></br>
          <li>Better/more extensive Rule-based hierarchies</li>
          <br></br>
          <li>Targets can be decoupled from the network and Ack is a first-level primitive</li>
          <br></br>
          <li>You get back an Alt(Promise(unit)) that you can use to synchronise your calling code for when the log message is required to be durable; you can't do this with NLog or log4net</li>
          <br></br>
          <li>There's an object model you can use from the calling code</li>
          <br></br>
          <li>Logary is F#, so it's easier to keep bug-free relative to many other languages</li>
          <br></br>
          <li>Logary doesn't keep static state around; easy to refactor, easy to extend</li>
          <br></br>
        </ul>
      </DocSection>
    </DocPage>
  )
}

