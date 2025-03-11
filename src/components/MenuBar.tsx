import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useState } from 'react';

const MenuBar: React.FC = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Function to log out
  const handleLogout = async () => {
    try {
      await signOut(auth); // Logs out the user in Firebase
      alert('Session closed successfully.');
      navigate('/'); // Redirects the user to the login page
    } catch (error) {
      console.error('Error while logging out:', error);
      alert('There was an error while logging out.');
    }
  };

  // Definition of menu items
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/settings', label: 'Configuración', requiresAuth: true }, // Only visible if the user is logged in
  ];

  return (
    <nav className="bg-white w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center px-4">
        {/* Logo (Visible on all devices) */}
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/assets/caimanes.png" className="h-20" alt="Caimanes Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-black lobster-regular">Caimanes</span>
          </Link>

          {/* Hamburger button (visible only on mobile devices, in the third column) */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black p-2 rounded hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop menu (hidden on mobile) */}
        <div className="hidden md:flex justify-center">
          <ul className="flex space-x-8 font-medium">
            {menuItems
              .filter((item) => !item.requiresAuth || (item.requiresAuth && user))
              .map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="block py-2 px-3 text-black rounded hover:bg-gray-100">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* Logout button on desktop (hidden on mobile) */}
        <div className="hidden md:flex justify-end">
          {user && (
            <button
              className="rounded-xl bg-white border border-[#49a35c] text-[#49a35c] font-medium px-4 py-2 hover:bg-[#49a35c] hover:text-white transition-colors"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu with exit button */}
      <div
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } fixed inset-0 bg-white z-50 transition-transform duration-300 md:hidden`}
      >
        <div className="p-4">
          {/* Button to close the menu */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 text-black hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo in mobile menu */}
          <div className="flex items-center justify-center mb-8">
            <img src="/assets/caimanes.png" className="h-16" alt="Logo" />
          </div>

          {/* Mobile menu items */}
          <ul className="space-y-4">
            {menuItems
              .filter((item) => !item.requiresAuth || (item.requiresAuth && user))
              .map((item) => (
                <li key={item.path} onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer">
                  <Link to={item.path} className="block py-2 px-4 text-black rounded hover:bg-gray-100">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>

          {/* Logout button on mobile */}
          {user && (
            <button
              className="mt-4 w-full bg-white border border-[#49a35c] text-[#49a35c] font-medium px-4 py-2 rounded hover:bg-[#49a35c] hover:text-white transition-colors"
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
