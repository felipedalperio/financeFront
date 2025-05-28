import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Carrega token e usuário automaticamente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await axios.post('/api/auth/login', { email, senha });
      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(usuario);
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Login falhou');
    }
  };

  const register = async (nome, email, senha) => {
    try {
      const response = await axios.post('/api/auth/register', { nome, email, senha });
      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(usuario);

    } catch (error) {
      console.error('Erro no registro:', error);
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
