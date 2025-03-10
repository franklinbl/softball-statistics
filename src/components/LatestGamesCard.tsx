import { Game } from "../types/game";
import { useFirestore } from "../hooks/useFirestore";
import Modal from "./Modal";
import { useState } from "react";
import StatsTurnAtBatTable from "./StatsTurnAtBatTable";
import { formatDate } from "../utils/formatDate";
import CalendarIcon from "../../public/assets/svgs/CalendarIcon";

const LatestGamesCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const { data: games, loading, error } = useFirestore<Game>(
    "games", [{ field: "date", direction: "desc" }], [], 3
  );

  const openModalWithGameDetails = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return (
      <>
        <h2 className="text-2xl font-bold text-[#53A867] text-left">Partidos anteriores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse mb-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="py-4 px-6 rounded-lg bg-[#F5FCF7] text-[#53A867] text-left"
            >
              <div className="flex items-center justify-start mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="ml-2 h-4 w-24 bg-gray-300 rounded"></div>
              </div>

              <div>
                <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-28 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 w-36 bg-gray-300 rounded opacity-50"></div>
              </div>
            </div>
          ))}
        </div>
      </>
    )}

  return (
    <>
      <h2 className="text-2xl font-bold text-[#53A867] mb-4 text-left">Partidos anteriores</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {games.map((game, index) => (
          <div
            key={index}
            className="py-4 px-6 rounded-lg bg-[#F5FCF7] text-[#53A867] text-left"
          >
            <div className="flex items-center justify-start mb-4">
              <div className="w-10 h-10 bg-[#fff3ea] rounded-full flex items-center justify-center">
                <CalendarIcon className="w-5 h-5" color="#CC5D03" />
              </div>
              <p className="ml-2 text-[#CC5D03]">{game.tournament?.name}</p>
            </div>

            <div>
              <p className="text-lg font-semibold">VS {game.opponent}</p>
              <p className="text-base text-[#8C939C]">Resultado: {(!game.runsHomeClub || !game.runsVisiting) ? 'Sin resultado' : (game.runsHomeClub + " - " + game.runsVisiting)}</p>
              <p className="text-sm text-[#8C939C]">
                Fecha: {formatDate(game.date)}
              </p>
              <button className="mt-4 px-5 bg-[#37A63D] text-white py-2 rounded hover:bg-green-700 transition-colors" onClick={() => openModalWithGameDetails(game)}>
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`Detalles del Juego contra ${selectedGame?.opponent || '-'}`}>
        {selectedGame && (
          <StatsTurnAtBatTable gameForStats={[selectedGame]} viewAVG={false} />
        )}
      </Modal>
    </>
  );
};

export default LatestGamesCard;