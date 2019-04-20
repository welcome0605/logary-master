import Link from 'next/link'
import Layout from '../../components/Layout'
import ConfTable from '../../components/ConfTable'

function GooglePubSub() {
  const conf = [
    { name: "projectId",
      type: 'string',
      required: false,
      default: 'None',
      description: 'What GCP project the PubSub broker is in',
    },
    { name: "topic",
      type: 'string | (Message->string)',
      default: '"logs"',
      required: false,
      description: "What topic to publish to. If you provide a callback, you can inspect the Message object and choose what topic you publish to. If that topic doesn't exist, it will be created."
    },
    { name: "shutdownTimeout",
      type: 'Duration',
      default: 'Duration.FromSeconds 5L',
      required: false,
      description: 'How long to wait for the publisher\'s buffers to flush before force-closing it',
    },
    { name: "pubSettings",
      type: 'PublisherServiceApiSettings',
      default: 'client-lib defaults',
      required: false,
      description: 'Sets the publisher settings'
    },
  ]

  return <article id="google-pubsub">
    <h3>Google Pub/Sub</h3>
    <p>
      Supports <a href="https://cloud.google.com/pubsub/docs/overview">Google Pub/Sub</a> as a target of Logary, Shipper and Rutta.
    </p>
    <h4>Configuration</h4>
    <ConfTable conf={conf} />
  </article>
}

export default function Targets() {

  const toc =
  [ 
    { id: "pointName", title: "PointName", ref: useRef(null) },
    // { id: "context", title: "Context", ref: useRef(null) },
    // { id: "rhfm", title: "Rule & Hierarchical logging & Filter & Minimum level", ref: useRef(null) },
    // { id: "log-level", title: "Log Level", ref: useRef(null) },
    // { id: "logging-from-modules", title: "Logging from modules", ref: useRef(null) },
    // { id: "logging-from-class", title: "Logging from a class", ref: useRef(null) },
    // { id: "lt", title: "Logging fields & templating", ref: useRef(null) },
    // { id: "me", title: "Metrics & EventProcessing pipeline", ref: useRef(null) },
    // { id: "building", title: "Building", ref: useRef(null) },
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
      
      </DocSection>
    </DocPage>
  )
}