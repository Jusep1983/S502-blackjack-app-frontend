import { useState } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Game() {
  const [game, setGame] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pendingExit, setPendingExit] = useState(false);
  const token = localStorage.getItem("token");
  const { role } = jwtDecode(token);
  const navigate = useNavigate();

  const startGame = async () => {
    try {
      const response = await api.post(
        "/game/new",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGame(response.data.data);
      setMessage("🃏 ¡Nueva partida iniciada!");
    } catch (err) {
      console.error("❌ Error al iniciar partida", err);
      const msg =
        err.response?.data?.message || "❌ No se pudo iniciar partida";
      setMessage(msg);
    }
  };

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

  return (
    <div className="min-h-screen bg-green-900 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">🃏 Blackjack</h2>

      {message && <p className="text-center text-yellow-300 mb-4">{message}</p>}

      {role === "SUPER_USER" ? (
        <p className="text-center text-red-400 font-bold">
          ❌ Los SUPER_USER no pueden jugar partidas.
        </p>
      ) : !game ? (
        <div className="text-center mb-6">
          <button
            onClick={startGame}
            className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded font-bold text-lg"
          >
            🎮 Nueva Partida
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded shadow-lg space-y-6">
          <h3 className="text-2xl text-center mb-4">Partida #{game.id}</h3>

          <div>
            <h4 className="font-bold mb-1">
              👤 Tus cartas ({game.playerPoints} puntos):
            </h4>
            <div className="flex gap-2 flex-wrap">
              {game.playerHand.cards.map((card, i) => (
                <img
                  key={i}
                  src={getCardImage(card)}
                  alt={`${card.rank} of ${card.suit}`}
                  className="w-16"
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-1">🧑‍⚖️ Cartas del dealer:</h4>
            <div className="flex gap-2 flex-wrap">
              {game.dealerHand.cards.map((card, i) => (
                <img
                  key={i}
                  src={
                    game.gameStatus?.toUpperCase() === "FINISHED" || i === 0
                      ? getCardImage(card)
                      : "/cards/BACK.png"
                  }
                  alt="Carta dealer"
                  className="w-16"
                />
              ))}
            </div>

            {/* Mostrar puntos visibles del dealer */}
            {game.gameStatus === "IN_PROGRESS" && (
              <p className="mt-2">
                Carta visible del dealer:{" "}
                <strong className="text-blue-300">
                  {game.dealerHand.cards[0].value} puntos
                </strong>
              </p>
            )}

            {game.gameStatus === "FINISHED" && (
              <p className="mt-2">
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

          {game.gameStatus === "IN_PROGRESS" && (
            <div className="flex justify-center gap-4">
              <button
                onClick={hit}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-bold"
              >
                🃏 Pedir carta
              </button>
              <button
                onClick={stand}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold"
              >
                ✋ Plantarse
              </button>
            </div>
          )}

          {game.gameStatus === "FINISHED" && (
            <div className="text-center mt-4">
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold"
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
              className="bg-gray-700 hover:bg-gray-800 py-2 px-6 rounded font-bold"
            >
              ← Volver al Menú Principal
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96 text-center">
            <p className="mb-4">
              ¿Seguro que quieres salir? El dealer jugará y se resolverá la
              partida automáticamente.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleExit}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Sí, salir
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setPendingExit(false);
                }}
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

export default Game;
