import { Tournament } from '../types/tournament';
import TournamentsTable from '../components/TournamentsTable';
import { useFirestore } from '../hooks/useFirestore';
import Loading from '../components/Loading';

const Statistics: React.FC = () => {
  const { data: tournaments, loading, error } = useFirestore<Tournament>(
    "tournaments",
    [
      { field: "active", direction: "desc" },
      { field: "startDate", direction: "desc" }
    ]
  );

  if (loading) return <Loading />
  if (error) return <p>{error}</p>;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Estadísticas</h1>

      <div>
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Torneos</h2>
        <TournamentsTable tournaments={tournaments} actionType="REDIRECT" onEdit={() => {}} />
      </div>
    </div>
  );
};

export default Statistics;