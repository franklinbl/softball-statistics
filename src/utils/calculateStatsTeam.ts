import { Game, TurnAtBat } from "../types/game";

export const aggregatePlayerStats = (games: Game[]) => {
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