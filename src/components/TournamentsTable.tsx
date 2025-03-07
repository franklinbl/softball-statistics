import { Link } from "react-router-dom";
import { Tournament } from "../types/tournament";

interface TournamentsTableProps {
  tournaments: Tournament[];
  actionType: string;
  onEdit: (tournament: Tournament) => void;
}

const TournamentsTable: React.FC<TournamentsTableProps> = ({ tournaments, actionType, onEdit }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="px-6 py-3">
                      Nombre del torneo
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Fecha de inicio
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Fecha de fin
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
            {tournaments.length > 0 ? (
              tournaments.map((tournament) => (
                <tr key={tournament.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {tournament.name}
                    </th>
                    <td className="px-6 py-4">
                      {tournament.startDate?.toDate().toLocaleDateString() || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {tournament.endDate?.toDate().toLocaleDateString() || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {tournament.active ? 'Activo' : 'Finalizado'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {actionType === 'FUNCTION' ?
                        <a onClick={() => onEdit(tournament)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Editar</a>
                      :
                        <Link to={`/tournament-stats/${tournament.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Ver estadísticas</Link>
                      }
                    </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 text-center" colSpan={6}>
                    No hay torneos disponibles.
                  </td>
              </tr>
            )}
          </tbody>
      </table>
    </div>
  );
};

export default TournamentsTable;