import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Ranking() {
  const [ranking, setRanking] = useState([])
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await api.get("/player/ranking", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setRanking(response.data.data)
      } catch (err) {
        console.error("❌ Error al cargar el ranking", err)
        setMessage("❌ No se pudo cargar el ranking de jugadores")
      }
    }

    fetchRanking()
  }, [])

  const getPodiumIcon = (position) => {
    switch (position) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return `${position}°`
    }
  }

  const getPodiumColor = (position) => {
    switch (position) {
      case 1:
        return "text-yellow-400"
      case 2:
        return "text-gray-300"
      case 3:
        return "text-orange-400"
      default:
        return "text-white"
    }
  }

  return (
    <div className="h-full flex flex-col px-4 py-6">
      {/* Header */}
      <div className="flex-shrink-0 text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          🏆 Ranking de Jugadores
        </h2>
        {message && <p className="mt-3 text-center text-red-400">{message}</p>}
      </div>

      {/* Tabla con scroll interno */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
              <table className="table-auto w-full text-sm text-left">
                <thead className="bg-gray-700 text-gray-300 sticky top-0">
                  <tr>
                    <th className="p-4 font-semibold">Posición</th>
                    <th className="p-4 font-semibold">Usuario</th>
                    <th className="p-4 font-semibold text-center">Ganadas</th>
                    <th className="p-4 font-semibold text-center">Perdidas</th>
                    <th className="p-4 font-semibold text-center">Empates</th>
                    <th className="p-4 font-semibold text-center">% Victoria</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((player) => (
                    <tr
                      key={player.userName}
                      className={`border-b border-gray-600 hover:bg-gray-750 transition-colors ${
                        player.position <= 3 ? "bg-gray-750" : ""
                      }`}
                    >
                      <td className={`p-4 text-center font-bold text-lg ${getPodiumColor(player.position)}`}>
                        {getPodiumIcon(player.position)}
                      </td>
                      <td className="p-4">
                        <span className={`font-medium ${getPodiumColor(player.position)}`}>{player.userName}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-green-600 rounded text-xs font-bold">{player.gamesWon}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-red-600 rounded text-xs font-bold">{player.gamesLost}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-yellow-600 rounded text-xs font-bold">{player.gamesTied}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            Number.parseFloat(player.winPercentage) >= 70
                              ? "bg-green-600"
                              : Number.parseFloat(player.winPercentage) >= 50
                                ? "bg-yellow-600"
                                : "bg-red-600"
                          }`}
                        >
                          {player.winPercentage}%
                        </span>
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
    </div>
  )
}

export default Ranking
