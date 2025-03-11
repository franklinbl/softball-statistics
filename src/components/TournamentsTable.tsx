import { Link } from 'react-router-dom';
import { Tournament } from '../types/tournament';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';

interface TournamentsTableProps {
  tournaments: Tournament[];
  onEdit: (tournament: Tournament) => void;
}

const TournamentsTable: React.FC<TournamentsTableProps> = ({ tournaments, onEdit }) => {
  const { user } = useAuth();

  return (
    // Componente principal
    <div className="relative overflow-x-auto sm:rounded-lg mb-10">
      {/* Tabla (visible solo en escritorio) */}
      <div className="hidden md:block">
        <table className="w-full text-sm text-left text-black bg-[#FEF3EA] border-collapse">
          {/* ... (tu código de tabla original) ... */}
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
                  <th scope="row" className="pl-4 py-4 font-medium text-black whitespace-nowrap">
                    {tournament.name}
                  </th>
                  <td className="py-4">{formatDate(tournament.startDate)}</td>
                  <td className="py-4">{formatDate(tournament.endDate)}</td>
                  <td className={`py-4 ${tournament.active ? 'text-[#49935b]' : 'text-[#d85858 ]'}`}>
                    {tournament.active ? 'En curso' : 'Finalizado'}
                  </td>
                  <td className="pr-4 py-4 text-right">
                    {user && (
                      <a onClick={() => onEdit(tournament)} className="font-medium text-[#CC5D03] hover:underline cursor-pointer mr-4">
                        Editar
                      </a>
                    )}
                    <Link to={`/tournament-stats/${tournament.id}`} className="font-medium text-[#CC5D03] hover:underline cursor-pointer">
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

      {/* Cards para móviles/tablets */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-white p-4 rounded-lg shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-black">{tournament.name}</h3>
              <div className="flex space-x-2">
                {user && (
                  <button onClick={() => onEdit(tournament)} className="text-[#CC5D03] text-sm hover:underline">
                    Editar
                  </button>
                )}
                <Link to={`/tournament-stats/${tournament.id}`} className="text-[#CC5D03] text-sm hover:underline">
                  Ver estadísticas
                </Link>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-xs text-gray-500">Inicio: {formatDate(tournament.startDate)}</p>
              <p className="text-xs text-gray-500">Fin: {formatDate(tournament.endDate)}</p>
              <span className={`text-xs px-2 py-1 rounded w-fit ${tournament.active ? 'bg-[#49a35c] text-white' : 'bg-[#d85858] text-white'}`}>
                {tournament.active ? 'En curso' : 'Finalizado'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentsTable;
