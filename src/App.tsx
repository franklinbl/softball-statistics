import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import TournamentStats from './pages/TournamentStats';
import MenuBar from './components/MenuBar';
import PrivateRoute from './hooks/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="w-full min-h-screen">
          {/* Top Menu */}
          <MenuBar />

          {/* Main Content */}
          <main className="p-8 m-auto max-w-6xl">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tournament-stats/:id" element={<TournamentStats />} />
              <Route path="/login" element={<LoginForm  />} />
              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>}/>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;