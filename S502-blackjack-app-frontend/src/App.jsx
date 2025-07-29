import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainMenu from "./pages/MainMenu";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Ranking from "./pages/Ranking";
import AdminPanel from "./pages/AdminPanel";
import Game from "./pages/Game";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/menu"
          element={
            <PrivateRoute>
              <MainMenu />
            </PrivateRoute>
          }
        />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

function Header({ isLoggedIn, setIsLoggedIn }) {
  if (!isLoggedIn) {
    return (
      <div className="bg-gray-900 text-white p-4 flex justify-center gap-6 text-lg">
        <Link to="/" className="hover:underline">Login</Link>
        <Link to="/register" className="hover:underline">Registro</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-end pr-6 text-lg">
      <button
        onClick={() => {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          window.location.href = "/";
        }}
        className="hover:underline text-red-400"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default App;