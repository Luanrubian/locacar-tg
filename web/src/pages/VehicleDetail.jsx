import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function ReservationModal({ vehicle, onClose, onSuccess }) {
  const [form, setForm] = useState({ start_date: '', end_date: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/reservations', { vehicle_id: vehicle.id, ...form })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao solicitar reserva')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Solicitar Reserva</h3>
        <p className="text-sm text-gray-500 mb-4">{vehicle.brand} {vehicle.model} · R$ {Number(vehicle.daily_rate).toFixed(2)}/dia</p>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm">Data de início
            <input className="border rounded px-3 py-2 w-full mt-1" type="date" required
              value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
          </label>
          <label className="text-sm">Data de fim
            <input className="border rounded px-3 py-2 w-full mt-1" type="date" required
              value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
          </label>
          <div className="flex gap-2 mt-2">
            <button className="bg-blue-600 text-white py-2 px-4 rounded flex-1 hover:bg-blue-700">Confirmar</button>
            <button type="button" onClick={onClose} className="border py-2 px-4 rounded hover:bg-gray-50">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function VehicleDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    api.get(`/vehicles/${id}`).then(({ data }) => setVehicle(data)).catch(() => navigate('/vehicles'))
  }, [id])

  if (!vehicle) return <p className="text-center py-12 text-gray-500">Carregando...</p>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {vehicle.image_url
        ? <img src={vehicle.image_url} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-60 object-cover rounded-xl mb-6" />
        : <div className="bg-gray-200 h-60 rounded-xl flex items-center justify-center text-gray-400 text-6xl mb-6">🚗</div>
      }
      <h2 className="text-3xl font-bold">{vehicle.brand} {vehicle.model}</h2>
      <p className="text-gray-500 mt-1">{vehicle.year} · Placa: {vehicle.plate}</p>
      <p className="text-blue-600 font-bold text-2xl mt-3">R$ {Number(vehicle.daily_rate).toFixed(2)}<span className="text-gray-400 font-normal text-base">/dia</span></p>

      <div className="mt-4 space-y-1 text-sm text-gray-600">
        <p>📍 {vehicle.city}/{vehicle.state}</p>
        <p>👤 Proprietário: {vehicle.owner_name} · {vehicle.owner_phone || 'Sem telefone'}</p>
        {vehicle.description && <p className="mt-3 text-gray-700">{vehicle.description}</p>}
      </div>

      {user?.role === 'locatario' && vehicle.status === 'available' && (
        <button onClick={() => setShowModal(true)}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
          Solicitar Reserva
        </button>
      )}
      {!user && (
        <p className="mt-8 text-center text-gray-500 text-sm">
          <a href="/login" className="text-blue-600 hover:underline">Entre na sua conta</a> para solicitar reserva.
        </p>
      )}

      {showModal && (
        <ReservationModal vehicle={vehicle} onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); navigate('/dashboard') }} />
      )}
    </div>
  )
}
