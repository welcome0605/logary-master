
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
        <h2></h2>
        <p>This section defines the licenses for each subcomponent of Logary.</p>
      </DocSection>
    </DocPage>
  )
}
