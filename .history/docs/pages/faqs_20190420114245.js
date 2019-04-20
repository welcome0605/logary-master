
import { useRef } from 'react'
import Head from 'next/head';
import { faLifeRing } from '@fortawesome/pro-light-svg-icons';
import DocPage from '../components/DocPage'
import DocSection from '../components/DocSection'
import Code from '../components/Code'
// import stn from '../../images/SinkTargetNames.png'




export default function Targets() {

  const toc =
  [ 
    { id: "ctnal", title: "Comparison to NLog and log4net", ref: useRef(null) },
    { id: "ctcmm", title: "Comparison to Codahale metrics & Metrics.NET", ref: useRef(null) },
    { id: "cws", title: "Comparison with Serilog", ref: useRef(null) },
    { id: "faq", title: "FAQ", ref: useRef(null) },
  ]
  
  return (
    <DocPage name="all-target" title="FAQs" faIcon={faLifeRing} colour="green" readingMinutes={2} toc={toc}>
      <Head>
        <title key="title">FAQs</title>
      </Head>
      <DocSection {...toc[0]}>
        <h2 className="section-title">Comparison to NLog and log4net</h2>
        <p>
          Why Logary instead of one of the classic logging frameworks?
        </p> 
        <ul>
          <li>You get semantic logging with Logary</li>
          <br></br>
          <li>More targets to choose from</li>
          <br></br>
          <li>Larger community of target writers</li>
          <br></br>
          <li>Easier to write targets; they can crash and that's handled by Logary internally</li>
          <br></br>
          <li>Support for zero-dependency usage through Logary.Facade</li>
          <br></br>
          <li>Better/more extensive Rule-based hierarchies</li>
          <br></br>
          <li>Targets can be decoupled from the network and Ack is a first-level primitive</li>
          <br></br>
          <li>You get back an <span className="_code"> Alt (Promise (unit) )</span> that you can use to synchronise your calling code for when the log message is required to be durable; you can't do this with NLog or log4net</li>
          <br></br>
          <li>There's an object model you can use from the calling code</li>
          <br></br>
          <li>Logary is F#, so it's easier to keep bug-free relative to many other languages</li>
          <br></br>
          <li>Logary doesn't keep static state around; easy to refactor, easy to extend</li>
          <br></br>
        </ul>
      </DocSection>
      <DocSection {...toc[1]}>
        <h2 className="section-title">Comparison to Codahale metrics & Metrics.NET</h2>
        <p>Why Logary rather than Metrics.NET, the primary alternative?</p> 
        <p>In order to understand the differences, you first need to understand the vocabulary. Logary uses the name <span className="_code"> Message </span> to mean either an <span className="_code">Event </span> , a <span className="_code"> Gauge </span> or a <span className="_code"> Derived </span>. This comes from analysing the different sorts of things one would like to ship from an app.</p> 
        <p>Starting with an <span className="_code"> Event </span>; this is the main value when you're logging (in fact, it's Logary.PointValue.Event(template:string) that you're using.) An event is like a Gauge at a particular instant on the global timeline with a value of 1 (one).</p> 
        <p>Which brings us to what a <span className="_code"> Gauge </span> is. It's a specific value at an instant. It's what you see as a temporature on a thermometer in your apartment, e.g. <span className="_code"> 10.2 degrees celcius </span>. In the International System of Units (SI-Units), you could say it's the same as 283.2 K. Logary aims to be the foundational layer for all your metrics, so it uses these units. A <span className="_code"> Gauge </span> value of your temperature could be created like so <span className="_code"> Message.gaugeWithUnit Kelvin (Float 283.2) </span> or <span className="_code"> Gauge (Float 283.2, Kelvin) </span>.</p> 
        <p>A <span className="_code"> Derived metric </span>, like <span className="_code"> Kelvin/s </span> is useful if you're planning on writing a thermostat to control the temperature. A change in target temperature causes a rate of change.</p> 
        <p>Another sample metric could be represented by the name <span className="_code"> [| "MyApp"; "API" "requests" |] </span> and <span className="_code"> PointValue </span> of <span className="_code"> Derived (Float 144.2, Div (Scalar, Seconds)) </span>, if the API is experiencing a request rate of 144.2 requests per second.</p> 
        <p>Armed with this knowledge, we can now do a mapping between Codahale's metrics and those of Logary:</p> 
        <ul>
          <li><span className="_code"> Gauges </span> (measuring instantaneous values) -> <span className="_code"> PointValue.Gauge(.., ..) </span>.</li>
          <br></br>
          <li><span className="_code"> Timers </span> (measuring durations) -> <span className="_code"> PointValue.Gauge(.., Scaled(Seconds, 10e9) </span> (in nanoseconds)</li>
          <br></br>
          <li><span className="_code"> Meter </span> (measuring rates) -> <span className="_code"> PointValue.Derived(.., Div(Scalar, Seconds)) </span> or <span className="_code"> PointValue.Derived(.., Div(Other "requests", Seconds))</span> </li>
          <br></br>
          <li><span className="_code"> Counters </span> (counting events) -> <span className="_code"> PointValue.Event("User logged in")</span></li>
          <br></br>
          <li><span className="_code"> Histograms </span> (tracking value distributions) -> <span className="_code"> PointValue.Derived </span> (with suffixes) and <span className="_code"> Reservoirs. </span></li>
          <br></br>
        </ul>
        <p>Metrics like the above are taken from different sources:</p>
        <ul>
          <li>At call site (e.g. "<span className="_code"> Event </span> happened", or "it took <span className="_code"> 50 ns to connect </span>")</li>
          <br></br>
          <li>At a process level, derived from<span className="_code"> Gauge </span> and <span className="_code"> Event </span> from different call-sites in your app (e.g. "The 99.9th percentile of '{time} ns to connect' is 145 ns").</li>
          <br></br>
          <li><span className="_code"> Meter </span> (measuring rates) -> <span className="_code"> PointValue.Derived(.., Div(Scalar, Seconds)) </span> or <span className="_code"> PointValue.Derived(.., Div(Other "requests", Seconds))</span> </li>
          <br></br>
          <li><span className="_code"> Counters </span> (counting events) -> <span className="_code"> PointValue.Event("User logged in")</span></li>
          <br></br>
          <li><span className="_code"> Histograms </span> (tracking value distributions) -> <span className="_code"> PointValue.Derived </span> (with suffixes) and <span className="_code"> Reservoirs. </span></li>
          <br></br>
        </ul>
      </DocSection>
    </DocPage>
  )
}
