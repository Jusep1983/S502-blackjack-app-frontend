import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/player/ranking", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRanking(response.data.data);
      } catch (err) {
        console.error("❌ Error al cargar el ranking", err);
        setMessage("❌ No se pudo cargar el ranking de jugadores");
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        🏆 Ranking de Jugadores
      </h2>

      {message && <p className="text-center text-red-400">{message}</p>}

      <div className="overflow-x-auto max-w-4xl mx-auto">
        <table className="table-auto w-full text-sm text-left border border-gray-600">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="p-2">Posición</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Ganadas</th>
              <th className="p-2">Perdidas</th>
              <th className="p-2">Empates</th>
              <th className="p-2">% Victoria</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((player) => (
              <tr key={player.userName} className="border-b border-gray-600">
                <td className="p-2 text-center">{player.position}</td>
                <td className="p-2">{player.userName}</td>
                <td className="p-2 text-center">{player.gamesWon}</td>
                <td className="p-2 text-center">{player.gamesLost}</td>
                <td className="p-2 text-center">{player.gamesTied}</td>
                <td className="p-2 text-center">{player.winPercentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/menu")} // o "/main-menu" si usas esa ruta
          className="bg-gray-700 hover:bg-gray-800 py-2 px-4 rounded font-bold"
        >
          ← Volver al Menú Principal
        </button>
      </div>
    </div>
  );
}

export default Ranking;
