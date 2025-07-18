import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha); 
      navigate('/');             
    } catch {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-8 bg-white shadow rounded-md"
      >
        <h2 className="text-lg font-bold text-center tracking-widest">
          FAÇA SEU LOGIN.
        </h2>

        {/* Email */}
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

        {/* Senha */}
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

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>

        {/* Link para cadastro */}
        <p className="text-sm text-center">
          Não tem conta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Cadastre‑se
          </Link>
        </p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
