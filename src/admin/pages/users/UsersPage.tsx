import { useState } from 'react'
import { AdminPageHeader } from '@/admin/components/AdminPageHeader'
import { DataTable } from '@/admin/components/DataTable'
import { StatusBadge } from '@/admin/components/StatusBadge'
import { DemoNotice } from '@/components/feedback/DemoNotice'
import { ConfirmationDialog } from '@/components/feedback/ConfirmationDialog'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getAdminResources, getAdminRoles, getAdminUsers, getPermissionActions } from '@/services/admin'
import type { AdminResource, AdminRole, AdminUser, PermissionAction } from '@/types'
import { fieldClass } from '@/utils/fields'

export function UsersPage() {
  usePageTitle('Users')
  const [users, setUsers] = useState<AdminUser[]>(() => getAdminUsers().map((user) => ({ ...user })))
  const [roles, setRoles] = useState<AdminRole[]>(() => structuredClone(getAdminRoles()))
  const [roleId, setRoleId] = useState(roles[0]?.id ?? '')
  const [pending, setPending] = useState<AdminUser | null>(null)
  const [notice, setNotice] = useState('Permission checkboxes are visual only. They do not enforce access.')
  const role = roles.find((item) => item.id === roleId) ?? roles[0]

  function toggle(resource: AdminResource, action: PermissionAction) {
    setRoles((current) =>
      current.map((item) => {
        if (item.id !== role?.id) return item
        const existing = item.permissions[resource]
        const next = existing.includes(action) ? existing.filter((entry) => entry !== action) : [...existing, action]
        return { ...item, permissions: { ...item.permissions, [resource]: next } }
      }),
    )
    setNotice('Visual only. That permission change is not saved and does not control access.')
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users and roles"
        description="Sample administrators. Activation and roles are not security controls."
        crumbs={[{ label: 'Users' }]}
      />
      <DemoNotice>{notice}</DemoNotice>
      <DataTable
        rows={users}
        getRowId={(user) => user.id}
        emptyLabel="No sample administrators."
        columns={[
          { id: 'name', header: 'Name', cell: (user) => user.name },
          { id: 'email', header: 'Email', cell: (user) => user.email },
          {
            id: 'role',
            header: 'Role',
            cell: (user) => (
              <select
                aria-label={`Role for ${user.name}`}
                className="h-11 border border-wire-line bg-white px-2"
                value={user.roleId}
                onChange={(event) => {
                  setUsers((current) => current.map((item) => (item.id === user.id ? { ...item, roleId: event.target.value } : item)))
                  setNotice('Role assignment changed in this view only.')
                }}
              >
                {roles.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            ),
          },
          {
            id: 'active',
            header: 'Account',
            cell: (user) => (
              <button
                type="button"
                onClick={() => {
                  setUsers((current) => current.map((item) => (item.id === user.id ? { ...item, active: !item.active } : item)))
                  setNotice('Activation changed in this view only. Nobody was signed in or out.')
                }}
              >
                <StatusBadge>{user.active ? 'Active' : 'Inactive'}</StatusBadge>
              </button>
            ),
          },
          { id: 'remove', header: 'Remove', cell: (user) => <button type="button" className="underline" onClick={() => setPending(user)}>Delete</button> },
        ]}
      />
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-bold">Permission categories</h2>
          <label className="text-sm">
            Role
            <select className={`${fieldClass} mt-1`} value={role?.id ?? ''} onChange={(event) => setRoleId(event.target.value)}>
              {roles.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
        </div>
        {role ? <p className="text-sm text-wire-muted">{role.description}</p> : null}
        <div className="overflow-x-auto border border-wire-line bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-wire-line">
                <th className="px-3 py-2">Resource</th>
                {getPermissionActions().map((action) => (
                  <th key={action} className="px-3 py-2 capitalize">{action}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getAdminResources().map((resource) => (
                <tr key={resource} className="border-b border-wire-line last:border-b-0">
                  <th scope="row" className="px-3 py-2 font-medium capitalize">{resource}</th>
                  {getPermissionActions().map((action) => (
                    <td key={action} className="px-3 py-2">
                      <input
                        type="checkbox"
                        aria-label={`${role?.name ?? 'Role'} can ${action} ${resource}`}
                        checked={role?.permissions[resource].includes(action) ?? false}
                        onChange={() => toggle(resource, action)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <ConfirmationDialog
        open={Boolean(pending)}
        title="Remove this sample user from the view?"
        description="The sample administrator returns on refresh. This is not an access change."
        confirmLabel="Remove from view"
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return
          setUsers((current) => current.filter((user) => user.id !== pending.id))
          setNotice(`${pending.name} was removed from this view only.`)
        }}
      />
    </div>
  )
}
