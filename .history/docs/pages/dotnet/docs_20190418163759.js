import { useRef } from 'react'
import Head from 'next/head';
import { faBooks } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../../components/DocPage'
import DocSection from '../../components/DocSection'
import Code from '../../components/Code'
import stn from '../../images/SinkTargetNames.png'
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
        <p>
          Suppose you're measuring values coming from a car. This is what that could look like:
        </p> 
          <Code language="fsharp" value={
            preval`
            const fs = require('fs')
            const val = fs.readFileSync(__dirname + '/../../../examples/Logary.ConsoleApp/Doc1.fs', 'utf8')
            module.exports = val
            `
          } />
      </DocSection>
      <DocSection {...toc[1]}>
        <h2 className="section-title">Context</h2>
        <p>
          context are generally classified into these categories: (you can try these code on test.fsx in Logary.Tests)
        </p> 

        <h3>Fields</h3>
          <p>
            prefix with "_fields."</p><p>
            Fields are the structured data when you use structure logging like (https://messagetemplates.org/), there are mainly two style to achieve this.
          </p> 
          <Code language="fsharp" value={
              preval`
              const fs = require('fs')
              const val = fs.readFileSync(__dirname + '/../../../examples/Logary.ConsoleApp/Doc2.fs', 'utf8')
              module.exports = val
              `
            } />
          <p>Result in:</p>
          <Code language="fsharp" value={
              preval`
              const fs = require('fs')
              const val = fs.readFileSync(__dirname + '/../../../examples/Logary.ConsoleApp/Doc3.fs', 'utf8')
              module.exports = val
              `
            } />

        <h3>Gauges</h3>
          <p>prefix with "_logary.gauge."</p>
          
          <p>which value is Gauge(float, units). An instantaneous value. Imagine the needle showing the speed your car is going or a digital display showing the same instantaneous metric value of your car's speed.</p>

          <p>you can add gauges with one message, or use gauge as the message. The difference between them is, if you use gauges as the message, the value in message are auto generate by gauges when formatting them :</p>
          <Code language="fsharp" value={
              preval`
              const fs = require('fs')
              const val = fs.readFileSync(__dirname + '/../../../examples/Logary.ConsoleApp/Doc4.fs', 'utf8')
              module.exports = val
              `
            } />
        <h3>Tags</h3>
          <p>prefix with "_logary.tags"</p>
          
          <p>which value is a set , tags are help with identity one type message when you do some pipeline processing.</p>
          <Code language="fsharp" value={
              preval`
              const fs = require('fs')
              const val = fs.readFileSync(__dirname + '/../../../examples/Logary.ConsoleApp/Doc5.fs', 'utf8')
              module.exports = val
              `
            } />

          <h3>SinkTargetNames</h3>
            <p>prefix with "_logary.sink.targets"</p>
            
            <p>They are generally are set by Events Processing, you can define which targets (sinks) your message will go. if not set, message will go to all targets and let the targets themself to decide whether or not to accept it.</p>
            <Code language="fsharp" value={
              preval`
              const fs = require('fs')
              const val = fs.readFileSync(__dirname + '/../../../examples/Logary.ConsoleApp/Doc6.fs', 'utf8')
              module.exports = val
              `
            } />

            <img src={stn} alt="SinkTargetNames" />
            <p></p>
            <p>this will only show on LiterateConsole, not normal Console.</p>
          
          <h3>SinkTargetNames</h3>
            
            <p>things you don't want to show on the message value, but show on the backstore. e.g: some structured data not belong the message template or data you can use in the EventProcessing Pipeline.</p>
            <Code language="fsharp" value={
              preval`
              const fs = require('fs')
              const val = fs.readFileSync(__dirname + '/../../../examples/Logary.ConsoleApp/Doc6.fs', 'utf8')
              module.exports = val
              `
            } />
      </DocSection>
      <DocSection {...toc[2]}>
        <h2 className="section-title">Rule & Hierarchical logging & Filter & Minimum level</h2>

        <p>A logger have a minimum level which message's level below it is not processed when logging these message. Can give us Low overhead logging – evaluate your Message only if a level is switched on. Especially when you use logging api with message factory.</p>
        
      </DocSection>

    </DocPage>
  )
}
