import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Bem-vindo ao LocaCar</h1>
      <p className="text-gray-600 text-lg mb-8 max-w-md">
        Alugue ou disponibilize seu veículo de forma simples e segura entre pessoas físicas.
      </p>
      <Link to="/vehicles" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700">
        Ver Veículos Disponíveis
      </Link>
    </main>
  )
}
