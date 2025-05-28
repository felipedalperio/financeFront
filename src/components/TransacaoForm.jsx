import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TransacaoModal({ onSubmit, onClose }) {
  const [categorias, setCategorias] = useState([{
    id: '60f5a3a3b4d1c24d8c9a0f13',
    nome: 'teste'
  }]);
  const [form, setForm] = useState({
    categoriaId: '',
    tipo: 'RECEITA',
    descricao: '',
    valor: '',
    dataTransacao: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await axios.get('/api/categorias');
        setCategorias(res.data);
      } catch (err) {
        console.error('Erro ao buscar categorias', err);
      }
    }
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dataToSend = {
      ...form,
      valor: parseFloat(form.valor),
    };

    await onSubmit(dataToSend);
    setForm({
      categoriaId: '',
      tipo: 'RECEITA',
      descricao: '',
      valor: '',
      dataTransacao: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
      <div className="absolute bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Nova Transação</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Categoria</label>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            >
              <option value="">Selecione</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Tipo</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="RECEITA">Receita</option>
              <option value="DESPESA">Despesa</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Descrição</label>
            <input
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Valor</label>
            <input
              type="number"
              step="0.01"
              name="valor"
              value={form.valor}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Data</label>
            <input
              type="date"
              name="dataTransacao"
              value={form.dataTransacao}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
