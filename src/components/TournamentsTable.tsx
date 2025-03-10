import { Link } from "react-router-dom";
import { Tournament } from "../types/tournament";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../utils/formatDate";

interface TournamentsTableProps {
  tournaments: Tournament[];
  onEdit: (tournament: Tournament) => void;
}

const TournamentsTable: React.FC<TournamentsTableProps> = ({ tournaments, onEdit }) => {
  const {user} = useAuth();

  return (
    <div className="relative overflow-x-auto sm:rounded-lg mb-10">
      <table className="w-full text-sm text-left rtl:text-right text-black bg-[#FEF3EA] border-collapse">
        <thead className="text-xs uppercase">
          <tr>
            <th scope="col" className="pl-4 py-3 border-b border-[#F0F1F3]">
              Nombre del torneo
            </th>
            <th scope="col" className="py-3 border-b border-[#F0F1F3]">
              Fecha de inicio
            </th>
            <th scope="col" className="py-3 border-b border-[#F0F1F3]">
              Fecha de fin
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
          {tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <tr key={tournament.id} className="bg-white border-b border-[#F0F1F3]  last:border-b-0">
                <th
                  scope="row"
                  className="pl-4 py-4 font-medium text-black whitespace-nowrap"
                >
                  {tournament.name}
                </th>
                <td className="py-4">
                  {formatDate(tournament.startDate)}
                </td>
                <td className="py-4">
                  {formatDate(tournament.endDate)}
                </td>
                <td className="py-4">
                  {tournament.active ? 'Activo' : 'Finalizado'}
                </td>
                <td className="pr-4 py-4 text-right">
                  {user && (
                    <a onClick={() => onEdit(tournament)} className="font-medium text-[#CC5D03] hover:underline cursor-pointer mr-4">
                      Editar
                    </a>
                  )}
                  <Link
                    to={`/tournament-stats/${tournament.id}`}
                    className="font-medium text-[#CC5D03] hover:underline cursor-pointer"
                  >
                    Ver estadísticas
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white border-b border-[#F0F1F3]">
              <td className="px-6 py-4 text-center" colSpan={5}>
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