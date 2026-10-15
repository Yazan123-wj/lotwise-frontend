import { useState } from 'react'
import { AdminForm } from '@/admin/components/AdminForm'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getStoreSettings } from '@/services/admin'
import type { StoreSettings } from '@/types'

const integrations = [
  ['Catalogue API', 'Not connected'],
  ['Authentication', 'Not connected'],
  ['Payments', 'Not connected'],
  ['Shipping rates', 'Not connected'],
  ['Affiliate tracking', 'Not connected'],
]

export function SettingsPage() {
  usePageTitle('Settings')
  const [settings, setSettings] = useState<StoreSettings>(() => ({ ...getStoreSettings() }))
  const [saved, setSaved] = useState(false)

  function setField(key: keyof StoreSettings, value: string) {
    setSettings((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Store details for a later launch. Contact fields stay unconfirmed until the client supplies them."
        crumbs={[{ label: 'Settings' }]}
      />
      <AdminForm
        onSubmit={() => {
          setSaved(true)
        }}
      >
        <FormField id="store-name" label="Store name" required>
          <input value={settings.storeName} onChange={(event) => setField('storeName', event.target.value)} />
        </FormField>
        <FormField id="store-email" label="Support email">
          <input value={settings.supportEmail} onChange={(event) => setField('supportEmail', event.target.value)} />
        </FormField>
        <FormField id="store-phone" label="Phone">
          <input value={settings.phone} onChange={(event) => setField('phone', event.target.value)} />
        </FormField>
        <FormField id="store-address" label="Business address">
          <textarea className="min-h-24" value={settings.address} onChange={(event) => setField('address', event.target.value)} />
        </FormField>
        <FormField id="store-currency" label="Currency code" hint="Sample display currency for the wireframe.">
          <input value={settings.currencyCode} onChange={(event) => setField('currencyCode', event.target.value.toUpperCase())} />
        </FormField>
        <Button type="submit">Save demonstration</Button>
        {saved ? <DemoNotice>Settings stayed on this page. They were not stored.</DemoNotice> : null}
      </AdminForm>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Future integrations</h2>
        <ul className="space-y-2 text-sm">
          {integrations.map(([name, status]) => (
            <li key={name} className="flex items-center justify-between border border-wire-line bg-white px-3 py-2">
              <span>{name}</span>
              <span>{status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
