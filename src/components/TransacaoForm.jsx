import { useState, useEffect } from 'react';
import { useValues } from '../context/ValuesContext'


export default function TransacaoModal({ onClose }) {

  const { novaTransacao, categorias } = useValues();


  const [form, setForm] = useState({
    categoriaId: '',
    tipo: 'RECEITA',
    descricao: '',
    valor: '',
    dataTransacao: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...form,
      valor: parseFloat(form.valor),
    };

    await novaTransacao(dataToSend);

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
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 text-gray-700">
      <div className="absolute bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Nova Transação</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block ">Tipo</label>
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

          {form.tipo == "DESPESA" && (
            <div>
              <label className="block ">Categoria</label>
              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="">Selecione</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>
          )}


          <div>
            <label className="block ">Descrição</label>
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
            <label className="block ">Valor</label>
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
            <label className="block ">Data</label>
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
