import { useState } from 'react'
import { listCertificates, addCertificate } from '@/services/certificates'
import type { Certificate } from '@/data/certifications'

export function CertificateGallery({ allowAdd = false }: { allowAdd?: boolean }) {
  const [items, setItems] = useState<Certificate[]>(() => listCertificates())
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')

  function onFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setNote('Choose an image of the certificate.')
      return
    }
    const name = title.trim() || file.name.replace(/\.[^.]+$/, '')
    const reader = new FileReader()
    reader.onload = () => {
      const image = typeof reader.result === 'string' ? reader.result : ''
      if (!image) return
      try {
        addCertificate(name, image)
        setItems(listCertificates())
        setTitle('')
        setNote('Certificate added on this browser.')
      } catch {
        setNote('That image is too large to store in this browser.')
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((certificate) => (
          <li key={certificate.id} className="overflow-hidden rounded-[1.25rem] border border-wire-line bg-white shadow-[0_16px_40px_rgba(2,9,46,0.06)]">
            <img src={certificate.image} alt={certificate.title} className="aspect-[4/3] w-full bg-[#f7f4ee] object-cover" />
            <p className="px-4 py-3 text-sm font-medium text-navy">{certificate.title}</p>
          </li>
        ))}
      </ul>
      {allowAdd ? (
        <form
          className="rounded-[1.25rem] border border-dashed border-navy/30 bg-white p-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <h2 className="text-lg font-medium text-navy">Add a certificate</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Certificate name</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Certificate name"
                className="h-11 w-full rounded-full border border-wire-line px-4 text-sm text-navy"
              />
            </label>
            <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-navy px-5 text-sm font-medium text-white hover:bg-royal">
              Choose image
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  onFile(event.target.files?.[0])
                  event.target.value = ''
                }}
              />
            </label>
          </div>
          {note ? (
            <p role="status" className="mt-3 text-sm text-navy">
              {note}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  )
}
