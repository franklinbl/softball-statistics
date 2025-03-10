import { useEffect, useMemo, useState } from "react";
import { Game, TurnAtBat } from "../types/game";
import SortIcon from "../../public/assets/svgs/SortIcon";
import { aggregatePlayerStats } from "../utils/calculateStatsTeam";

interface StatsTurnAtBatTableProps {
  gameForStats: Game[];
  viewAVG: boolean;
}

const StatsTurnAtBatTable: React.FC<StatsTurnAtBatTableProps> = ({gameForStats, viewAVG = false}) => {
  const [tournamentStats, setTournamentStats] = useState<TurnAtBat[]>([]);

  // State to handle sorting
  const [sortConfig, setSortConfig] = useState<{ key: keyof TurnAtBat | "playerName"; direction: "asc" | "desc" } | null>(null);

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
    handleSort("AVG");
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
    <div className='min-w-4xl overflow-x-hidden'>
    {tournamentStats.length > 0 && (
        <table className="w-full text-sm text-left rtl:text-right text-black bg-[#FEF3EA]">
          <thead className="text-xs uppercase">
              <tr>
                  <th
                    scope="col"
                    className="pl-4 py-3 border-b border-[#F0F1F3] cursor-pointer  select-none relative group"
                    onClick={() => handleSort("playerName")}
                  >
                    <div className="flex items-center">
                      Nombre del jugador
                      <SortIcon />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="py-3 border-b border-[#F0F1F3] cursor-pointer select-none relative group"
                    onClick={() => handleSort("AB")}
                  >
                    <div className="flex items-center">
                      AB
                      <SortIcon />
                    </div>
                    {/* Tooltip */}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      Turnos al Bate (AB)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="py-3 border-b border-[#F0F1F3] cursor-pointer select-none relative group"
                    onClick={() => handleSort("H")}
                  >
                    <div className="flex items-center">
                      H
                      <SortIcon />
                    </div>
                    {/* Tooltip */}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      Hits (H)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="py-3 border-b border-[#F0F1F3] cursor-pointer  select-none relative group"
                    onClick={() => handleSort("2B")}
                  >
                    <div className="flex items-center">
                      2B
                      <SortIcon />
                    </div>
                    {/* Tooltip */}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      Dobles (2B)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="py-3 border-b border-[#F0F1F3] cursor-pointer  select-none relative group"
                    onClick={() => handleSort("3B")}
                  >
                    <div className="flex items-center">
                      3B
                      <SortIcon />
                    </div>
                    {/* Tooltip */}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      Triples (3B)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="py-3 border-b border-[#F0F1F3] cursor-pointer  select-none relative group"
                    onClick={() => handleSort("HR")}
                  >
                    <div className="flex items-center">
                      HR
                      <SortIcon />
                    </div>
                    {/* Tooltip */}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      Home Runs (HR)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="py-3 border-b border-[#F0F1F3] cursor-pointer  select-none relative group"
                    onClick={() => handleSort("K")}
                  >
                    <div className="flex items-center">
                      K
                      <SortIcon />
                    </div>
                    {/* Tooltip */}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      Ponches (K)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="py-3 border-b border-[#F0F1F3] cursor-pointer  select-none relative group"
                    onClick={() => handleSort("R")}
                  >
                    <div className="flex items-center">
                      R
                      <SortIcon />
                    </div>
                    {/* Tooltip */}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      Carreras Anotadas (R)
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="py-3 border-b border-[#F0F1F3] cursor-pointer  select-none relative group"
                    onClick={() => handleSort("RBI")}
                  >
                    <div className="flex items-center">
                      RBI
                      <SortIcon />
                    </div>
                    {/* Tooltip */}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      Carreras Impulsadas (RBI)
                    </span>
                  </th>
                  {viewAVG && <th
                    scope="col"
                    className="py-3 border-b border-[#F0F1F3] cursor-pointer  select-none relative group"
                    onClick={() => handleSort("AVG")}
                  >
                    <div className="flex items-center">
                      AVG
                      <SortIcon />
                    </div>
                    {/* Tooltip */}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      Promedio de bateo (AVG)
                    </span>
                  </th>}
              </tr>
          </thead>
          <tbody>
            {tournamentStats.length > 0 ? (
              tournamentStats.map((player) => (
                <tr key={player?.player?.id} className="bg-white border-b border-[#F0F1F3]  last:border-b-0">
                    <th scope="row" className="pl-4 py-4 font-medium text-black whitespace-nowrap">
                      {player?.player?.name}
                    </th>
                    <td scope="row" className="py-4">
                      {player?.AB}
                    </td>
                    <td scope="row" className="py-4">
                      {player?.H}
                    </td>
                    <td scope="row" className="py-4">
                      {player?.['2B']}
                    </td>
                    <td scope="row" className="py-4">
                      {player?.['3B']}
                    </td>
                    <td scope="row" className="py-4">
                      {player?.HR}
                    </td>
                    <td scope="row" className="py-4">
                      {player?.K}
                    </td>
                    <td scope="row" className="py-4">
                      {player?.R}
                    </td>
                    <td scope="row" className="py-4">
                      {player?.RBI}
                    </td>
                    {viewAVG && <td scope="row" className="py-4">
                      {player?.AVG}
                    </td>}
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b border-[#F0F1F3]">
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