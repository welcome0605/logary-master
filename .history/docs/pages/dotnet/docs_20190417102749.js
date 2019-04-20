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
        <p>
          Download the <a href="https://dotnet.microsoft.com/download">.NET Core 2.2 SDK</a>to try .NET Core on your Windows, macOS, or Linux machine. Visit dotnet/core if you prefer to use Docker containers.
        </p> 
        <p>All .NET Core versions are available at .NET Core Downloads if you're looking for another .NET Core version.</p>
      </DocSection>
      {/* <DocSection {...toc[0]}>
        <h2 className="section-title">Install the package</h2>
        <p>
          The first step is to install the Logary package(s) from NuGet.
        </p>
        <p>
          <code>paket add logary --version ">= 5.0.0"</code>
        </p>
        <p>Or you're using NuGet/VS...</p>
        <p>
          <code>Install-Package Logary -Version 5.0.0-rc.10</code>
        </p>
      </DocSection> */}
    </DocPage>
  )
}