"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void
}

export default function Login({ setIsLoggedIn }: LoginProps) {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Simular API call
      // const response = await api.post("/auth/login", { userName, password })
      // const { token } = response.data.data

      // Simulación para demo
      if (userName && password) {
        localStorage.setItem("token", "demo-token")
        setIsLoggedIn(true)
        setMessage("✅ Login correcto")
        // navigate("/menu")
      } else {
        throw new Error("Credenciales inválidas")
      }
    } catch (error) {
      setMessage("❌ Usuario o contraseña incorrecto")
    }
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-4">
      {/* Logo responsivo que se adapta al espacio disponible */}
      <div className="flex-shrink-0 mb-6">
        <Image
          src="/placeholder.svg?height=200&width=300&text=BlackjackApp+Logo"
          alt="BlackjackApp Logo"
          width={300}
          height={200}
          className="w-48 sm:w-56 md:w-64 lg:w-72 h-auto animate-fade-in"
          priority
        />
      </div>

      {/* Formulario que se adapta al espacio restante */}
      <div className="flex-shrink-0 w-full max-w-xs">
        <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Entrar
            </button>
          </div>

          {message && <p className="mt-4 text-sm text-center font-medium">{message}</p>}
        </form>
      </div>
    </div>
  )
}