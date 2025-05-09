import { useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import Modal from "../components/Modal";
import PlayersTable from "../components/PlayerTable";
import PlayerForm from "../components/PlayerForm";
import { Player } from "../types/player";
import Loading from "../components/Loading";

const Players: React.FC = () => {
  const { data: players, loading, error, addItem, updateItem } = useFirestore<Player>("players");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [player, setPlayer] = useState<Player>({name: "", active: true });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const openModal = (isCreating = true) => {
    if (isCreating) setPlayer({ name: "", active: true });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCreating(false);
    setEditingPlayer(null);
  };

  const handleEditPlayer = (playerToEdit: Player) => {
    setEditingPlayer(playerToEdit);
    setPlayer(playerToEdit);
    openModal(false);
  };

  const handleCreateOrUpdatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!player.name.trim()) {
      alert("El nombre del jugador no puede estar vacío.");
      return;
    }

    setIsCreating(true);

    try {
      if (editingPlayer && editingPlayer.id) {
        await updateItem(editingPlayer.id, { name: player.name, active: player.active });
      } else {
        await addItem({ name: player.name, active: player.active });
      }

      closeModal();
    } catch (error) {
      console.error("Error al guardar jugador:", error);
      alert("Hubo un error al guardar el jugador.");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="relative sm:rounded-lg mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#53A867] mb-4 text-left">Lista de Jugadores</h1>
        <button
            onClick={() => openModal()}
            className="mb-6 rounded-xl bg-white border border-[#49a35c] text-[#49a35c] font-medium px-4 py-2 rounded hover:bg-[#49a35c] hover:text-white focus:outline-none focus:bg-[#49a35c] focus:text-white focus:border-[#49a35c] transition-colors"
          >
            Crear Jugador
        </button>
      </div>

      <PlayersTable players={players} onEdit={handleEditPlayer} />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingPlayer ? "Editar Jugador" : "Crear Jugador"}>
        <PlayerForm player={player} setPlayer={setPlayer} isCreating={isCreating} editingPlayer={editingPlayer} onSubmit={handleCreateOrUpdatePlayer} />
      </Modal>
    </div>
  );
};

export default Players;
