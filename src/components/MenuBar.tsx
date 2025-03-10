import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from "../firebase/firebaseConfig";

const MenuBar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Function to log out
  const handleLogout = async () => {
    try {
      await signOut(auth); // Logs out the user in Firebase
      alert("Session closed successfully.");
      navigate("/"); // Redirects the user to the login page
    } catch (error) {
      console.error("Error while logging out:", error);
      alert("There was an error while logging out.");
    }
  };

  // Definition of menu items
  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/settings", label: "Configuración", requiresAuth: true }, // Only visible if the user is logged in
  ];

  return (
    <nav className="bg-white w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto grid grid-cols-3 items-center">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <a className="flex items-center">
            <img src="/assets/caimanes.png" className="h-20" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">Caimanes</span>
          </a>
        </div>

        <div className="flex justify-center">
          <ul className="flex flex-col md:flex-row md:space-x-8 rtl:space-x-reverse font-medium">
            {menuItems
              .filter((item) => !item.requiresAuth || (item.requiresAuth && user)) // Filters items based on authentication status
              .map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="block py-2 px-3 text-black rounded bg-transparent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div className="flex justify-end">
          {user && (
            <button
              className="rounded-xl bg-white border border-[#49a35c] text-[#49a35c] font-medium px-4 py-2 rounded hover:bg-[#49a35c] hover:text-white focus:outline-none focus:bg-[#49a35c] focus:text-white focus:border-[#49a35c] transition-colors"
              onClick={handleLogout}
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