"use client";

import { useEffect, useState } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Game() {
  const [game, setGame] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pendingExit, setPendingExit] = useState(false);
  const [userName, setUserName] = useState("Jugador");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let role = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      role = decodedToken?.role;
      if (decodedToken?.userName) {
        setUserName(decodedToken.userName);
      }
    } catch (e) {
      console.error("Error decoding token:", e);
    }
  }

  const navigate = useNavigate();

  const startGame = async () => {
    try {
      const response = await api.post(
        "/game/new",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGame(response.data.data);
      setMessage(`🃏 ¡Nueva partida ${response.data.data.id} iniciada!`);
    } catch (err) {
      console.error("❌ Error al iniciar partida", err);
      const msg =
        err.response?.data?.message || "❌ No se pudo iniciar partida";
      setMessage(msg);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  const hit = async () => {
    try {
      const response = await api.post(
        `/game/${game.id}/hit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGame(response.data.data);
    } catch (err) {
      console.error("❌ Error al pedir carta", err);
      setMessage("❌ No se pudo pedir carta");
    }
  };

  const stand = async () => {
    try {
      const response = await api.post(
        `/game/${game.id}/stand`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGame(response.data.data);
    } catch (err) {
      console.error("❌ Error al plantarse", err);
      setMessage("❌ No se pudo plantarse");
    }
  };

  const getCardImage = (card) => {
    return `/cards/${card.suit}_${card.rank}.png`;
  };

  const handleExit = async () => {
    if (pendingExit && game?.gameStatus === "IN_PROGRESS") {
      try {
        await api.post(
          `/game/${game.id}/stand`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("❌ Error forzando stand antes de salir", err);
      }
    }
    setShowModal(false);
    setPendingExit(false);
    navigate("/menu");
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg animate-pulse">Cargando partida...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-6 px-4">
      <div className="scale-100 md:scale-[0.8] origin-top transform w-full max-w-6xl bg-green-900 table-felt p-8 rounded-xl shadow-lg space-y-8">
        <div className="flex justify-center mb-4">
          <img
            src="/logo-blackjack-transparent.png"
            alt="Blackjack App Logo"
            className="h-40 md:h-40 scale-[1.7]"
          />
        </div>
        {message && (
          <p className="text-center text-yellow-300 text-lg mb-8">{message}</p>
        )}
        {role === "SUPER_USER" ? (
          <p className="text-center text-red-400 font-bold">
            ❌ Los SUPER_USER no pueden jugar partidas.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-xl font-bold mb-2">
                  👤 Tus cartas ({game.playerPoints} puntos):
                </h4>
                <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                  {game.playerHand.cards.map((card, i) => (
                    <img
                      key={i}
                      src={getCardImage(card) || "/placeholder.svg"}
                      alt={`${card.rank} of ${card.suit}`}
                      className="w-20 sm:w-24 md:w-28 rounded-md"
                    />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-xl font-bold mb-2">
                  🧑‍⚖️ Cartas del dealer:
                </h4>
                <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                  {game.dealerHand.cards.map((card, i) => (
                    <img
                      key={i}
                      src={
                        game.gameStatus?.toUpperCase() === "FINISHED" || i === 0
                          ? getCardImage(card)
                          : "/cards/BACK.png"
                      }
                      alt="Carta dealer"
                      className="w-20 sm:w-24 md:w-28 rounded-md"
                    />
                  ))}
                </div>
                {game.gameStatus === "IN_PROGRESS" && (
                  <p className="mt-3 text-lg">
                    Carta visible del dealer:{" "}
                    <strong className="text-blue-300 text-xl">
                      {game.dealerHand.cards[0].value} puntos
                    </strong>
                  </p>
                )}
                {game.gameStatus === "FINISHED" && (
                  <p className="mt-3 text-lg">
                    Dealer: {game.dealerPoints} puntos | Resultado:{" "}
                    <strong
                      className={
                        game.gameResult === "PLAYER_WIN"
                          ? "text-green-400"
                          : game.gameResult === "DEALER_WIN"
                          ? "text-red-400"
                          : "text-yellow-300"
                      }
                    >
                      {game.gameResult}
                    </strong>
                  </p>
                )}
              </div>
            </div>
            {game.gameStatus === "IN_PROGRESS" && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={hit}
                  className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-bold text-lg"
                >
                  🃏 Pedir carta
                </button>
                <button
                  onClick={stand}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold text-lg"
                >
                  ✋ Plantarse
                </button>
              </div>
            )}
            {game.gameStatus === "FINISHED" && (
              <div className="text-center mt-4">
                <button
                  onClick={startGame}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold text-lg"
                >
                  🔁 Jugar otra vez
                </button>
              </div>
            )}
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  if (game && game.gameStatus === "IN_PROGRESS") {
                    setShowModal(true);
                    setPendingExit(true);
                  } else {
                    navigate("/menu");
                  }
                }}
                className="bg-gray-700 hover:bg-gray-800 py-3 px-8 rounded-lg font-bold text-lg"
              >
                ← Volver al Menú Principal
              </button>
            </div>
          </>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-center">
              <p className="mb-6 text-lg">
                ¿Seguro que quieres salir? El dealer jugará y se resolverá la
                partida automáticamente.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleExit}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-lg"
                >
                  Sí, salir
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setPendingExit(false);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg text-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
