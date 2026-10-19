import { useRef, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { ProductCard } from "../components/catalog.tsx"
import AnimatedContent from "../components/AnimatedContent.tsx"
import SpecularButton from "../components/SpecularButton.tsx"
import { categories, certificates } from "../data/content.ts"
import {
  categoryName,
  countInCategory,
  productByCode,
  visibleProducts,
} from "../lib/catalog.ts"

const steps = [
  { n: "01", title: "Explore", body: "Open the catalog and filter by area.", to: "/shop", label: "Open the catalog" },
  { n: "02", title: "Review", body: "Open a record and its sample options.", to: "/products/sample-vial-lw-01", label: "Open a record" },
  { n: "03", title: "Add", body: "Put the record in the cart on this browser.", to: "/cart", label: "View the cart" },
  { n: "04", title: "Confirm", body: "Checkout writes a demonstration receipt. It does not take payment.", to: "/checkout", label: "Go to checkout" },
]

export function HomePage() {
  const featuredAreas = categories.filter((category) => category.featured)
  const [areaSlug, setAreaSlug] = useState(featuredAreas[0]?.slug ?? categories[0].slug)
  const area = categories.find((category) => category.slug === areaSlug) ?? categories[0]
  const featured = visibleProducts().filter((product) => product.featured)
  const certTrack = useRef<HTMLDivElement>(null)
  const [certIndex, setCertIndex] = useState(0)
  const [code, setCode] = useState("")
  const [lookup, setLookup] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const recordCount = visibleProducts().length
  const areaCount = categories.filter((category) => countInCategory(category.slug) > 0).length
  const sample = visibleProducts()[0]

  function showCertificate(index: number) {
    const track = certTrack.current
    if (!track) return
    const next = Math.max(0, Math.min(certificates.length - 1, index))
    track.scrollTo({ left: next * track.clientWidth, behavior: "auto" })
    setCertIndex(next)
  }

  function onLookup(event: FormEvent) {
    event.preventDefault()
    const found = productByCode(code)
    setLookup(found ? found.slug : "")
  }

  return (
    <>
      <section className="hero">
        <AnimatedContent className="hero-copy" stagger={0.08} distance={100} duration={0.8} ease="power3.out">
          <p className="hero-kicker">LotWise / Catalogue review</p>
          <h1 className="display">Vial records, reference lots, and kits.</h1>
          <p className="hero-lede">Listed for review. Prices on this site are sample figures.</p>
          <div className="hero-actions">
            <SpecularButton tone="glass" to="/shop">View catalog</SpecularButton>
            <SpecularButton tone="outline" to="/quality">Certificates</SpecularButton>
          </div>
        </AnimatedContent>
        <AnimatedContent className="hero-visual" distance={80} delay={0.12} duration={0.8} ease="power3.out">
          <div className="vial-cluster">
            <img className="vial-back vial-back-left" src="/images/hero-vial.png" alt="" />
            <img className="vial-back vial-back-right" src="/images/hero-vial.png" alt="" />
            <img className="vial-front" src="/images/hero-vial.png" alt="Sample catalogue vial" />
          </div>
        </AnimatedContent>
      </section>

      <AnimatedContent distance={100} duration={0.8} ease="power3.out">
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="display">Browse by area</h2>
              <p className="lede">{recordCount} records · {areaCount} areas</p>
            </div>
            <SpecularButton tone="ghost" to="/shop">Full catalog</SpecularButton>
          </div>
          <article className="area-stage">
            <img src={area.imagePath} alt="" />
            <div>
              <p className="eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>
                Area {String(area.displayOrder).padStart(2, "0")} · {countInCategory(area.slug)} records
              </p>
              <h3 className="display">{area.name}</h3>
              <p>{area.description}</p>
              <SpecularButton tone="glass" to={`/categories/${area.slug}`} style={{ marginTop: 14 }}>View collection</SpecularButton>
            </div>
          </article>
          <div className="tabs" role="tablist" aria-label="Catalogue areas">
            {categories.map((category) => (
              <button
                key={category.id}
                className="tab"
                type="button"
                role="tab"
                aria-selected={category.slug === area.slug}
                onClick={() => setAreaSlug(category.slug)}
              >
                {category.name} {countInCategory(category.slug)}
              </button>
            ))}
          </div>
        </div>
      </section>
      </AnimatedContent>

      <AnimatedContent distance={100} duration={0.8} ease="power3.out">
      <section className="section">
        <div className="wrap points">
          <div>
            <p className="eyebrow">Catalogue</p>
            <h2 className="display">Built around the records.</h2>
            <p className="lede" style={{ marginTop: 16 }}>LotWise lists sample records for review. Names, options, and prices on these pages are catalogue figures.</p>
            <div className="point-list">
              <article><strong>01</strong><div><h3>Records</h3><p className="meta">Each item has a name, a code, and at least one sample option.</p></div></article>
              <article><strong>02</strong><div><h3>Files</h3><p className="meta">Certificate images sit on the certificates page. They name the document type.</p></div></article>
              <article><strong>03</strong><div><h3>Cart</h3><p className="meta">A record can be added here, then reviewed at checkout as a demonstration.</p></div></article>
            </div>
            <SpecularButton tone="ghost" to="/about" style={{ marginTop: 18 }}>About LotWise</SpecularButton>
          </div>
          <figure className="figure">
            <img src="/images/hero-vial.png" alt="" />
            <figcaption>Fig. 01 — {sample?.name ?? "Sample record"} · Research use only</figcaption>
          </figure>
        </div>
      </section>
      </AnimatedContent>

      <AnimatedContent distance={100} duration={0.8} ease="power3.out">
      <section className="section" style={{ background: "var(--soft)" }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Selected records</p>
              <h2 className="display">The catalogue</h2>
              <p className="lede">Names, options, and sample prices — set out plainly, without promotional claims.</p>
            </div>
            <SpecularButton tone="primary" to="/shop">All records</SpecularButton>
          </div>
          <AnimatedContent className="grid-cards" stagger={0.08} distance={60} duration={0.7} ease="power3.out">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </AnimatedContent>
        </div>
      </section>
      </AnimatedContent>

      <AnimatedContent distance={100} duration={0.8} ease="power3.out">
      <section className="section cert-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Files</p>
              <h2 className="display">Held with the record.</h2>
            </div>
            <p className="lede">These files name the document type. Test results are not printed on them.</p>
          </div>
          <div className="cert-stage">
            <div className="cert-files">
              {certificates.map((file, index) => (
                <button key={file.id} type="button" aria-current={index === certIndex ? "true" : undefined} onClick={() => showCertificate(index)}>
                  <span className="cert-index">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <strong>{file.title}</strong>
                    <span className="meta">{file.note}</span>
                  </span>
                </button>
              ))}
              <SpecularButton tone="ghost" to="/quality">Certificates</SpecularButton>
            </div>
            <div className="cert-swiper" role="region" aria-roledescription="carousel" aria-label="Certificates">
              <div
                className="cert-track"
                ref={certTrack}
                onScroll={() => {
                  const track = certTrack.current
                  if (!track || track.clientWidth === 0) return
                  setCertIndex(Math.round(track.scrollLeft / track.clientWidth))
                }}
              >
                {certificates.map((file) => (
                  <figure className="cert-slide" key={file.id}>
                    <img src={file.image} alt="" />
                  </figure>
                ))}
              </div>
              <div className="cert-nav">
                <button type="button" className="cert-arrow" aria-label="Previous certificate" disabled={certIndex === 0} onClick={() => showCertificate(certIndex - 1)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8 10 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div className="cert-caption">
                  <strong>{certificates[certIndex]?.title}</strong>
                  <span className="meta">{certificates[certIndex]?.note}</span>
                </div>
                <span className="cert-count">{String(certIndex + 1).padStart(2, "0")} / {String(certificates.length).padStart(2, "0")}</span>
                <button type="button" className="cert-arrow" aria-label="Next certificate" disabled={certIndex === certificates.length - 1} onClick={() => showCertificate(certIndex + 1)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimatedContent>

      <AnimatedContent distance={100} duration={0.8} ease="power3.out">
      <section className="section">
        <div className="wrap two">
          <div>
            <p className="eyebrow">Lookup</p>
            <h2 className="display">Find a record.</h2>
            <p className="lede">Enter a catalogue code, such as LW-01. This checks the records on this site. It does not look up a laboratory batch.</p>
            <form className="lookup" style={{ marginTop: 18 }} onSubmit={onLookup}>
              <label className="sr-only" htmlFor="home-code">Catalogue code</label>
              <input id="home-code" value={code} placeholder="LW-01" onChange={(event) => setCode(event.target.value)} />
              <SpecularButton tone="primary" type="submit">Find record</SpecularButton>
            </form>
            {lookup === "" ? <p className="notice">That record is not in the wireframe catalogue.</p> : null}
            {lookup ? (
              <p className="notice">
                {visibleProducts().find((item) => item.slug === lookup)?.name} · {categoryName(visibleProducts().find((item) => item.slug === lookup)?.categorySlug ?? "")}
                {" "}
                <Link to={`/products/${lookup}`}>View record</Link>
              </p>
            ) : null}
          </div>
          <img src="/images/lotwise-vial.png" alt="" style={{ borderRadius: 28 }} />
        </div>
      </section>
      </AnimatedContent>

      <AnimatedContent distance={100} duration={0.8} ease="power3.out">
      <section className="section" style={{ background: "var(--soft)" }}>
        <div className="wrap">
          <p className="eyebrow">How it works</p>
          <h2 className="display">From the catalogue to checkout</h2>
          <p className="lede" style={{ marginBottom: 22 }}>Four steps on this site, from the list to a demonstration receipt.</p>
          <AnimatedContent className="steps" stagger={0.08} distance={50} duration={0.7} ease="power3.out">
            {steps.map((step) => (
              <article className="step" key={step.n}>
                <div className="box-top">
                  <h3>{step.title}</h3>
                  <span className="box-mark">{step.n}</span>
                </div>
                <p className="box-copy">{step.body}</p>
                <div className="box-foot">
                  <Link className="text-btn" to={step.to}>{step.label}</Link>
                  <Link className="round-btn" to={step.to} aria-label={step.label}>
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M5 11 11 5M7 5h4v4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </AnimatedContent>
        </div>
      </section>
      </AnimatedContent>

      <AnimatedContent distance={100} duration={0.8} ease="power3.out">
      <section className="section contact-band">
        <div className="wrap contact-layout">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="display">Write to the team.</h2>
            <p className="lede">The form stays on this page. It does not send or store a message. Official contact details are still to be confirmed.</p>
          </div>
          <form
            className="contact-card"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              const name = String(data.get("name") ?? "").trim()
              const email = String(data.get("email") ?? "").trim()
              const body = String(data.get("message") ?? "").trim()
              if (!name || !email || !body) return
              setMessage(`${name} · ${email} · ${body}`)
              setSent(true)
            }}
          >
            <div className="contact-row">
              <label className="field"><span>Name</span><input name="name" required autoComplete="name" /></label>
              <label className="field"><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
            </div>
            <label className="field"><span>Message</span><textarea name="message" required /></label>
            <SpecularButton tone="primary" type="submit">Preview message</SpecularButton>
            {sent ? <p className="notice">Preview only. Nothing was sent. {message}</p> : null}
          </form>
        </div>
      </section>
      </AnimatedContent>
    </>
  )
}
