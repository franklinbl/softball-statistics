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
    <table className="w-full text-sm text-left rtl:text-right text-black bg-white border-collapse">
      <thead className="text-xs uppercase">
        <tr>
          <th scope="col" className="py-3 border-b border-[#F0F1F3]">Fecha del juego</th>
          <th scope="col" className="py-3 border-b border-[#F0F1F3]">Oponente</th>
          <th scope="col" className="py-3 border-b border-[#F0F1F3]">Resultado</th>
          <th scope="col" className="sr-only">Detalles</th>
        </tr>
      </thead>
      <tbody>
        {games.length > 0 ? (
          games.map((game) => (
            <tr key={game.id} className="bg-white border-b border-[#F0F1F3]  last:border-b-0">
              <th className="py-4 font-medium text-black whitespace-nowrap">
                {formatDate(game.date)}
              </th>
              <td className="py-4">
                {game.opponent}
              </td>
              <td className="py-4">
                {game.runsHomeClub} - {game.runsVisiting}
              </td>
              <td className="py-4 text-right">
                {user && <button
                  className="font-medium text-[#CC5D03] hover:underline cursor-pointer mr-4"
                  onClick={() => onEdit(game)}
                >
                  Editar
                </button>}

                <button
                  className="font-medium text-[#CC5D03] hover:underline cursor-pointer mr-4"
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