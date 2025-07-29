import { jwtDecode } from "jwt-decode"
import { Link, useNavigate } from "react-router-dom"

function MainMenu() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  if (!token) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
          <p className="text-lg text-red-400 mb-4">No estás autenticado.</p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    )
  }

  const decoded = jwtDecode(token)
  const { sub: userName, role } = decoded

  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      {/* Header del menú */}
      <div className="flex-shrink-0 text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          🎮 Menú Principal
        </h1>
        <p className="text-xl text-gray-300">
          Bienvenido, <strong className="text-white">{userName}</strong>
          <span className="text-sm text-gray-400 ml-2">({role})</span>
        </p>
      </div>

      {/* Botones del menú */}
      <div className="flex-shrink-0 w-full max-w-sm">
        <div className="space-y-4">
          {role !== "SUPER_USER" && (
            <button
              onClick={() => navigate("/game")}
              className="w-full bg-green-600 hover:bg-green-700 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              🎮 Jugar al Blackjack
            </button>
          )}

          <Link
            to="/ranking"
            className="block w-full bg-yellow-600 hover:bg-yellow-700 py-4 px-6 rounded-lg text-center font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            📊 Ver Ranking
          </Link>

          {role !== "SUPER_USER" && (
            <Link
              to="/profile"
              className="block w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-lg text-center font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              👤 Mi Perfil
            </Link>
          )}

          {(role === "ADMIN" || role === "SUPER_USER") && (
            <Link
              to="/admin"
              className="block w-full bg-red-600 hover:bg-red-700 py-4 px-6 rounded-lg text-center font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              🛠️ Panel de Administración
            </Link>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Rol actual: <span className="text-white font-semibold">{role}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default MainMenu
