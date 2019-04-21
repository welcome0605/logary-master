
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
        <h2 className="section-title">Logary licencing</h2>
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
            <li>Opsgenie (under <span className="_code"> src/targets/Logary.Targets.Opsgenie) </span> — commercial alerting and monitoring</li>
          </ul>
          <p>All other targets (and their code-bases) are licensed as Apache 2.0 (Appendix A contains links to Apache 2.0).</p>
        <h3>Rutta</h3>
          <p>Present at src/services/*, being an executable program and docker container.</p>
          <p>Rutta is dual-licensed as GPL v3, or as a commercial license. Purchasing a commercial license for Rutta lets you use and extend its source code for your own commercial purposes and not open source that change.</p>
          <p>Present at src/services/*, being an executable program and docker container.</p>
          <p>GPL v3 means that when you want to extend Rutta for your own purposes, you must send a pull request with that change in order to make your improvement available for others to use. This is so that free software can continue to be free. If you don't want to send a pull request with your change, you must purchase the commercial license.</p>
        <h3>Library Façade</h3>
          <p>Present at <span className="_code"> src/Logary[,CSharp].Facade[,.Tests] </span>. Also called the Façade, in short.</p>
          <p>The Façade is Apache 2.0 licensed.</p>
          <p>The Library Façade is distinct from the Façade Adapter, since the Façade is Apache 2.0-licensed code, whilst the Façade Adapter (in <span className="_code"> src/adapters/Logary.Adapters.Facade </span>) doesn't work without Logary-lib.</p>
        <h3><span className="_code"> logary </span> JavaScript library</h3>
          <p>MIT-licensed, see <a href="https://github.com/logary/logary-js/blob/master/LICENSE">logary/logary-js/LICENSE.</a> </p>
          <p>This NPM package is published at <a href="https://www.npmjs.com/package/logary">logary/logary-js/LICENSE.</a> </p>
      </DocSection>
      <DocSection {...toc[1]}>
        <h2 className="section-title">Terms of Service (ToS)</h2>
        <p></p>
        <h3>1. Jurisdiction</h3>
        <h3>1. Jurisdiction</h3>
        <h3>1. Jurisdiction</h3>
        <h3>1. Jurisdiction</h3>
        <h3>1. Jurisdiction</h3>
        <h3>1. Jurisdiction</h3>
      </DocSection>
      <DocSection {...toc[2]}>
        <h2 className="section-title">Commercial License</h2>
        
      </DocSection>
    </DocPage>
  )
}
