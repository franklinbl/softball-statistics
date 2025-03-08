import { useEffect, useMemo, useState } from "react";
import { Game, TurnAtBat } from "../types/game";

interface StatsTurnAtBatTableProps {
  gameForStats: Game[];
  viewAVG: boolean;
}

const StatsTurnAtBatTable: React.FC<StatsTurnAtBatTableProps> = ({gameForStats, viewAVG = false}) => {
  const [tournamentStats, setTournamentStats] = useState<TurnAtBat[]>([]);

  // State to handle sorting
  const [sortConfig, setSortConfig] = useState<{ key: keyof TurnAtBat | "playerName"; direction: "asc" | "desc" } | null>(null);

  const aggregatePlayerStats = (games: Game[]) => {
    const playerStatsMap: Map<string, TurnAtBat> = new Map();

    games.forEach((game) => {
      game.turnsAtBat.forEach((turn) => {
        const { player, AB, H, '2B': doubles, '3B': triples, HR, K, R, RBI } = turn;

        // If the player already exists in the map, update their stats
        if (playerStatsMap.has(player?.id || '')) {
          const existingStats = playerStatsMap.get(player?.id || '')!;
          existingStats.AB += AB;
          existingStats.H += H;
          existingStats['2B'] += doubles;
          existingStats['3B'] += triples;
          existingStats.HR += HR;
          existingStats.K += K;
          existingStats.R += R;
          existingStats.RBI += RBI;
          existingStats.AVG =
            existingStats.AB > 0
              ? ((existingStats.H + existingStats['2B'] + existingStats['3B'] + existingStats.HR) / existingStats.AB).toFixed(3)
              : '0.000';
        } else {
          // If the player does not exist in the map, create a new entry
          const newStats: TurnAtBat = {
            player: { id: player?.id || '', name: player?.name || '' },
            AB,
            H,
            '2B': doubles,
            '3B': triples,
            HR,
            K,
            R,
            RBI,
            AVG: AB > 0 ? ((H + doubles + triples + HR) / AB).toFixed(3) : '0.000',
          };
          playerStatsMap.set(player?.id || '', newStats);
        }
      });
    });

    // Convert the map into an array
    return Array.from(playerStatsMap.values());
  };

  // Function to handle sorting
  const handleSort = (key: keyof TurnAtBat | "playerName") => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const x = aggregatePlayerStats(gameForStats);
    setTournamentStats(x);
  }, [gameForStats])

  // Function to sort the data
  useMemo(() => {
    if (!sortConfig) return tournamentStats;

    const sortedStats = [...tournamentStats].sort((a, b) => {
      const aValue = sortConfig.key === "playerName" ? a.player?.name : a[sortConfig.key];
      const bValue = sortConfig.key === "playerName" ? b.player?.name : b[sortConfig.key];

      // Handle numeric values
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle strings
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle cases where one of the values is null or undefined
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      return 0;
    });
    setTournamentStats(sortedStats);
  }, [sortConfig]);

  return (
    <div className='mb-10 overflow-x-hidden'>
      {tournamentStats.length > 0 && (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none"
                    onClick={() => handleSort("playerName")}
                  >
                    <div className="flex items-center">
                      Nombre del jugador
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                      </svg>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none relative group"
                    onClick={() => handleSort("AB")}
                  >
                    <div className="flex items-center">
                      AB
                      <svg
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Turnos al Bate (AB)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none relative group"
                    onClick={() => handleSort("H")}
                  >
                    <div className="flex items-center">
                      H
                      <svg
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Hits (H)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none relative group"
                    onClick={() => handleSort("2B")}
                  >
                    <div className="flex items-center">
                      2B
                      <svg
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Dobles (2B)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none relative group"
                    onClick={() => handleSort("3B")}
                  >
                    <div className="flex items-center">
                      3B
                      <svg
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Triples (3B)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none relative group"
                    onClick={() => handleSort("HR")}
                  >
                    <div className="flex items-center">
                      HR
                      <svg
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Home Runs (HR)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none relative group"
                    onClick={() => handleSort("K")}
                  >
                    <div className="flex items-center">
                      K
                      <svg
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Ponches (K)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none relative group"
                    onClick={() => handleSort("R")}
                  >
                    <div className="flex items-center">
                      R
                      <svg
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Carreras Anotadas (R)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none relative group"
                    onClick={() => handleSort("RBI")}
                  >
                    <div className="flex items-center">
                      RBI
                      <svg
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Carreras Impulsadas (RBI)
                    </span>
                  </th>
                  {viewAVG && <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none relative group"
                    onClick={() => handleSort("AVG")}
                  >
                    <div className="flex items-center">
                      AVG
                      <svg
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </div>
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Promedio de bateo (AVG)
                    </span>
                  </th>}
              </tr>
          </thead>
          <tbody>
            {tournamentStats.length > 0 ? (
              tournamentStats.map((player) => (
                <tr key={player?.player?.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player?.player?.name}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player?.AB}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player?.H}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player?.['2B']}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player?.['3B']}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player?.HR}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player?.K}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player?.R}
                    </th>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player?.RBI}
                    </th>
                    {viewAVG && <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {player?.AVG}
                    </th>}
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 text-center" colSpan={viewAVG ? 9 : 8}>
                    No hay estadísticas disponibles.
                  </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StatsTurnAtBatTable;