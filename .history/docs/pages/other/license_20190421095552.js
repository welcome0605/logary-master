
import { useRef } from 'react'
import Head from 'next/head';
import { faLifeRing } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'
import Code from '../../components/Code'
var low = require('lowlight')
var tree = low.highlight('js', '"use strict";').value

// import stn from '../../images/SinkTargetNames.png'




export default function License() {

  const toc =
  [ 
    { id: "license", title: "License", ref: useRef(null) },
  ]
  
  return (
    <DocPage name="all-target" title="License" faIcon={faLifeRing} colour="green" readingMinutes={1} toc={toc}>
      <Head>
        <title key="title">License</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">License</h2>
        <p>
          Why Logary instead of one of the classic logging frameworks?
        </p> 
      </DocSection>

    </DocPage>
  )
}
