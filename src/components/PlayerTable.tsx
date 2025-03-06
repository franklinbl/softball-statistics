import { Player } from "../types/player";

interface PlayerTableProps {
  players: Player[];
  onEdit: (player: Player) => void;
}

const PlayersTable: React.FC<PlayerTableProps> = ({ players, onEdit }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="px-6 py-3">
                      Nombre del jugador
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Estatus
                  </th>
                  <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Action</span>
                  </th>
              </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.map((player) => (
                <tr key={player.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player.name}
                    </th>
                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player.active ? 'Activo ' : 'Inactivo'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a onClick={() => onEdit(player)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Editar</a>
                    </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 text-center" colSpan={3}>
                    No hay jugadores disponibles.
                  </td>
              </tr>
            )}
          </tbody>
      </table>
    </div>
  );
};

export default PlayersTable;