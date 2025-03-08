import { useAuth } from "../hooks/useAuth";
import { Game } from "../types/game";
import { formatDate } from "../utils/formatDate";

interface GameTableProps {
  games: Game[];
  openModalWithGameDetails: (game: Game) => void;
  onEdit: (game: Game) => void
}

const GameTable: React.FC<GameTableProps> = ({games, openModalWithGameDetails, onEdit}) => {
  const {user} = useAuth();

  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">Fecha del juego</th>
          <th scope="col" className="px-6 py-3">Oponente</th>
          <th scope="col" className="px-6 py-3">Resultado</th>
          <th scope="col" className="px-6 py-3 text-right">Detalles</th>
        </tr>
      </thead>
      <tbody>
        {games.length > 0 ? (
          games.map((game) => (
            <tr key={game.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-2">
                {formatDate(game.date)}
              </td>
              <td className="px-6 py-2">
                {game.opponent}
              </td>
              <td className="px-6 py-2">
                {game.runsHomeClub} - {game.runsVisiting}
              </td>
              <td className="px-6 py-2 text-right">
                {user && <button
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer mr-5"
                  onClick={() => onEdit(game)}
                >
                  Editar
                </button>}

                <button
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                  onClick={() => openModalWithGameDetails(game)}
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          ))
         ) : (
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-4 text-center" colSpan={3}>
                No hay juegos disponibles.
              </td>
          </tr>
         )}
      </tbody>
    </table>
  );
};

export default GameTable;