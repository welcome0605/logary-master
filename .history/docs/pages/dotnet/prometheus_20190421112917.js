import { useRef } from 'react'
import Head from 'next/head';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'
import PrometheusIcon from '../../components/PrometheusIcon'

export default function Vision() {
  const toc =
    [ { id: "prometheus", title: "Prometheus", ref: useRef(null) } ]

  return (
    <DocPage name="js-quickstart" title="Prometheus" icon={<PrometheusIcon/>}  colour="orange" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">Prometheus</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">Prometheus</h2>
        <p>
          Logary supports Prometheus. Reference Logary.Prometheus and create metrics:
        </p>

      </DocSection>
    </DocPage>
  )
}