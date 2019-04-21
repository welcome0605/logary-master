
import { useRef } from 'react'
import Head from 'next/head';
import { faBalanceScale } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'
import Code from '../../components/Code'
var low = require('lowlight')
var tree = low.highlight('js', '"use strict";').value

// import stn from '../../images/SinkTargetNames.png'




export default function License() {

  const toc =
  [
    { id: "logary-licencing", title: "Logary licencing", ref: useRef(null) } ,
    { id: "terms-of-service", title: "Terms of Service (ToS)", ref: useRef(null) } ,
    { id: "commercial-license", title: "Commercial License", ref: useRef(null) } 
  ]
  
  return (
    <DocPage name="all-target" title="License" faIcon={faBalanceScale} colour="orange" readingMinutes={1} toc={toc}>
      <Head>
        <title key="title">License</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2>Logary licencing</h2>
        <p>This section defines the licenses for each subcomponent of Logary.</p>
        <h3>Logary Library (Logary-lib)</h3>
          <p>Present at src/Logary[,Tests,PerfTests] and src/adapters/*. Each being a .Net library that you link your own code/software to.</p>
          <p>Non-profits and non-profit projects are free to use without payment, subject to the Terms of Service defined below.</p>
          <p>For-profit or commercial entities must purchase licenses to use Logary for their production environments, subject to the Terms of Service defined below.</p>
        <h3>Logary Dash</h3>
          <p>Present at src/services/Dash and src/targets/Logary.Targets.SSE; a web app and an EventSource/SSE based target.</p>
          <p>Non-profits and non-profit projects are free to use without payment, subject to the Terms of Service defined below.</p>
          <p>For-profit or commercial entities must purchase licenses to use Dash for their production environments, subject to the Terms of Service defined below.</p>
      </DocSection>
      <DocSection {...toc[1]}>
        <h2>Terms of Service (ToS)</h2>
        <p>This section defines the licenses for each subcomponent of Logary.</p>
      </DocSection>
      <DocSection {...toc[2]}>
        <h2>Commercial License</h2>
        <p>This section defines the licenses for each subcomponent of Logary.</p>
      </DocSection>
    </DocPage>
  )
}
