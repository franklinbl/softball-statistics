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
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Estadísticas del Torneo: {tournament.name}</h1>

      <div className="mb-6">
        <p><strong>Fecha de inicio:</strong>{formatDate(tournament.startDate)}</p>
        <p><strong>Fecha de fin:</strong>{formatDate(tournament.endDate)}</p>
        <p><strong>Estatus:</strong> {tournament.active ? 'En curso' : 'Finalizado'}</p>
      </div>

      <StatsTurnAtBatTable gameForStats={games} viewAVG={true}/>

      <GameTable games={games} openModalWithGameDetails={openModalWithGameDetails} onEdit={openEditModal}/>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`Detalles del Juego contra ${selectedGame?.opponent || '-'}`}>
        {selectedGame && (
          <StatsTurnAtBatTable gameForStats={[selectedGame]} viewAVG={false} />
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
