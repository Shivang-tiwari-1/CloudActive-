import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/Auth/AuthContext";
import UserContext from "../context/User/UserContext";

const Navbar = () => {
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const { logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    if (typeof logout === "function") {
      await logout();
    } else {
      console.error("logout is not defined in UserContext");
    }
  };
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link className="text-xl font-bold" to="/home">
            AssignMent
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-2">
            {auth.accessToken ? (
              <>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <Link
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                  to="/profile"
                >
                  Profile
                </Link>
                <Link
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                  to="/home"
                >
                  Home
                </Link>
                <Link
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                  to="/createEvent"
                >
                  createEvent
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                  to="/signup"
                >
                  SignUp
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1">
          {auth.accessToken && auth.refreshToken && (
            <Link
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/home"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
              to="/home"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          )}

          {auth.accessToken ? (
            <>
              <button
                className="block w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
                onClick={handleLogout}
              >
                Logout
              </button>
              <Link
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                to="/profile"
              >
                Profile
              </Link>
              <Link
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                to="/home"
              >
                Home
              </Link>
              <Link
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                to="/createEvent"
              >
                createEvent
              </Link>
            </>
          ) : (
            <>
              <Link
                className="block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                to="/login"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                className="block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                to="/signup"
                onClick={() => setIsOpen(false)}
              >
                SignUp
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
