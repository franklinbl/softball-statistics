# Softball Statistics Manager

![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=React&logoColor=61DAFB)

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white)

## Description
Web application for managing a softball team's statistics, including:
- Active/Completed tournaments
- Players and their statistics (AB, H, HR, AVG, etc.)
- Match results
- User authentication

---

## Features
- **Match registration**: With date, opponent, and detailed player statistics
- **Tournament management**: Create/edit tournaments with start/end dates
- **Responsive design**: Hamburger menu on mobile, adaptive tables
- **Firebase Emulator**: For development without affecting real database
- **Vercel deployment**: Production-ready configuration

---

## Requirements
- Node.js 20+
- pnpm (recommended)
- Firebase account
- Vercel account (optional)

---
## Installation
1. Clone the repository:

   ```bash
   git clone https://github.com/franklinbl/softball-statistics

2. Install dependencies:

   ```bash
   pnpm install
## Running the project
1. Required environment variables:

```bash
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
```

2. Development database

```bash
pnpm run emulators
```

Starts local Firebase emulator

```bash
pnpm run seed
```
Populates the emulator with test data

3. Start development server

```bash
pnpm run dev
```