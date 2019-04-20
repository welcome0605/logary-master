import { useRef } from 'react'
import Head from 'next/head';
import { faBooks } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'

// '@fortawesome/pro-light-svg-icons'


export default function DotnetDocs() {
  const toc =
    [ 
      { id: "pointName", title: "PointName", ref: useRef(null) },
      { id: "context", title: "Context", ref: useRef(null) },
      { id: "rhfm", title: "Rule & Hierarchical logging & Filter & Minimum level", ref: useRef(null) },
      { id: "log-level", title: "Log Level", ref: useRef(null) },
      { id: "logging-from-modules", title: "Logging from modules", ref: useRef(null) },
      { id: "logging-from-class", title: "Logging from a class", ref: useRef(null) },
      { id: "lt", title: "Logging fields & templating", ref: useRef(null) },
      { id: "me", title: "Metrics & EventProcessing pipeline", ref: useRef(null) },
    ]

  return (
    <DocPage name=".net-documentation" title=".Net Core Documentation" faIcon={faBooks} colour="purple" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">.Net Core Documentation</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">PointName</h2>
       
        <Code language="fsharp" value={
          preval`
          const fs = require('fs')
          const val = fs.readFileSync(__dirname + '/../../../examples/Logary.ConsoleApp/Program.fs', 'utf8')
          module.exports = val
          `
        } />
      </DocSection>
      <DocSection {...toc[1]}>
        <h2 className="section-title">.net core 2.2</h2>
        <p>
          The latest version is <a href="https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-core-2-2">.NET Core 2.2</a> New features include: framework-dependent deployments, startup hooks, AAD authentication with Azure SQL, and support for Windows ARM32.
        </p> 
      </DocSection>
      <DocSection {...toc[2]}>
        <h2 className="section-title">create your first application</h2>
        <p>
          After installing the .NET Core SDK, open a command prompt. Type the following dotnet commands to create and run a C# application.
        </p>
        <p><code>dotnet new console</code></p>
        <p><code>dotnet run</code></p>
        <p>
          After installing the .NET Core SDK, open a command prompt. Type the following dotnet commands to create and run a C# application.
        </p>
        <p><code>Hello World!</code></p>
      </DocSection>

    </DocPage>
  )
}
