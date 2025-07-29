import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

function MainMenu() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>No estás autenticado. Vuelve al login.</p>
      </div>
    );
  }

  const decoded = jwtDecode(token);
  const { sub: userName, role } = decoded;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-600 text-white">
      <h1 className="text-3xl font-bold mb-6">🎮 Menú principal</h1>
      <p className="mb-4 text-lg">
        Bienvenido, <strong>{userName}</strong> ({role})
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {role !== "SUPER_USER" && (
          <button
            onClick={() => navigate("/game")}
            className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded font-bold"
          >
            🎮 Jugar al blackjack
          </button>
        )}

        <Link
          to="/ranking"
          className="bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded text-center font-bold"
        >
          📊 Ver Ranking
        </Link>

        {role !== "SUPER_USER" && (
          <Link
            to="/profile"
            className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded text-center font-bold"
          >
          👤 Mi perfil
          </Link>
        )}

        {(role === "ADMIN" || role === "SUPER_USER") && (
          <Link
            to="/admin"
            className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded text-center font-bold"
          >
          🛠️ Panel de Administración
          </Link>
        )}
      </div>
    </div>
  );
}

export default MainMenu;
