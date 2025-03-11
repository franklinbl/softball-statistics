import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Initialize the Admin SDK with the emulator
admin.initializeApp({
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, // Your Firebase Project ID
});

// CConnect to Firestore Emulator
const db = getFirestore();
db.settings({
  host: "localhost:8080",
  ssl: false,
});

// Test data
const seedData = async () => {
  try {
    // Delete existing data (optional)
    await db.collection("players").doc("test-player-1").delete();
    await db.collection("tournaments").doc("test-tournament-1").delete();

    // Create test players
    await db.collection("players").doc("test-player-1").set({
      name: "Jugador Test 1",
      active: true,
    });

    // Create test tournaments
    await db.collection("tournaments").doc("test-tournament-1").set({
      name: "Torneo Test 1",
      active: true,
      startDate: admin.firestore.Timestamp.now(),
      endDate: admin.firestore.Timestamp.now(),
    });

    // Create test games
    await db.collection("games").doc("test-game-1").set({
      date: admin.firestore.Timestamp.now(),
      opponent: "Equipo Test",
      tournament: db.collection("tournaments").doc("test-tournament-1"),
      turnsAtBat: [
        {
          player: db.collection("players").doc("test-player-1"),
          AB: 4,
          H: 2,
          "2B": 1,
          "3B": 0,
          HR: 1,
          K: 0,
          R: 2,
          RBI: 3,
        },
      ],
    });

    console.log("Datos de prueba cargados exitosamente.");
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
};

seedData();