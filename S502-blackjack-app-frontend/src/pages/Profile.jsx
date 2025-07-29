import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Profile() {
  const [player, setPlayer] = useState(null)
  const [newAlias, setNewAlias] = useState("")
  const [message, setMessage] = useState("")
  const [showGames, setShowGames] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await api.get("/player/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const playerData = response.data.data
        setPlayer(playerData)
        setNewAlias(playerData.alias)
      } catch (err) {
        console.error("❌ Error al cargar perfil:", err)
        setMessage("❌ Error al cargar datos del jugador")
      }
    }

    fetchPlayer()
  }, [])

  const handleAliasUpdate = async () => {
    try {
      const token = localStorage.getItem("token")
      await api.put("/player/updateAlias", { alias: newAlias }, { headers: { Authorization: `Bearer ${token}` } })
      setMessage("✅ Alias actualizado correctamente")
      setPlayer((prev) => ({ ...prev, alias: newAlias }))
    } catch (error) {
      console.error(error)
      const backendMessage = error.response?.data?.data?.message || error.response?.data?.message
      if (backendMessage?.includes("Alias already in use")) {
        setMessage("❌ Ese alias ya está en uso. Elige otro diferente.")
      } else if (backendMessage) {
        setMessage("❌ " + backendMessage)
      } else {
        setMessage("❌ No se pudo actualizar el alias")
      }
    }
  }

  if (!player) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">⏳ Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col px-4 py-6">
      {/* Header */}
      <div className="flex-shrink-0 text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          👤 Perfil del Jugador
        </h2>
      </div>

      {/* Contenido principal con scroll */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Información del perfil */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <p className="flex justify-between">
                  <strong>Usuario:</strong>
                  <span className="text-blue-300">{player.userName}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Alias:</strong>
                  <span className="text-green-300">{player.alias}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Partidas jugadas:</strong>
                  <span className="text-yellow-300">{player.gamesPlayed}</span>
                </p>
              </div>
              <div className="space-y-3">
                <p className="flex justify-between">
                  <strong>Ganadas:</strong>
                  <span className="text-green-400">{player.gamesWon}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Perdidas:</strong>
                  <span className="text-red-400">{player.gamesLost}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Empates:</strong>
                  <span className="text-gray-400">{player.gamesTied}</span>
                </p>
              </div>
            </div>

            {/* Actualizar alias */}
            <div className="border-t border-gray-600 pt-4">
              <label className="block mb-2 font-semibold">Cambiar alias:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Nuevo alias"
                />
                <button
                  onClick={handleAliasUpdate}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Actualizar
                </button>
              </div>
              {message && <p className="mt-3 text-sm text-center font-medium">{message}</p>}
            </div>
          </div>

          {/* Botón para mostrar/ocultar partidas */}
          <div className="text-center">
            <button
              onClick={() => setShowGames(!showGames)}
              className="bg-indigo-600 hover:bg-indigo-700 py-3 px-6 rounded-lg font-bold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {showGames ? "🔽 Ocultar Partidas" : "🎮 Ver Partidas"}
            </button>
          </div>

          {/* Lista de partidas */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showGames ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-bold mb-4">🃏 Tus Partidas</h3>
              {player.games.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No tienes partidas registradas.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left">
                    <thead className="bg-gray-700 text-gray-300">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">ID</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Resultado</th>
                        <th className="p-3">Creada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {player.games.map((game) => (
                        <tr key={game.id} className="border-b border-gray-600 hover:bg-gray-750 transition-colors">
                          <td className="p-3">{game.number}</td>
                          <td className="p-3">{game.id}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded text-xs bg-blue-600">{game.status}</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                game.result === "PLAYER_WIN"
                                  ? "bg-green-600"
                                  : game.result === "DEALER_WIN"
                                    ? "bg-red-600"
                                    : "bg-yellow-600"
                              }`}
                            >
                              {game.result}
                            </span>
                          </td>
                          <td className="p-3 text-sm">{new Date(game.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
    </div>
  )
}

export default Profile