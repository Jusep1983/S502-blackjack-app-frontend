import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

function AdminPanel() {
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState("");
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const { role: currentRole } = jwtDecode(token);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await api.get("/player/ranking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = response.data.data.sort((a, b) => {
        const order = { SUPER_USER: 0, ADMIN: 1, USER: 2 };
        if (order[a.role] !== order[b.role])
          return order[a.role] - order[b.role];
        return a.userName.localeCompare(b.userName);
      });
      setPlayers(sorted);
    } catch (err) {
      console.error("❌ Error al cargar jugadores", err);
      setMessage("❌ No se pudo cargar la lista de jugadores");
    }
  };

  const handleDelete = async (userName) => {
    try {
      const response = await api.delete(
        `/admin/delete-player/by-username/${userName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: () => true,
        }
      );

      if (response.status === 200 || response.status === 204) {
        setMessage(`✅ Jugador ${userName} eliminado correctamente`);
        setPlayers((prev) => prev.filter((p) => p.userName !== userName));
      } else {
        console.error("❌ Backend respondió error:", response);
        setMessage("❌ No se pudo eliminar al jugador");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error de red al eliminar");
    }
  };

  const handleRoleChange = async (playerId, newRole) => {
    const player = players.find((p) => p.playerId === playerId);

    try {
      const response = await api.patch(
        `/admin/set-role/${playerId}?newRole=${newRole}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: () => true,
        }
      );

      if (response.status === 200) {
        setMessage(`✅ Rol actualizado a ${newRole}`);
        fetchPlayers();
      } else {
        try {
          let msg = "";
          if (response.data?.message) {
            msg = response.data.message;
          } else if (typeof response.data === "string") {
            msg = response.data;
          } else {
            msg = "❌ Error inesperado del servidor";
          }

          if (response.status === 403 && msg === "Forbidden") {
            msg = "❌ No tienes permiso para cambiar este rol (SUPER_USER)";
          }

          setMessage(`${msg}`);
        } catch (parseError) {
          setMessage("❌ Error al procesar la respuesta del servidor");
        }
      }
    } catch (err) {
      console.error("❌ Error en handleRoleChange:", err);
      setMessage("❌ Error de red al cambiar el rol");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        🛠️ Panel de Administración
      </h2>

      {message && <p className="text-center text-yellow-400 mb-4">{message}</p>}

      <div className="overflow-x-auto max-w-5xl mx-auto">
        <table className="table-auto w-full text-sm text-left border border-gray-600">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="p-2">Usuario</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.userName} className="border-b border-gray-600">
                <td className="p-2">
                  {p.userName}{" "}
                  <span className="text-gray-500 text-xs">({p.playerId})</span>
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold
                      ${
                        p.role === "SUPER_USER"
                          ? "bg-purple-600"
                          : p.role === "ADMIN"
                          ? "bg-blue-600"
                          : "bg-green-600"
                      }`}
                  >
                    {p.role}
                  </span>
                </td>

                <td className="p-2 space-x-2">
                  {(currentRole === "ADMIN" ||
                    currentRole === "SUPER_USER") && (
                    <button
                      onClick={() => setPlayerToDelete(p)}
                      className={`px-3 py-1 rounded ${
                        p.role === "SUPER_USER" ||
                        (currentRole === "ADMIN" && p.role === "ADMIN")
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                      disabled={
                        p.role === "SUPER_USER" ||
                        (currentRole === "ADMIN" && p.role === "ADMIN")
                      }
                    >
                      🗑️ Borrar
                    </button>
                  )}

                  {currentRole === "SUPER_USER" && (
                    <select
                      value={p.role}
                      onChange={(e) =>
                        handleRoleChange(p.playerId, e.target.value)
                      }
                      className={`bg-gray-700 text-white px-2 py-1 rounded ${
                        p.role === "SUPER_USER"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={p.role === "SUPER_USER"}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/menu")}
          className="bg-gray-700 hover:bg-gray-800 py-2 px-6 rounded font-bold"
        >
          ← Volver al Menú Principal
        </button>
      </div>

      {/* Modal de confirmación */}
      {playerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-80 text-center">
            <p className="mb-4">
              ¿Eliminar al jugador <strong>{playerToDelete.userName}</strong> y
              todas sus partidas?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleDelete(playerToDelete.userName);
                  setPlayerToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Sí, borrar
              </button>
              <button
                onClick={() => setPlayerToDelete(null)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
