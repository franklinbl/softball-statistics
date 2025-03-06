import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { Tournament } from '../types/tournament';
import Modal from '../components/Modal';
import TournamentsTable from '../components/TournamentsTable';
import TournamentsForm from '../components/TournamentsForm';

const Tournaments: React.FC = () => {
  const { data: tournaments, addItem, updateItem } = useFirestore<Tournament>(
    'tournaments',
    [
      { field: 'active', direction: 'desc' },
      { field: 'startDate', direction: 'desc' }
    ]
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tournament, setTournament] = useState<Tournament>({
    name: '',
    active: true,
    startDate: null,
    endDate: null,
  });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);

  const openModal = (isCreating = true) => {
    if (isCreating) setTournament({name: '', active: true, startDate: null, endDate: null });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCreating(false);
    setEditingTournament(null);
  };

  const handleEditTournaments = (tournamentToEdit: Tournament) => {
    setEditingTournament(tournamentToEdit);
    setTournament(tournamentToEdit);
    openModal(false);
  };

  const handleCreateTournaments = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tournament.name.trim()) {
      alert('El nombre del torneo no puede estar vacío.');
      return;
    }

    setIsCreating(true);

    try {
      if (editingTournament && editingTournament.id) {
        await updateItem(editingTournament.id, {
          name: tournament.name,
          active: tournament.active,
          startDate: tournament.startDate,
          endDate: tournament.endDate
        });
      } else {
        await addItem({
          name: tournament.name,
          active: tournament.active,
          startDate: tournament.startDate,
          endDate: tournament.endDate
        });
      }
      closeModal();
    } catch (error) {
      console.error('Error al guardar el torneo:', error);
      alert('Hubo un error al guardar el torneo.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Lista de Torneos</h1>

      <button
        onClick={() => openModal()}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        Crear Torneo
      </button>

      <TournamentsTable
        tournaments={tournaments}
        actionType="FUNCTION"
        onEdit={handleEditTournaments}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTournament ? "Editar Torneo" : "Crear Torneo"}>
        <TournamentsForm
          tournament={tournament}
          setTournament={setTournament}
          isCreating={isCreating}
          editingTournament={editingTournament}
          onSubmit={handleCreateTournaments}
        />
      </Modal>
    </div>
  );
};

export default Tournaments;
