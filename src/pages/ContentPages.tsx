import { useState, type FormEvent } from "react"
import { Link, useParams } from "react-router-dom"
import { faqs, policies } from "../data/content.ts"
import { aboutVideo, certificates, terms } from "../lib/live.ts"
import SpecularButton from "../components/SpecularButton.tsx"
import { productByCode } from "../lib/catalog.ts"
import { useTitle } from "../lib/useTitle.ts"

function aboutEmbed(value: string) {
  const src = value.trim()
  if (!src) return null
  const youtube = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (youtube) return { kind: "frame" as const, src: `https://www.youtube.com/embed/${youtube[1]}` }
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return { kind: "frame" as const, src: `https://player.vimeo.com/video/${vimeo[1]}` }
  return { kind: "file" as const, src }
}

export function AboutPage() {
  useTitle("About", {
    description: "LotWise Labs supplies research peptides with batch certificates and a public catalogue.",
  })
  const video = aboutEmbed(aboutVideo)
  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">About</p>
        <h1 className="display">LotWise Labs</h1>
        <p className="lede">LotWise Labs is positioned around precision, science, quality, trust, transparency, and research-focused peptide solutions. Company history and approved about copy have not been supplied, so this page keeps to that positioning.</p>
      </header>
      {video ? (
        <div className="about-video">
          {video.kind === "file" ? (
            <video src={video.src} controls playsInline preload="metadata" />
          ) : (
            <iframe src={video.src} title="About LotWise Labs" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          )}
        </div>
      ) : null}
      <div className="info-grid">
        {["Precision", "Quality", "Transparency"].map((item, index) => (
          <article className="info-card" key={item}>
            <b>0{index + 1}</b>
            <h2>{item}</h2>
            <p className="meta">Supporting detail will be published when it is approved.</p>
          </article>
        ))}
      </div>
      <p className="notice">Names, descriptions, options, and research-use statements on product pages will be replaced with client-approved catalogue content. The current text is placeholder copy.</p>
    </div>
  )
}

export function ContactPage() {
  useTitle("Contact", {
    description: "Contact LotWise Labs about the research catalogue.",
  })
  const [preview, setPreview] = useState("")
  return (
    <div className="wrap" style={{ paddingBottom: 64, maxWidth: 800 }}>
      <header className="page-hero">
        <p className="eyebrow">Contact</p>
        <h1 className="display">Write to the team</h1>
        <p className="lede">Official contact details have not been confirmed. The form does not send a message.</p>
      </header>
      <form
        className="panel"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setPreview(`${data.get("name")} · ${data.get("email")} · ${data.get("message")}`)
        }}
      >
        <label className="field"><span>Name</span><input name="name" required /></label>
        <label className="field"><span>Email</span><input name="email" type="email" required /></label>
        <label className="field"><span>Message</span><textarea name="message" required /></label>
        <SpecularButton tone="primary" type="submit">Preview message</SpecularButton>
        {preview ? <p className="notice">Preview only. Nothing was sent. {preview}</p> : null}
      </form>
    </div>
  )
}

export function FaqPage() {
  useTitle("FAQ", {
    description: "Answers about LotWise Labs catalogue prices, orders, and payment.",
  })
  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">FAQ</p>
        <h1 className="display">Questions about this catalogue preview.</h1>
        <p className="lede">Approved customer questions have not been supplied.</p>
      </header>
      <div className="faq">
        {faqs.map((item) => (
          <details key={item.id}>
            <summary>{item.question}</summary>
            <p className="lede" style={{ marginTop: 8 }}>{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

export function PolicyPage() {
  const { slug = "" } = useParams()
  const policy = slug === "terms"
    ? { slug: "terms", title: terms.title, summary: terms.summary, sections: terms.sections }
    : policies.find((item) => item.slug === slug)
  useTitle(policy?.title ?? "Policy", {
    description: policy?.summary || "LotWise Labs policy.",
    index: Boolean(policy),
  })
  if (!policy) {
    return (
      <div className="wrap" style={{ padding: "32px 0" }}>
        <div className="error-box">
          <h1 className="display" style={{ fontSize: 42 }}>That policy page was not found.</h1>
          <Link to="/policies/terms">Terms</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">Policy</p>
        <h1 className="display">{policy.title}</h1>
        <p className="lede">{policy.summary}</p>
      </header>
      {policy.sections.map((section) => (
        <article key={section.heading} style={{ marginTop: 18 }}>
          <h2>{section.heading}</h2>
          <p className="lede">{section.body}</p>
        </article>
      ))}
    </div>
  )
}

export function QualityPage() {
  useTitle("Certificates", {
    description: "LotWise Labs certificates of analysis and third-party test reports.",
  })
  const [code, setCode] = useState("")
  const [result, setResult] = useState<string | null>(null)
  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const found = productByCode(code)
    setResult(found ? found.slug : "")
  }
  const product = result ? productByCode(code) : undefined
  return (
    <div className="wrap" style={{ paddingBottom: 64 }}>
      <header className="page-hero">
        <p className="eyebrow">Quality</p>
        <h1 className="display">Certificates</h1>
        <p className="lede">Janoshik test report for RETATURIDE-Lotwiselabs. Open the file to verify it on Janoshik.</p>
      </header>
      <div className="cert-list">
        {certificates.map((file) => (
          <article className="cert-card" key={file.id}>
            <h2>{file.title}</h2>
            <p className="meta">{file.note}</p>
            <p className="meta">{file.result}</p>
            <a href={file.href} target="_blank" rel="noopener noreferrer">Verify on Janoshik</a>
            <a href={file.href} target="_blank" rel="noopener noreferrer">
              <img src={file.image} alt={file.alt} />
            </a>
          </article>
        ))}
      </div>
      <form className="panel" style={{ marginTop: 28 }} onSubmit={onSubmit}>
        <h2 className="display" style={{ fontSize: 36 }}>Find a record</h2>
        <p className="meta">Enter a catalogue code, such as LW-01. This checks the records on this site. It does not look up a laboratory batch.</p>
        <div className="lookup">
          <input aria-label="Catalogue code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="LW-01" />
          <SpecularButton tone="primary" type="submit">Find record</SpecularButton>
        </div>
        {result === "" ? <p className="notice">That record is not in the catalogue.</p> : null}
        {product ? <p className="notice">{product.name} · {product.baseSku}. <Link to={`/products/${product.slug}`}>View record</Link></p> : null}
      </form>
    </div>
  )
}

export function NotFoundPage() {
  useTitle("Not found", {
    description: "That LotWise Labs page was not found.",
    index: false,
  })
  return (
    <div className="wrap" style={{ padding: "48px 0 80px" }}>
      <h1 className="display" style={{ fontSize: "clamp(48px, 8vw, 88px)" }}>That page is not on this site.</h1>
      <div className="buy-row">
        <SpecularButton tone="primary" to="/">Home</SpecularButton>
        <SpecularButton tone="ghost" to="/shop">Catalog</SpecularButton>
      </div>
    </div>
  )
}
