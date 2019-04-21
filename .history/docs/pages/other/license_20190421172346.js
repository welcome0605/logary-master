
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
        <h3>Targets</h3>
          <p>Present at src/targets/*, being .Net libraries that you link your own software to, or add as plugins to Rutta.</p>
          <p>Targets incorporated into the Logary code-base cannot be used without using the Logary library, but their code is free to modify, extend and sell under the Apache 2.0 license, unless specified otherwise on a per target basis (see below).</p>
          <p>The following targets' licenses must always be purchased, independent of the for-profit status of the purchasing entity:</p>
          <ul>
            <li>Mixpanel (under <span className="_code"> src/targets/Logary.Targets.Mixpanel </span>) — commercial user analytics, segmentation</li>
            <li>Opsgenie (under src/targets/Logary.Targets.Opsgenie) — commercial alerting and monitoring</li>
          </ul>
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
