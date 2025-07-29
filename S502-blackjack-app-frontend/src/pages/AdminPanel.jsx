import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { jwtDecode } from "jwt-decode"

function AdminPanel() {
  const [players, setPlayers] = useState([])
  const [message, setMessage] = useState("")
  const [playerToDelete, setPlayerToDelete] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const { role: currentRole } = jwtDecode(token)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const response = await api.get("/player/ranking", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const sorted = response.data.data.sort((a, b) => {
        const order = { SUPER_USER: 0, ADMIN: 1, USER: 2 }
        if (order[a.role] !== order[b.role]) return order[a.role] - order[b.role]
        return a.userName.localeCompare(b.userName)
      })
      setPlayers(sorted)
    } catch (err) {
      console.error("❌ Error al cargar jugadores", err)
      setMessage("❌ No se pudo cargar la lista de jugadores")
    }
  }

  const handleDelete = async (userName) => {
    try {
      const response = await api.delete(`/admin/delete-player/by-username/${userName}`, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      })
      if (response.status === 200 || response.status === 204) {
        setMessage(`✅ Jugador ${userName} eliminado correctamente`)
        setPlayers((prev) => prev.filter((p) => p.userName !== userName))
      } else {
        console.error("❌ Backend respondió error:", response)
        setMessage("❌ No se pudo eliminar al jugador")
      }
    } catch (err) {
      console.error(err)
      setMessage("❌ Error de red al eliminar")
    }
  }

  const handleRoleChange = async (playerId, newRole) => {
    try {
      const response = await api.patch(`/admin/set-role/${playerId}?newRole=${newRole}`, null, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      })
      if (response.status === 200) {
        setMessage(`✅ Rol actualizado a ${newRole}`)
        fetchPlayers()
      } else {
        try {
          let msg = ""
          if (response.data?.message) {
            msg = response.data.message
          } else if (typeof response.data === "string") {
            msg = response.data
          } else {
            msg = "❌ Error inesperado del servidor"
          }
          if (response.status === 403 && msg === "Forbidden") {
            msg = "❌ No tienes permiso para cambiar este rol (SUPER_USER)"
          }
          setMessage(`${msg}`)
        } catch (parseError) {
          setMessage("❌ Error al procesar la respuesta del servidor")
        }
      }
    } catch (err) {
      console.error("❌ Error en handleRoleChange:", err)
      setMessage("❌ Error de red al cambiar el rol")
    }
  }

  return (
    <div className="h-full flex flex-col px-4 py-6">
      {/* Header */}
      <div className="flex-shrink-0 text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
          🛠️ Panel de Administración
        </h2>
        {message && <p className="mt-3 text-center text-yellow-400 font-medium">{message}</p>}
      </div>

      {/* Tabla con scroll interno */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
              <table className="table-auto w-full text-sm text-left">
                <thead className="bg-gray-700 text-gray-300 sticky top-0">
                  <tr>
                    <th className="p-4 font-semibold">Usuario</th>
                    <th className="p-4 font-semibold">Rol</th>
                    <th className="p-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p) => (
                    <tr key={p.userName} className="border-b border-gray-600 hover:bg-gray-750 transition-colors">
                      <td className="p-4">
                        <div>
                          <span className="font-medium">{p.userName}</span>
                          <span className="text-gray-400 text-xs ml-2">({p.playerId})</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold
                            ${
                              p.role === "SUPER_USER"
                                ? "bg-purple-600 text-white"
                                : p.role === "ADMIN"
                                  ? "bg-blue-600 text-white"
                                  : "bg-green-600 text-white"
                            }`}
                        >
                          {p.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 flex-wrap">
                          {(currentRole === "ADMIN" || currentRole === "SUPER_USER") && (
                            <button
                              onClick={() => setPlayerToDelete(p)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                p.role === "SUPER_USER" || (currentRole === "ADMIN" && p.role === "ADMIN")
                                  ? "bg-gray-500 cursor-not-allowed text-gray-300"
                                  : "bg-red-600 hover:bg-red-700 text-white hover:scale-105"
                              }`}
                              disabled={p.role === "SUPER_USER" || (currentRole === "ADMIN" && p.role === "ADMIN")}
                            >
                              🗑️ Borrar
                            </button>
                          )}
                          {currentRole === "SUPER_USER" && (
                            <select
                              value={p.role}
                              onChange={(e) => handleRoleChange(p.playerId, e.target.value)}
                              className={`bg-gray-700 text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                p.role === "SUPER_USER" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
                              }`}
                              disabled={p.role === "SUPER_USER"}
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 text-center mt-6">
        <button
          onClick={() => navigate("/menu")}
          className="bg-gray-700 hover:bg-gray-800 py-3 px-6 rounded-lg font-bold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          ← Volver al Menú Principal
        </button>
      </div>

      {/* Modal de confirmación */}
      {playerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md text-center">
            <h3 className="text-xl font-bold mb-4 text-red-400">⚠️ Confirmar eliminación</h3>
            <p className="mb-6 text-gray-300">
              ¿Eliminar al jugador <strong className="text-white">{playerToDelete.userName}</strong> y todas sus
              partidas?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleDelete(playerToDelete.userName)
                  setPlayerToDelete(null)
                }}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-bold transition-all hover:scale-105"
              >
                Sí, borrar
              </button>
              <button
                onClick={() => setPlayerToDelete(null)}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-bold transition-all hover:scale-105"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
