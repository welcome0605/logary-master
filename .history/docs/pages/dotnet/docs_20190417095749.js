import { useRef } from 'react'
import Head from 'next/head';
import { faBooks } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'

// '@fortawesome/pro-light-svg-icons'

export default function DotnetDocs() {
  const toc =
    [ { id: "TODO", title: ".Net Core Documentation", ref: useRef(null) } ]

    // const toc =
    // [ { id: "install-the-package", title: "Install the package", ref: useRef(null) },
    //   { id: "hello-fsharp", title: "Hello F#", ref: useRef(null) },
    //   { id: "hello-csharp", title: "Hello C#", ref: useRef(null) },
    // ]

  return (
    <DocPage name=".net-documentation" title=".Net Core Documentation" faIcon={faBooks} colour="purple" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">Logary — TODO</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">TODO</h2>
      </DocSection>
    </DocPage>
  )
}