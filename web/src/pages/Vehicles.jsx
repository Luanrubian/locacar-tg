import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [filters, setFilters] = useState({ brand: '', city: '', max_price: '' })
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    const params = {}
    if (filters.brand) params.brand = filters.brand
    if (filters.city) params.city = filters.city
    if (filters.max_price) params.max_price = filters.max_price
    try {
      const { data } = await api.get('/vehicles', { params })
      setVehicles(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function handleFilter(e) {
    e.preventDefault()
    load()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Veículos Disponíveis</h2>

      <form onSubmit={handleFilter} className="flex flex-wrap gap-3 mb-8 p-4 bg-gray-50 rounded-lg">
        <input className="border rounded px-3 py-2 text-sm" placeholder="Marca" value={filters.brand}
          onChange={e => setFilters({ ...filters, brand: e.target.value })} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Cidade" value={filters.city}
          onChange={e => setFilters({ ...filters, city: e.target.value })} />
        <input className="border rounded px-3 py-2 text-sm w-36" type="number" placeholder="Preço máx/dia"
          value={filters.max_price} onChange={e => setFilters({ ...filters, max_price: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Filtrar</button>
        <button type="button" onClick={() => { setFilters({ brand: '', city: '', max_price: '' }); setTimeout(load, 0) }}
          className="border px-4 py-2 rounded text-sm hover:bg-gray-100">Limpar</button>
      </form>

      {loading ? <p className="text-gray-500">Carregando...</p> : vehicles.length === 0 ? (
        <p className="text-gray-500">Nenhum veículo encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(v => (
            <Link key={v.id} to={`/vehicles/${v.id}`} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              {v.image_url
                ? <img src={v.image_url} alt={`${v.brand} ${v.model}`} className="w-full h-40 object-cover" />
                : <div className="bg-gray-200 h-40 flex items-center justify-center text-gray-400 text-4xl">🚗</div>
              }
              <div className="p-4">
                <h3 className="font-semibold text-lg">{v.brand} {v.model}</h3>
                <p className="text-gray-500 text-sm">{v.year} · {v.city}/{v.state}</p>
                <p className="text-blue-600 font-bold mt-2">R$ {Number(v.daily_rate).toFixed(2)}<span className="text-gray-400 font-normal text-sm">/dia</span></p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
