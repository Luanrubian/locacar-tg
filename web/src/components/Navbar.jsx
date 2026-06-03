import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold">LocaCar</Link>
      <div className="flex gap-4 items-center text-sm">
        <Link to="/vehicles" className="hover:underline">Veículos</Link>
        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Entrar</Link>
            <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">Cadastrar</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            {user.role === 'admin' && <Link to="/admin" className="hover:underline">Admin</Link>}
            <button onClick={handleLogout} className="hover:underline">Sair</button>
          </>
        )}
      </div>
    </nav>
  )
}
