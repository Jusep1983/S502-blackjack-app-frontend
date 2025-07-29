import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { userName, password });
      const { token } = response.data.data;

      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      setMessage("✅ Login correcto");
      navigate("/menu");
    } catch (error) {
      setMessage("❌ Usuario o contraseña incorrecto");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-bold">
          Entrar
        </button>

        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}

export default Login;
