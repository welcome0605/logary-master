import { useRef } from 'react'
import Head from 'next/head';
import { faJs } from '@fortawesome/free-brands-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'

export default function Vision() {
  const toc =
    [ { id: "install-the-package", title: "Prometheus", ref: useRef(null) } ]

  return (
    <DocPage name="js-quickstart" title="Prometheus" faIcon={faJs} colour="yellow" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">Prometheus</title>
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