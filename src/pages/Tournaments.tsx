import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { Tournament } from '../types/tournament';
import Modal from '../components/Modal';
import TournamentsTable from '../components/TournamentsTable';
import TournamentsForm from '../components/TournamentsForm';
import { useAuth } from '../hooks/useAuth';

const Tournaments: React.FC = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const {user} = useAuth();

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
    <div className="relative sm:rounded-lg text-left mt-20">
      <div className='w-full flex justify-between'>
        <h1 className="text-2xl font-bold text-[#53A867] mb-4 text-left">Lista de Torneos</h1>

        {user && <button
          className="mb-6 rounded-xl bg-white border border-[#49a35c] text-[#49a35c] font-medium px-4 py-2 rounded hover:bg-[#49a35c] hover:text-white focus:outline-none focus:bg-[#49a35c] focus:text-white focus:border-[#49a35c] transition-colors"
          onClick={() => openModal()}
        >
          Crear Torneo
        </button>}
      </div>

      <TournamentsTable
        tournaments={tournaments}
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
