import { useRef } from 'react'
import Head from 'next/head';
import { faFileChartLine } from '@fortawesome/pro-solid-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'

export default function Tutorials() {
  const toc =
    [ { id: "install-the-package", title: "Install the package", ref: useRef(null) } ]

  return (
    <DocPage name="js-quickstart" title="Tutrials" faIcon={faFileChartLine} colour="primary" readingMinutes={3} toc={toc}>
      <Head>
        <title key="title">Logary — Javacript Quickstart</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">Install the package</h2>
        <p>
          The first step is to install the Logary package from npm.
        </p>
        <p>
          <code>npm install --save logary</code>
        </p>
        <p>Or you're using yarn...</p>
        <p>
          <code>yarn add logary</code>
        </p>
      </DocSection>
    </DocPage>
  )
}