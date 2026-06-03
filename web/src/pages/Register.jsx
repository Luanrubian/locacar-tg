import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'locatario', phone: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/register', form)
      login(data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="border rounded px-3 py-2" placeholder="Nome" required
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded px-3 py-2" type="email" placeholder="E-mail" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="border rounded px-3 py-2" type="password" placeholder="Senha" required
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Telefone (opcional)"
            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <select className="border rounded px-3 py-2"
            value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="locatario">Quero alugar veículos</option>
            <option value="locador">Quero disponibilizar meu veículo</option>
          </select>
          <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Cadastrar</button>
        </form>
        <p className="text-sm text-center mt-4">Já tem conta? <Link to="/login" className="text-blue-600 hover:underline">Entrar</Link></p>
      </div>
    </div>
  )
}
