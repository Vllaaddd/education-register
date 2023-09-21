import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from 'local-storage-fallback';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedIsAuth = storage.getItem('isAuth') === 'true';
  const storedUser = JSON.parse(storage.getItem('user'));

  const [isAuth, setIsAuth] = useState(storedIsAuth);
  const [user, setUser] = useState(storedUser);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIsAuth = storage.getItem('isAuth') === 'true';
      const storedUser = JSON.parse(storage.getItem('user'));
      setIsAuth(storedIsAuth);
      setUser(storedUser);
    }
  }, []);

  const setAuthStatus = (authStatus, userData = null) => {
    if (authStatus) {
      storage.setItem('isAuth', 'true');
      storage.setItem('user', JSON.stringify(userData));
    } else {
      storage.removeItem('isAuth');
      storage.removeItem('user');
    }
    setIsAuth(authStatus);
    setUser(userData);
  };

  const contextValue = {
    isAuth,
    user,
    setAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);