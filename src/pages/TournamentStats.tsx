import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Game } from '../types/game';
import { Tournament } from '../types/tournament';
import Modal from '../components/Modal';
import StatsTurnAtBatTable from '../components/StatsTurnAtBatTable';
import GameTable from '../components/GameTable';
import GameForm from "../components/GameForm";
import { useFirestore } from "../hooks/useFirestore";
import Loading from '../components/Loading';
import { formatDate } from '../utils/formatDate';
import CalendarIcon from '../../public/assets/svgs/CalendarIcon';
import FlagIcon from '../../public/assets/svgs/FlahIcon';

const TournamentStats: React.FC = () => {
  const { id } = useParams();
  const { getCollection, getDocument } = useFirestore("games");
  const [games, setGames] = useState<Game[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchGamesByTournament = useCallback(async () => {
    if (!id) return;
    try {
      const gamesData = await getCollection<Game>('games', [['tournament.id', '==', id]]);
      setGames(gamesData);
    } catch (error) {
      console.error('Error al obtener juegos del torneo:', error);
    }
  }, [id, getCollection]);

  const fetchTournamentDetails = useCallback(async () => {
    if (!id) return;
    try {
      const tournamentData = await getDocument<Tournament>('tournaments', id);
      if (tournamentData) {
        setTournament(tournamentData);
      } else {
        console.error('El torneo no existe.');
      }
    } catch (error) {
      console.error('Error al obtener detalles del torneo:', error);
    } finally {
      setLoading(false);
    }
  }, [id, getDocument]);

  useEffect(() => {
    fetchTournamentDetails();
    fetchGamesByTournament();
  }, []);


  const openModalWithGameDetails = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const openEditModal = (game: Game) => {
    setSelectedGame(game);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedGame(null);
  };

  if (loading) return <Loading />;
  if (!tournament) return <p className="text-white">No se encontró el torneo.</p>;

  return (
    <div className="py-0">
      <h1 className="text-3xl font-bold mb-6">Estadísticas del Torneo: {tournament.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div
          className="py-4 px-6 rounded-lg bg-[#F6FCF5] text-[#53A867] text-left"
        >
          <div className="flex items-center justify-start mb-4">
            <div className="w-10 h-10 bg-[#ECF9EC] rounded-full flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" color="#00C846" />
            </div>
          </div>

          <div className='mb-4'>
            <p className="text-black text-xl font-bold">Fecha inicio</p>
            <p className="text-md text-[#6C7381]">{formatDate(tournament.startDate)}</p>
          </div>
        </div>
        <div
          className="py-4 px-6 rounded-lg bg-[#F6FCF5] text-[#53A867] text-left"
        >
          <div className="flex items-center justify-start mb-4">
            <div className="w-10 h-10 bg-[#ECF9EC] rounded-full flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" color="#00C846" />
            </div>
          </div>

          <div className='mb-4'>
            <p className="text-black text-xl font-bold">Fecha fin</p>
            <p className="text-md text-[#6C7381]">{formatDate(tournament.endDate)}</p>
          </div>
        </div>
        <div
          className="py-4 px-6 rounded-lg bg-[#F6FCF5] text-[#53A867] text-left"
        >
          <div className="flex items-center justify-start mb-4">
            <div className="w-10 h-10 bg-[#ECF9EC] rounded-full flex items-center justify-center">
              <FlagIcon className="w-5 h-5" color="#00C846" />
            </div>
          </div>

          <div className='mb-4'>
            <p className="text-black text-xl font-bold">Estado</p>
            <div className='mb-4'>
              <p className="text-md text-[#6C7381]">{tournament.active ? 'En curso' : 'Finalizado'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='mb-12'>
        <StatsTurnAtBatTable gameForStats={games} viewAVG={true}/>
      </div>

      <GameTable games={games} openModalWithGameDetails={openModalWithGameDetails} onEdit={openEditModal}/>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`Detalles del Juego contra ${selectedGame?.opponent || '-'}`}>
        {selectedGame && (
          <StatsTurnAtBatTable gameForStats={[selectedGame]} viewAVG={false}/>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Editar Juego">
        {selectedGame && (
          <GameForm
            onClose={closeEditModal}
            initialData={selectedGame} // Pasamos los datos iniciales del juego seleccionado
          />
        )}
      </Modal>
    </div>
  );
};

export default TournamentStats;
