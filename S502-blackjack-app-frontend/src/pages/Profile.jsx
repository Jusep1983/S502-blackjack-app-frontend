import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const [player, setPlayer] = useState(null);
  const [newAlias, setNewAlias] = useState("");
  const [message, setMessage] = useState("");
  const [showGames, setShowGames] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/player/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const playerData = response.data.data;
        setPlayer(playerData);
        setNewAlias(playerData.alias);
      } catch (err) {
        console.error("❌ Error al cargar perfil:", err);
        setMessage("❌ Error al cargar datos del jugador");
      }
    };

    fetchPlayer();
  }, []);

  const handleAliasUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/player/updateAlias",
        { alias: newAlias },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Alias actualizado correctamente");
      setPlayer((prev) => ({ ...prev, alias: newAlias }));
    } catch (error) {
      console.error(error);
      const backendMessage =
        error.response?.data?.data?.message || error.response?.data?.message;

      if (backendMessage?.includes("Alias already in use")) {
        setMessage("❌ Ese alias ya está en uso. Elige otro diferente.");
      } else if (backendMessage) {
        setMessage("❌ " + backendMessage);
      } else {
        setMessage("❌ No se pudo actualizar el alias");
      }
    }
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg animate-pulse">⏳ Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        👤 Perfil del Jugador
      </h2>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto mb-6">
        <p>
          <strong>Usuario:</strong> {player.userName}
        </p>
        <p>
          <strong>Alias:</strong> {player.alias}
        </p>
        <p>
          <strong>Partidas jugadas:</strong> {player.gamesPlayed}
        </p>
        <p>
          <strong>Ganadas:</strong> {player.gamesWon}
        </p>
        <p>
          <strong>Perdidas:</strong> {player.gamesLost}
        </p>
        <p>
          <strong>Empates:</strong> {player.gamesTied}
        </p>

        <div className="mt-4">
          <label className="block mb-1">Nuevo alias:</label>
          <input
            type="text"
            value={newAlias}
            onChange={(e) => setNewAlias(e.target.value)}
            className="p-2 w-full rounded bg-gray-700 text-white"
          />
          <button
            onClick={handleAliasUpdate}
            className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold w-full"
          >
            Actualizar alias
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => setShowGames(!showGames)}
          className="bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded font-bold"
        >
          {showGames ? "🔽 Ocultar Partidas" : "🎮 Ver Partidas"}
        </button>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showGames ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md mt-4">
          <h3 className="text-xl font-bold mb-4">🃏 Tus Partidas</h3>
          {player.games.length === 0 ? (
            <p className="text-gray-400">No tienes partidas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">ID</th>
                    <th className="p-2">Estado</th>
                    <th className="p-2">Resultado</th>
                    <th className="p-2">Creada</th>
                  </tr>
                </thead>
                <tbody>
                  {player.games.map((game) => (
                    <tr key={game.id} className="border-b border-gray-600">
                      <td className="p-2">{game.number}</td>
                      <td className="p-2">{game.id}</td>
                      <td className="p-2">{game.status}</td>
                      <td className="p-2">{game.result}</td>
                      <td className="p-2">
                        {new Date(game.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/menu")}
          className="bg-gray-700 hover:bg-gray-800 py-2 px-6 rounded font-bold"
        >
          ← Volver al Menú Principal
        </button>
      </div>
    </div>
  );
}

export default Profile;
