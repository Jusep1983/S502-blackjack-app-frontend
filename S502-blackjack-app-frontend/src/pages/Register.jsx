import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register({ setIsLoggedIn }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
 
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", {
        userName,
        password,
      });

      const { token } = response.data.data;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      setMessage("✅ Registro correcto");
      navigate("/menu");
    } catch (error) {
      setMessage("❌ Error en el registro");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleRegister} className="bg-gray-800 p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>

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

        

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold">
          Registrarse
        </button>

        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}

export default Register;
