import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', currentPassword: '', newPassword: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/users/me').then(({ data }) => setForm(f => ({ ...f, name: data.name, phone: data.phone || '' })))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    try {
      await api.patch('/users/me', form)
      setMsg('Perfil atualizado com sucesso!')
    } catch (err) {
      setMsg(err.response?.data?.error || 'Erro ao atualizar')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Meu Perfil</h3>
      {msg && <p className="text-sm mb-3 text-green-600">{msg}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="border rounded px-3 py-2" placeholder="Nome"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Telefone"
          value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input className="border rounded px-3 py-2" type="password" placeholder="Senha atual (para alterar)"
          value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} />
        <input className="border rounded px-3 py-2" type="password" placeholder="Nova senha"
          value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Salvar</button>
      </form>
    </div>
  )
}

function VehicleForm({ vehicle, onSave, onCancel }) {
  const empty = { brand: '', model: '', year: '', plate: '', daily_rate: '', description: '', city: '', state: '', status: 'available' }
  const [form, setForm] = useState(vehicle || empty)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(vehicle?.image_url || null)
  const [error, setError] = useState('')

  function handleImage(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (imageFile) data.append('image', imageFile)

      if (vehicle) {
        await api.patch(`/vehicles/${vehicle.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/vehicles', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      onSave()
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar veículo')
    }
  }

  const inp = 'border rounded px-3 py-2'
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg">
      <h4 className="font-semibold">{vehicle ? 'Editar Veículo' : 'Novo Veículo'}</h4>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <input className={inp} placeholder="Marca" required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
        <input className={inp} placeholder="Modelo" required value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
        <input className={inp} placeholder="Ano" type="number" required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
        <input className={inp} placeholder="Placa" required value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })} />
        <input className={inp} placeholder="Diária (R$)" type="number" step="0.01" required value={form.daily_rate} onChange={e => setForm({ ...form, daily_rate: e.target.value })} />
        <select className={inp} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option value="available">Disponível</option>
          <option value="unavailable">Indisponível</option>
        </select>
        <input className={inp} placeholder="Cidade" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        <input className={inp} placeholder="Estado (UF)" maxLength={2} required value={form.state} onChange={e => setForm({ ...form, state: e.target.value.toUpperCase() })} />
      </div>
      <textarea className={inp} placeholder="Descrição (opcional)" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <div>
        <label className="block text-sm text-gray-600 mb-1">Imagem do veículo</label>
        {preview && <img src={preview} alt="preview" className="w-full h-40 object-cover rounded mb-2" />}
        <input type="file" accept="image/*" onChange={handleImage} className="text-sm" />
      </div>
      <div className="flex gap-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Salvar</button>
        <button type="button" onClick={onCancel} className="border px-4 py-2 rounded hover:bg-gray-50">Cancelar</button>
      </div>
    </form>
  )
}

function MyVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    const { data } = await api.get('/vehicles/mine')
    setVehicles(data)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm('Remover este veículo?')) return
    try {
      await api.delete(`/vehicles/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao remover')
    }
  }

  if (showForm || editing) {
    return <VehicleForm vehicle={editing} onSave={() => { setShowForm(false); setEditing(null); load() }} onCancel={() => { setShowForm(false); setEditing(null) }} />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Meus Veículos</h3>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">+ Novo Veículo</button>
      </div>
      {vehicles.length === 0 ? <p className="text-gray-500">Nenhum veículo cadastrado.</p> : (
        <div className="space-y-3">
          {vehicles.map(v => (
            <div key={v.id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{v.brand} {v.model} ({v.year})</p>
                <p className="text-sm text-gray-500">{v.city}/{v.state} · R$ {Number(v.daily_rate).toFixed(2)}/dia · {v.status === 'available' ? '✓ Disponível' : '✗ Indisponível'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(v)} className="text-blue-600 text-sm hover:underline">Editar</button>
                <button onClick={() => handleDelete(v.id)} className="text-red-500 text-sm hover:underline">Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function statusLabel(s) {
  return { pending: 'Pendente', approved: 'Aprovada', rejected: 'Recusada', cancelled: 'Cancelada' }[s] || s
}
function statusColor(s) {
  return { pending: 'text-yellow-600', approved: 'text-green-600', rejected: 'text-red-500', cancelled: 'text-gray-400' }[s] || ''
}

function MyReservations() {
  const [reservations, setReservations] = useState([])

  async function load() {
    const { data } = await api.get('/reservations')
    setReservations(data)
  }

  useEffect(() => { load() }, [])

  async function handleCancel(id) {
    if (!confirm('Cancelar esta reserva?')) return
    try {
      await api.patch(`/reservations/${id}/status`, { status: 'cancelled' })
      load()
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao cancelar')
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Minhas Reservas</h3>
      {reservations.length === 0 ? <p className="text-gray-500">Nenhuma reserva encontrada.</p> : (
        <div className="space-y-3">
          {reservations.map(r => (
            <div key={r.id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{r.brand} {r.model}</p>
                <p className="text-sm text-gray-500">{r.start_date?.split('T')[0]} → {r.end_date?.split('T')[0]} · R$ {Number(r.total_price).toFixed(2)}</p>
                <p className={`text-sm font-medium ${statusColor(r.status)}`}>{statusLabel(r.status)}</p>
              </div>
              {['pending', 'approved'].includes(r.status) && (
                <button onClick={() => handleCancel(r.id)} className="text-red-500 text-sm hover:underline">Cancelar</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OwnerRequests() {
  const [reservations, setReservations] = useState([])

  async function load() {
    const { data } = await api.get('/reservations')
    setReservations(data)
  }

  useEffect(() => { load() }, [])

  async function changeStatus(id, status) {
    try {
      await api.patch(`/reservations/${id}/status`, { status })
      load()
    } catch (err) {
      alert(err.response?.data?.error || 'Erro')
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Solicitações de Reserva</h3>
      {reservations.length === 0 ? <p className="text-gray-500">Nenhuma solicitação.</p> : (
        <div className="space-y-3">
          {reservations.map(r => (
            <div key={r.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{r.brand} {r.model}</p>
                  <p className="text-sm text-gray-500">Locatário: {r.renter_name}</p>
                  <p className="text-sm text-gray-500">{r.start_date?.split('T')[0]} → {r.end_date?.split('T')[0]} · R$ {Number(r.total_price).toFixed(2)}</p>
                  <p className={`text-sm font-medium ${statusColor(r.status)}`}>{statusLabel(r.status)}</p>
                </div>
                {r.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => changeStatus(r.id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Aprovar</button>
                    <button onClick={() => changeStatus(r.id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Recusar</button>
                  </div>
                )}
                {r.status === 'approved' && (
                  <button onClick={() => changeStatus(r.id, 'cancelled')} className="text-red-500 text-sm hover:underline">Cancelar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('profile')

  const tabs = [
    { key: 'profile', label: 'Perfil' },
    ...(user?.role === 'locador' || user?.role === 'admin' ? [{ key: 'vehicles', label: 'Meus Veículos' }, { key: 'requests', label: 'Solicitações' }] : []),
    ...(user?.role === 'locatario' ? [{ key: 'reservations', label: 'Minhas Reservas' }] : []),
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="flex gap-2 border-b mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'profile' && <Profile />}
      {tab === 'vehicles' && <MyVehicles />}
      {tab === 'requests' && <OwnerRequests />}
      {tab === 'reservations' && <MyReservations />}
    </div>
  )
}
