import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user data", err);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData); // Update React state first
    localStorage.setItem('user', JSON.stringify(userData)); // Then localStorage
  };

  const logout = () => {
    setUser(null); // Clear React state first
    localStorage.removeItem('user'); // Then localStorage
    localStorage.removeItem('token'); // Also remove token
    // Dispatch custom logout event
    window.dispatchEvent(new Event('logout'));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);