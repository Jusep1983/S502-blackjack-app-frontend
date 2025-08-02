import { useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"

function Register({ setIsLoggedIn }) {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      const response = await api.post("/auth/register", {
        userName,
        password,
      })
      const { token } = response.data.data
      localStorage.setItem("token", token)
      setIsLoggedIn(true)
      setMessage("✅ Registro correcto")
      navigate("/menu")
    } catch (error) {
      setMessage("❌ Error en el registro")
    }
    setLoading(false)
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-4">
      <div className="flex-shrink-0 mb-6 max-h-64">
        <img
          src="/logo-blackjack-transparent.png"
          alt="BlackjackApp Logo"
          className="w-80 max-w-sm sm:w-96 md:w-[28rem] lg:w-[32rem] h-auto max-h-full object-contain animate-fade-in"
        />
      </div>
      <div className="flex-shrink-0 w-full max-w-xs">
        <form onSubmit={handleRegister} className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>
          {message && <p className="mt-3 text-sm text-center font-medium">{message}</p>}
        </form>
      </div>
    </div>
  )
}

export default Register
