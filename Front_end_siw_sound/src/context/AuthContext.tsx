import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  isAdmin: boolean; 
  login: (token: string, user: string, role: string) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const storedUser = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role'); 

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUsername(storedUser);
      if (storedRole === 'ADMIN') {
        setIsAdmin(true);
      }
    }
  }, []);

  
  const login = (token: string, user: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', user);
    localStorage.setItem('role', role); 
    
    
    setIsAuthenticated(true);
    setUsername(user);
    setIsAdmin(role === 'ADMIN'); 
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    
    setIsAuthenticated(false);
    setUsername(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve essere usato dentro un AuthProvider');
  return context;
}