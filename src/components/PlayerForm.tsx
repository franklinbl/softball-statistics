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
        <label htmlFor="name" className="block text-xl font-medium">
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
        className={`w-full ${
          isCreating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white px-4 py-2 rounded transition-colors`}
      >
        {isCreating ? (
          <svg
            className="animate-spin h-5 w-5 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8h-4a4 4 0 01-4-4v-.291z"
            ></path>
          </svg>
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