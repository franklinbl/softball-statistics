import { Player } from "../types/player";

interface PlayerTableProps {
  players: Player[];
  onEdit: (player: Player) => void;
}

const PlayersTable: React.FC<PlayerTableProps> = ({ players, onEdit }) => {
  return (
    <div className="relative overflow-x-auto sm:rounded-lg mb-10">
      <table className="w-full text-sm text-left rtl:text-right text-black bg-[#FEF3EA] border-collapse">
          <thead className="text-xs uppercase">
              <tr>
                  <th scope="col" className="pl-4 py-3 border-b border-[#F0F1F3]">
                      Nombre del jugador
                  </th>
                  <th scope="col" className="py-3 border-b border-[#F0F1F3]">
                      Estatus
                  </th>
                  <th scope="col" className="py-3 border-b border-[#F0F1F3]">
                      <span className="sr-only">Action</span>
                  </th>
              </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.map((player) => (
                <tr key={player.id} className="bg-white border-b border-[#F0F1F3]  last:border-b-0">
                    <th scope="row" className="pl-4 py-4 font-medium text-black whitespace-nowrap">
                      {player.name}
                    </th>
                    <td scope="row" className="py-4">
                      {player.active ? 'Activo ' : 'Inactivo'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a onClick={() => onEdit(player)} className="font-medium text-[#CC5D03] hover:underline cursor-pointer mr-4">Editar</a>
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