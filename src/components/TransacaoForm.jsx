import { useState, useEffect } from 'react';
import { useValues } from '../context/ValuesContext'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { FaChevronDown, FaLeaf } from 'react-icons/fa'
import { EscolherIcon, formatarValorCompleto } from '../utils/Util';
import { Fragment } from 'react'
import TipoListbox from './TipoListBox';


export default function TransacaoModal({ onClose, update }) {

  const { novaTransacao,updateTransacao, categorias } = useValues();


  const initialValue = update
    ? {
      ...update,
      dataTransacao: update.dataTransacao.includes('/')
        ? (() => {
          const [dia, mes, ano] = update.dataTransacao.split('/');
          return `${ano}-${mes}-${dia}`;
        })()
        : update.dataTransacao,
        valor: formatarValorCompleto(update.valor)

    }
    : {
      categoriaId: '',
      tipo: 'RECEITA',
      descricao: '',
      valor: '',
      dataTransacao: new Date().toISOString().split('T')[0],
    };

  const [form, setForm] = useState(initialValue);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoriaSelecionada = categorias.find(
      (cat) => cat.id === form.categoriaId
    );

    const dataToSend = {
      ...form,
      categoria: categoriaSelecionada ? categoriaSelecionada.nome : null,
      valor: parseFloat(form.valor.replace(/\D/g, '')) / 100
    };


    if (update) {
      await updateTransacao(dataToSend);
    }else{
      await novaTransacao(dataToSend);
    }

    setForm({
      categoriaId: '',
      tipo: 'RECEITA',
      descricao: '',
      valor: '',
      dataTransacao: new Date().toISOString().split('T')[0]
    });

    onClose();
  };


  function handleValorChange(e) {
    const raw = e.target.value;

    const somenteNumeros = raw.replace(/\D/g, '');

    const valorFloat = parseFloat(somenteNumeros) / 100;

    const valorFormatado = isNaN(valorFloat) ? '' : formatarValorCompleto(valorFloat);

    setForm({
      ...form,
      valor: valorFormatado,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 text-gray-700">
      <div className="absolute bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Nova Transação</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TipoListbox
            value={form.tipo}
            onChange={(novoTipo) => setForm({ ...form, tipo: novoTipo })}
          />


          {form.tipo === 'DESPESA' && (
            <div>
              <label className="block">Categoria</label>
              <Listbox
                value={categorias.find((cat) => cat.id === form.categoriaId) || null}
                onChange={(selectedCat) => setForm({ ...form, categoriaId: selectedCat.id })}
              >
                {({ open }) => (
                  <div className="relative mt-1">
                    <ListboxButton className="w-full p-2 border rounded flex justify-between items-center bg-white">
                      <span className="flex items-center gap-2">
                        {EscolherIcon(
                          categorias.find((cat) => cat.id === form.categoriaId)?.nome || '',
                          20
                        )}
                        {
                          categorias.find((cat) => cat.id === form.categoriaId)?.nome ||
                          'Selecione'
                        }
                      </span>
                      <FaChevronDown className="text-gray-400" />
                    </ListboxButton>

                    {open && (
                      <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow border border-gray-300">
                        {categorias.map((cat) => (
                          <ListboxOption
                            key={cat.id}
                            value={cat}
                            as={Fragment}
                          >
                            {({ active, selected }) => (
                              <li
                                className={`cursor-pointer select-none p-2 flex items-center gap-2 ${active ? 'bg-blue-100' : ''
                                  } ${selected ? 'font-medium' : ''}`}
                              >
                                {EscolherIcon(cat.nome, 18)}
                                {cat.nome}
                              </li>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    )}
                  </div>
                )}
              </Listbox>
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
              type="text"
              name="valor"
              value={form.valor}
              onChange={handleValorChange}
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
