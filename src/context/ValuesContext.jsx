import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ValuesContext = createContext();

export function ValuesProvider({ children }) {
  const [receita, setReceita] = useState(0);
  const [valorAtual, setValorAtual] = useState(0);
  const [despesa, setDespesa] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [filtroData, setFiltroData] = useState();
  const [transacoes, setTranscaoes] = useState([]);

  useEffect(() => {
    async function fetchCategorias() {
      try {
       // const res = await axios.get('/api/transacoes/categorias');
        setCategorias(res.data);
      } catch (err) {
        console.error('Erro ao buscar categorias', err);
      }
    }

    fetchCategorias();
  }, []);

  useEffect(() => {
   async function fetchDados() {
      try {
        const resReceita = await axios.get('/api/transacoes/receitas');
        const totalReceita = resReceita.data.reduce((acc, item) => acc + item.valor, 0);
        setReceita(totalReceita);

        const resDespesa = await axios.get('/api/transacoes/despesas');
        const totalDespesa = resDespesa.data.reduce((acc, item) => acc + item.valor, 0);
        setDespesa(totalDespesa);
      } catch (err) {
        console.error('Erro ao listar dados', err);
      }
    }

    async function fetchTranscaoes() {
      try {
        const transacoes = await axios.get('/api/transacoes');
        setTranscaoes(transacoes.data);
      } catch (err) {
        console.error('Erro ao listar dados', err);
      }
    }

    fetchDados();
    fetchTranscaoes();
  },[filtroData])

  const novaTransacao = async (data) => {
    try {
      await axios.post('/api/transacoes', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (data.tipo === 'RECEITA') {
        setReceita((prev) => prev + parseFloat(data.valor));
        setValorAtual((prev) => prev + parseFloat(data.valor));
      } else if (data.tipo === 'DESPESA') {
        setDespesa((prev) => prev + parseFloat(data.valor));
        setValorAtual((prev) => prev - parseFloat(data.valor));
      }

      const transacoes = await axios.get('/api/transacoes');
      setTranscaoes(transacoes.data);


    } catch (err) {
      console.error('Erro ao adicionar transação', err);
    }
  };

  return (
    <ValuesContext.Provider value={{ novaTransacao, receita, despesa, categorias, transacoes }}>
      {children}
    </ValuesContext.Provider>
  );
}

export function useValues() {
  return useContext(ValuesContext);
}
