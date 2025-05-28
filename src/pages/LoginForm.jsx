import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha);
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-md">
      <h2 className="text-lg font-bold">Login</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-sm">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm">Senha</label>
        <input 
          type="password" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Entrar
      </button>
    </form>
  );
}
