"use client"

import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MainMenu from "./pages/MainMenu"
import PrivateRoute from "./components/PrivateRoute"
import Profile from "./pages/Profile"
import Ranking from "./pages/Ranking"
import AdminPanel from "./pages/AdminPanel"
import Game from "./pages/Game"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  return (
    // Aplicamos las clases de Tailwind directamente aquí
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-sans">
      <BrowserRouter>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="flex-1 overflow-hidden">
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
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

function Header({ isLoggedIn, setIsLoggedIn }) {
  if (!isLoggedIn) {
    return (
      <header className="bg-gray-900 text-white p-4 flex justify-center gap-6 text-lg shrink-0">
        <Link to="/" className="hover:underline">
          Login
        </Link>
        <Link to="/register" className="hover:underline">
          Registro
        </Link>
      </header>
    )
  }

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-end pr-6 text-lg shrink-0">
      <button
        onClick={() => {
          localStorage.removeItem("token")
          setIsLoggedIn(false)
          window.location.href = "/"
        }}
        className="hover:underline text-red-400"
      >
        Cerrar sesión
      </button>
    </header>
  )
}

export default App
