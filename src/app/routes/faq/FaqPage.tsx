import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getFaqItems } from '@/services/content'

export function FaqPage() {
  usePageTitle('FAQ')
  const items = getFaqItems()
  const [openId, setOpenId] = useState(items[0]?.id ?? '')

  return (
    <PageContainer className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight text-navy">FAQ</h1>
        <p className="max-w-2xl text-sm text-wire-muted">
          Questions about this catalogue preview. Approved customer questions have not been supplied.
        </p>
      </header>
      <div className="space-y-2">
        {items.map((item) => {
          const open = openId === item.id
          return (
            <section key={item.id} className="border border-wire-line bg-white">
              <h2>
                <button
                  type="button"
                  className="flex min-h-11 w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? '' : item.id)}
                >
                  {item.question}
                  <span aria-hidden="true">{open ? '−' : '+'}</span>
                </button>
              </h2>
              {open ? <p className="px-4 pb-4 text-sm text-wire-muted">{item.answer}</p> : null}
            </section>
          )
        })}
      </div>
    </PageContainer>
  )
}
