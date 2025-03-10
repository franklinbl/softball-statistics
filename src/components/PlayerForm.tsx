import LoadingIcon from "../../public/assets/svgs/LoadingIcon";
import { Player } from "../types/player";

interface PlayerFormProps {
  player: Player;
  setPlayer: (player: Player) => void;
  isCreating: boolean;
  editingPlayer: Player | null;
  onSubmit: (e: React.FormEvent) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({
  player,
  setPlayer,
  isCreating,
  editingPlayer,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-md font-medium">
          Nombre del jugador
        </label>
        <input
          type="text"
          id="name"
          value={player.name}
          onChange={(e) =>
            setPlayer({ ...player, name: e.target.value })
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Franklin Barco"
          required
        />
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <span className="">Jugador activo</span>
          <input
            type="checkbox"
            checked={player.active}
            onChange={(e) =>
              setPlayer({ ...player, active: e.target.checked })
            }
            className="form-checkbox h-5 w-5 text-green-500"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isCreating}
        className={`w-full bg-[#37A63D] hover:bg-[#339638] ${isCreating && 'cursor-not-allowed'} text-white px-4 py-2 rounded transition-colors`}
      >
        {isCreating ? (
          <LoadingIcon />
        ) : editingPlayer ? (
          'Actualizar Jugador'
        ) : (
          'Crear Jugador'
        )}
      </button>
    </form>
  );
};

export default PlayerForm;