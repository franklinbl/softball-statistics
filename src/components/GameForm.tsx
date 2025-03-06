import { useState } from "react";
import Select, { GroupBase, StylesConfig } from "react-select";
import { Timestamp } from "firebase/firestore";
import { useFirestore } from "../hooks/useFirestore";
import { Tournament } from "../types/tournament";
import { Player } from "../types/player";
import { Game, TurnAtBat } from "../types/game";

interface OptionType {
  value: string;
  label: string;
  tournament?: Tournament;
}

interface GameFormProps {
  onClose: () => void;
  initialData?: Game;
}

type NumericFields = keyof Omit<TurnAtBat, "player">;

const GameForm: React.FC<GameFormProps> = ({ onClose, initialData = null }) => {
  const [formData, setFormData] = useState<Game>(initialData || {
    date: null,
    opponent: "",
    tournament: null,
    runsHomeClub: 0,
    runsVisiting: 0,
    turnsAtBat: [{ player: null, AB: 0, H: 0, "2B": 0, "3B": 0, HR: 0, K: 0, R: 0, RBI: 0 }],
  });

  // Use the custom hook to load active players
  const { data: playersData } = useFirestore<Player>("players", [], [{ field: "active", operator: "==", value: true }]);

  // Use the custom hook to load active tournaments
  const { data: tournamentsData } = useFirestore<Tournament>("tournaments", [], [{ field: "active", operator: "==", value: true }]);

  // Use the custom hook to add or update a game
  const { addItem, updateItem, loading } = useFirestore<Game>("games");

  // Map player and tournament data for react-select
  const players = playersData
    .filter(player => player.id !== undefined)
    .map((player) => ({
      value: player.id!,
      label: player.name,
    }));

  const tournaments = tournamentsData
    .filter(tournament => tournament.id !== undefined)
    .map((tournament) => ({
      value: tournament.id!,
      label: tournament.name,
      tournament: tournament,
    }));

  // Handle changes in the selected player
  const handlePlayerChange = (index: number, player: Player | null) => {
    const updatedTurnsAtBat = [...formData.turnsAtBat];
    updatedTurnsAtBat[index].player = player;
    setFormData({ ...formData, turnsAtBat: updatedTurnsAtBat });
  };

  // Handle changes in statistics fields
  const handleStatChange = (index: number, field: NumericFields, value: number) => {
    const updatedTurnsAtBat = [...formData.turnsAtBat];
    updatedTurnsAtBat[index] = {
      ...updatedTurnsAtBat[index],
      [field]: value, // Safe assignment
    };
    setFormData({ ...formData, turnsAtBat: updatedTurnsAtBat });
  };

  // Add a new player
  const addPlayer = () => {
    setFormData({
      ...formData,
      turnsAtBat: [
        ...formData.turnsAtBat,
        { player: null, AB: 0, H: 0, "2B": 0, "3B": 0, HR: 0, K: 0, R: 0, RBI: 0 },
      ],
    });
  };

  // Remove a player
  const removePlayer = (index: number) => {
    const updatedTurnsAtBat = formData.turnsAtBat.filter((_, i) => i !== index);
    setFormData({ ...formData, turnsAtBat: updatedTurnsAtBat });
  };

  // Save data to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.tournament) {
      alert("Please complete all required fields.");
      return;
    }
    try {
      // Validate that all players have a name selected
      const hasEmptyPlayer = formData.turnsAtBat.some((turn) => !turn.player);
      if (hasEmptyPlayer) {
        alert("Please select a player for each at-bat turn.");
        return;
      }
      if (initialData) {
        // Update data in Firestore using the updateItem hook
        await updateItem(initialData.id || '', formData);
      } else {
        // Save data to Firestore using the addItem hook
        await addItem(formData);
      }
      // Clear the form after saving
      setFormData({
        date: null,
        opponent: "",
        runsHomeClub: 0,
        runsVisiting: 0,
        tournament: null,
        turnsAtBat: [{ player: null, AB: 0, H: 0, "2B": 0, "3B": 0, HR: 0, K: 0, R: 0, RBI: 0 }],
      });
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("There was an error saving the data.");
    }
  };

  // Custom styles for react-select
  const darkThemeStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#1f2937",
      borderColor: state.isFocused ? "#625FFF" : "#4b5563",
      boxShadow: state.isFocused ? "0 0 0 1px #625FFF" : "none",
      "&:hover": {
        borderColor: "#625FFF",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      border: "1px solid #4b5563",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#374151" : "#1f2937",
      color: state.isSelected ? "#ffffff" : "#d1d5db",
      "&:hover": {
        backgroundColor: "#374151",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#d1d5db",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    input: (base) => ({
      ...base,
      color: "#d1d5db",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#9ca3af",
      "&:hover": {
        color: "#d1d5db",
      },
    }),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300">
          Fecha del juego
          </label>
          <input
            type="date"
            id="date"
            value={formData.date ? formData.date.toDate().toISOString().split('T')[0] : ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : null
              })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="tournament" className="block text-sm font-medium text-gray-300">
            Torneo
          </label>
          <Select
            options={tournaments}
            value={tournaments.find((t) => t.value === formData.tournament?.id) || null}
            onChange={(selectedOption) => {
              if (selectedOption) {
                setFormData({
                  ...formData,
                  tournament: selectedOption.tournament || null,
                });
              } else {
                setFormData({ ...formData, tournament: null });
              }
            }}
            isMulti={false}
            placeholder="Selecciona un torneo"
            className="mt-1"
            styles={darkThemeStyles}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Nombre del oponente
          </label>
          <input
            type="string"
            id="opponent"
            value={formData.opponent}
            onChange={(e) =>
              setFormData({...formData, opponent: e.target.value})
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Carreras de Caimanes
          </label>
          <input
            type="number"
            id="runsHomeClub"
            value={formData.runsHomeClub}
            onChange={(e) =>
              setFormData({...formData, runsHomeClub: Number(e.target.value)})
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            required
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Carreras del oponente
          </label>
          <input
            type="number"
            id="runsVisiting"
            value={formData.runsVisiting}
            onChange={(e) =>
              setFormData({...formData, runsVisiting: Number(e.target.value)})
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            required
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-300">Turnos al Bate</h2>
        {formData.turnsAtBat.map((turn, index) => (
          <div key={index} className="border p-4 rounded-md bg-gray-800">
            <div className="mb-4">
              <label htmlFor={`player-${index}`} className="block text-sm font-medium text-gray-300">
                Jugador
              </label>
              <Select<OptionType, false>
                options={players}
                value={players.find((p) => p.value === turn.player?.id) || null}
                onChange={(selectedOption: OptionType | null) => {
                  if (selectedOption) {
                    handlePlayerChange(index, {
                      id: selectedOption.value,
                      name: selectedOption.label,
                    });
                  } else {
                    handlePlayerChange(index, null);
                  }
                }}
                isMulti={false}
                placeholder="Selecciona un jugador"
                className="mt-1"
                styles={darkThemeStyles}
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor={`AB-${index}`} className="block text-sm font-medium text-gray-300">
                  Turnos al Bate (AB)
                </label>
                <input
                  type="number"
                  id={`AB-${index}`}
                  value={turn.AB}
                  onChange={(e) => handleStatChange(index, 'AB', Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="0"
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
              <div>
                <label htmlFor={`H-${index}`} className="block text-sm font-medium text-gray-300">
                  Hits (H)
                </label>
                <input
                  type="number"
                  id={`H-${index}`}
                  value={turn.H}
                  onChange={(e) => handleStatChange(index, 'H', Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="0"
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
              <div>
                <label htmlFor={`2B-${index}`} className="block text-sm font-medium text-gray-300">
                  Dobles (2B)
                </label>
                <input
                  type="number"
                  id={`2B-${index}`}
                  value={turn['2B']}
                  onChange={(e) => handleStatChange(index, '2B', Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="0"
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
              <div>
                <label htmlFor={`3B-${index}`} className="block text-sm font-medium text-gray-300">
                  Triples (3B)
                </label>
                <input
                  type="number"
                  id={`3B-${index}`}
                  value={turn['3B']}
                  onChange={(e) => handleStatChange(index, '3B', Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="0"
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
              <div>
                <label htmlFor={`HR-${index}`} className="block text-sm font-medium text-gray-300">
                  Home Runs (HR)
                </label>
                <input
                  type="number"
                  id={`HR-${index}`}
                  value={turn.HR}
                  onChange={(e) => handleStatChange(index, 'HR', Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="0"
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
              <div>
                <label htmlFor={`K-${index}`} className="block text-sm font-medium text-gray-300">
                  Ponches (K)
                </label>
                <input
                  type="number"
                  id={`K-${index}`}
                  value={turn.K}
                  onChange={(e) => handleStatChange(index, 'K', Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="0"
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
              <div>
                <label htmlFor={`R-${index}`} className="block text-sm font-medium text-gray-300">
                  Carreras Anotadas (R)
                </label>
                <input
                  type="number"
                  id={`R-${index}`}
                  value={turn.R}
                  onChange={(e) => handleStatChange(index, 'R', Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="0"
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
              <div>
                <label htmlFor={`RBI-${index}`} className="block text-sm font-medium text-gray-300">
                  Carreras Impulsadas (RBI)
                </label>
                <input
                  type="number"
                  id={`RBI-${index}`}
                  value={turn.RBI}
                  onChange={(e) => handleStatChange(index, 'RBI', Number(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="0"
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => removePlayer(index)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Eliminar jugador
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addPlayer}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Agregar jugador
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        {!loading ?
          (initialData ? "Actualizar datos" : "Guardar Datos") :
          <svg
            className="animate-spin h-5 w-5 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8h-4a4 4 0 01-4-4v-.291z"
            ></path>
          </svg>}
      </button>
    </form>
);
};

export default GameForm;