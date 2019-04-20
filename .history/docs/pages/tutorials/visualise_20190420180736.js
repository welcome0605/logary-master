import { useRef } from 'react'
import Head from 'next/head';
import { faFileChartLine } from '@fortawesome/pro-solid-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'

export default function Tutorials() {
  const toc =
  [
    { id: "ms", title: "File guidelines – module vs static method", ref: useRef(null) } ,
    { id: "ps", title: "File guidelines – plural vs singular", ref: useRef(null) } ,
    { id: "fg", title: "File guidelines – module vs static method", ref: useRef(null) } ,
    { id: "fg", title: "File guidelines – module vs static method", ref: useRef(null) } ,
    { id: "fg", title: "File guidelines – module vs static method", ref: useRef(null) } ,
    { id: "fg", title: "File guidelines – module vs static method", ref: useRef(null) } ,
    { id: "fg", title: "File guidelines – module vs static method", ref: useRef(null) } ,
    { id: "fg", title: "File guidelines – module vs static method", ref: useRef(null) } ,
  ]

  return (
    <DocPage name="js-quickstart" title="Tutorials" faIcon={faFileChartLine} colour="primary" readingMinutes={3} toc={toc}>
      <Head>
        <title key="title">Tutorials</title>
      </Head>
      Clone it like above. Ensure you can build it. Open <span className="_code"> Logary.sln </span>. Make a change, send a PR towards master. To balance the app.config files, try <span className="_code"> mono tools/paket.exe install --redirects --clean-redirects --createnewbindingfiles</span>
      <DocSection {...toc[0]}>
        <h2 className="section-title">File guidelines – module vs static method</h2>
        <p></p>
        <p>Declare your interfaces in a <span className="_code"> MyIf.fs </span> and its module in <span className="_code"> MyIfModule.fs </span> with a ([CompilationRepresentation(CompilationRepresentationFlags.ModuleSuffix)])).</p>
        <p>Place these files as high as possible. Place the module as close to and below the non-module file as possible.</p>
        <p>If it's plausible that one would like to use point-free programming with your functions, place them in a module. (E.g. Message versus MessageModule)</p>
        <p>Factory methods go on the types for value types. For stateful objects they go on the module, named <span className="_code"> create </span> which may or may not return a <span className="_code"> Job[] </span> of some public state type with a private/internal constructor. (E.g. PointName versus Engine)</p>
      </DocSection>
      <DocSection {...toc[0]}>
        <h2 className="section-title">File guidelines – plural vs singular</h2>
        <p></p>
        <p>All implementations go in a plural namespace. E.g. <span className="_code"> Logary.Metrics.Ticked </span> has:</p>
        <ul>
          <li><span className="_code">Logary</span> – core namespace</li>
          <li><span className="_code">Metrics</span> – namespace for all metrics implementations</li>
          <li><span className="_code">Ticked</span> – a module and/or type that implements Logary-based ticking/ scheduling.</li>
        </ul>
        <p>Another example: <span className="_code"> Logary.Target </span>, which is a module that implements logic about the life-cycle of target instances. It's used to start/stop/pause and shutdown targets. It's singular.</p>
      </DocSection>
    </DocPage>
  )
}