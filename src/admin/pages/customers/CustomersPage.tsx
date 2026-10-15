import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DataTable } from '@/admin/components/DataTable'
import { TableFilters } from '@/admin/components/TableFilters'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getCustomers, getOrdersForCustomer } from '@/services/commerce'

export function CustomersPage() {
  usePageTitle('Customers')
  const [query, setQuery] = useState('')
  const customers = useMemo(() => {
    const text = query.trim().toLowerCase()
    return getCustomers().filter((customer) =>
      `${customer.firstName} ${customer.lastName} ${customer.email}`.toLowerCase().includes(text),
    )
  }, [query])

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Customers"
        description="Fictional sample customers. These are not real people."
        crumbs={[{ label: 'Customers' }]}
      />
      <TableFilters label="Search customers" query={query} onQuery={setQuery} />
      <DataTable
        rows={customers}
        getRowId={(customer) => customer.id}
        emptyLabel="No sample customers match that search."
        columns={[
          { id: 'name', header: 'Name', cell: (customer) => `${customer.firstName} ${customer.lastName}` },
          { id: 'email', header: 'Email', cell: (customer) => customer.email },
          { id: 'phone', header: 'Phone', cell: (customer) => customer.phone },
          { id: 'orders', header: 'Sample orders', cell: (customer) => getOrdersForCustomer(customer.id).length },
          {
            id: 'action',
            header: 'Details',
            cell: (customer) => (
              <Link to={`/admin/customers/${customer.id}`} className="underline">
                View
              </Link>
            ),
          },
        ]}
      />
    </div>
  )
}
