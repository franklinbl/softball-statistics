import { useState } from 'react';
import Modal from '../components/Modal';
import GameForm from '../components/GameForm';
import { useAuth } from '../hooks/useAuth';
import LatestGamesCard from '../components/LatestGamesCard';
import Tournaments from './Tournaments';

const Home: React.FC = () => {
  const {user} = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="text-center">
      <LatestGamesCard />

      <Tournaments />

      {user && <button
        onClick={openModal}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors block mx-auto mt-10"
      >
        Agregar nuevos datos de juego
      </button>}

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Agregar Datos de Juego" >
        <GameForm onClose={closeModal}/>
      </Modal>
    </div>
  );
};

export default Home;