import assert from "node:assert/strict"
import test from "node:test"
import { applyHead } from "../scripts/prerender.mjs"
import { classify } from "./routes.mjs"

const catalogue = { products: new Set(["sample-vial-lw-01"]), categories: new Set(["sample-vials"]) }

test("known public and private routes stay on the site", () => {
  assert.equal(classify("/", catalogue), "public")
  assert.equal(classify("/shop/", catalogue), "public")
  assert.equal(classify("/products/sample-vial-lw-01", catalogue), "public")
  assert.equal(classify("/categories/sample-vials", catalogue), "public")
  assert.equal(classify("/policies/terms", catalogue), "public")
  assert.equal(classify("/account/orders/abc", catalogue), "private")
  assert.equal(classify("/ref/FRIEND", catalogue), "private")
})

test("unknown routes are missing", () => {
  assert.equal(classify("/this-page-is-not-real", catalogue), "missing")
  assert.equal(classify("/products/not-a-record", catalogue), "missing")
  assert.equal(classify("/categories/not-an-area", catalogue), "missing")
  assert.equal(classify("/policies/not-a-policy", catalogue), "missing")
  assert.equal(classify("/products/sample-vial-lw-01/extra", catalogue), "missing")
})

test("a catalogue outage does not mark real product urls missing", () => {
  assert.equal(classify("/products/anything", null), "public")
  assert.equal(classify("/nope", null), "missing")
})

test("prerender puts the page title, canonical, and schema in the first html", () => {
  const template = `<!doctype html><html><head>
    <title>LotWise Labs</title>
    <meta name="description" content="old" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://www.lotwiselabs.com/" />
    <script type="application/ld+json" data-seo-jsonld>{"@type":"WebSite"}</script>
  </head><body><div id="root"></div></body></html>`
  const html = applyHead(template, {
    path: "/products/sample-vial-lw-01",
    title: "Sample Vial LW-01",
    description: "A catalogue vial.",
    index: true,
    jsonLd: [{ "@type": "Product", name: "Sample Vial LW-01" }],
  })
  assert.match(html, /<title>Sample Vial LW-01 · LotWise Labs<\/title>/)
  assert.match(html, /content="A catalogue vial\."/)
  assert.match(html, /rel="canonical" href="https:\/\/www\.lotwiselabs\.com\/products\/sample-vial-lw-01"/)
  assert.match(html, /"@type":"Product"/)
  const hidden = applyHead(template, { path: "/cart", title: "Cart", description: "Your cart.", index: false })
  assert.match(hidden, /noindex, follow/)
  assert.doesNotMatch(hidden, /application\/ld\+json/)
})
