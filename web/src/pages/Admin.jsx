import { useState, useEffect } from 'react'
import api from '../services/api'

function statusColor(s) {
  return { pending: 'text-yellow-600', approved: 'text-green-600', rejected: 'text-red-500', cancelled: 'text-gray-400' }[s] || ''
}

function Users() {
  const [users, setUsers] = useState([])
  useEffect(() => { api.get('/admin/users').then(({ data }) => setUsers(data)) }, [])
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Usuários ({users.length})</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-gray-50 text-left">
            <th className="border px-3 py-2">Nome</th>
            <th className="border px-3 py-2">E-mail</th>
            <th className="border px-3 py-2">Papel</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Cadastro</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{u.name}</td>
                <td className="border px-3 py-2">{u.email}</td>
                <td className="border px-3 py-2 capitalize">{u.role}</td>
                <td className="border px-3 py-2">{u.active ? '✓ Ativo' : '✗ Inativo'}</td>
                <td className="border px-3 py-2">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  useEffect(() => { api.get('/admin/vehicles').then(({ data }) => setVehicles(data)) }, [])
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Veículos ({vehicles.length})</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-gray-50 text-left">
            <th className="border px-3 py-2">Veículo</th>
            <th className="border px-3 py-2">Proprietário</th>
            <th className="border px-3 py-2">Cidade</th>
            <th className="border px-3 py-2">Diária</th>
            <th className="border px-3 py-2">Status</th>
          </tr></thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{v.brand} {v.model} ({v.year})</td>
                <td className="border px-3 py-2">{v.owner_name}</td>
                <td className="border px-3 py-2">{v.city}/{v.state}</td>
                <td className="border px-3 py-2">R$ {Number(v.daily_rate).toFixed(2)}</td>
                <td className="border px-3 py-2">{v.status === 'available' ? '✓ Disponível' : '✗ Indisponível'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Reservations() {
  const [reservations, setReservations] = useState([])
  const [status, setStatus] = useState('')
  useEffect(() => {
    api.get('/admin/reservations', { params: status ? { status } : {} }).then(({ data }) => setReservations(data))
  }, [status])
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-lg font-semibold">Reservas ({reservations.length})</h3>
        <select className="border rounded px-2 py-1 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="approved">Aprovada</option>
          <option value="rejected">Recusada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-gray-50 text-left">
            <th className="border px-3 py-2">Veículo</th>
            <th className="border px-3 py-2">Locatário</th>
            <th className="border px-3 py-2">Período</th>
            <th className="border px-3 py-2">Total</th>
            <th className="border px-3 py-2">Status</th>
          </tr></thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{r.brand} {r.model}</td>
                <td className="border px-3 py-2">{r.renter_name}</td>
                <td className="border px-3 py-2">{r.start_date?.split('T')[0]} → {r.end_date?.split('T')[0]}</td>
                <td className="border px-3 py-2">R$ {Number(r.total_price).toFixed(2)}</td>
                <td className={`border px-3 py-2 font-medium ${statusColor(r.status)}`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Admin() {
  const [tab, setTab] = useState('users')
  const tabs = [{ key: 'users', label: 'Usuários' }, { key: 'vehicles', label: 'Veículos' }, { key: 'reservations', label: 'Reservas' }]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Painel Administrativo</h2>
      <div className="flex gap-2 border-b mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'users' && <Users />}
      {tab === 'vehicles' && <Vehicles />}
      {tab === 'reservations' && <Reservations />}
    </div>
  )
}
