import { useRef } from 'react'
import Head from 'next/head';
import { faBooks } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'

// '@fortawesome/pro-light-svg-icons'

export default function DotnetDocs() {
  const toc =
    [ { id: "download-.net-core", title: "download .net core 2.2", ref: useRef(null) },
    { id: ".net-core", title: ".net core 2.2", ref: useRef(null) },
    { id: "create-application", title: "create your first application", ref: useRef(null) },]

    // const toc =
    // [ { id: "install-the-package", title: "Install the package", ref: useRef(null) },
    //   { id: "hello-fsharp", title: "Hello F#", ref: useRef(null) },
    //   { id: "hello-csharp", title: "Hello C#", ref: useRef(null) },
    // ]

  return (
    <DocPage name=".net-documentation" title=".Net Core Documentation" faIcon={faBooks} colour="purple" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">.Net Core Documentation</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">download .net core 2.2</h2>
      </DocSection>
    </DocPage>
  )
}