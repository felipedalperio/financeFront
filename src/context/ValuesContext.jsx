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
  const [charts, setCharts] = useState([]);

  // Mapeamento de número do mês para nome
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await axios.get('/api/transacoes/categorias');
        setCategorias(res.data);
      } catch (err) {
        console.error('Erro ao buscar categorias', err);
      }
    }
    fetchCategorias()
    refreshDados();
  }, []);

  async function refreshDados() {
    try {
      const resReceita = await axios.get('/api/transacoes/receitas');
      const totalReceita = resReceita.data.reduce((acc, item) => acc + item.valor, 0);
      setReceita(totalReceita);

      const resDespesa = await axios.get('/api/transacoes/despesas');
      const totalDespesa = resDespesa.data.reduce((acc, item) => acc + item.valor, 0);
      setDespesa(totalDespesa);

      const tras = await axios.get('/api/transacoes/listar/false');
      setTranscaoes(tras.data);

      const initialData = monthNames.map((name) => ({
        name,
        receita: 0,
        despesa: 0,
      }));

      const dadosMensais = [...initialData];

      tras.data.forEach((transacao) => {
        const [dia, mes, ano] = transacao.dataTransacao.split('/');
        const mesIndex = parseInt(mes, 10) - 1;

        if (transacao.tipo === 'RECEITA') {
          dadosMensais[mesIndex].receita += transacao.valor;
        } else if (transacao.tipo === 'DESPESA') {
          dadosMensais[mesIndex].despesa += transacao.valor;
        }
      });

      setCharts(dadosMensais);
    } catch (err) {
      console.error('Erro ao atualizar dados', err);
    }
  }


  const novaTransacao = async (data) => {
    try {

      await axios.post('/api/transacoes', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      await refreshDados();
     // if (data.tipo === 'RECEITA') {
     //   setReceita((prev) => prev + parseFloat(data.valor));
     //   setValorAtual((prev) => prev + parseFloat(data.valor));
     // } else if (data.tipo === 'DESPESA') {
     //   setDespesa((prev) => prev + parseFloat(data.valor));
     //   setValorAtual((prev) => prev - parseFloat(data.valor));
     // }
//
     // const transacoes = await axios.get('/api/transacoes');
     // setTranscaoes(transacoes.data);

    } catch (err) {
      console.error('Erro ao adicionar transação', err);
    }
  };

  const deletarTransacao = async (id) => {
    try {
      await axios.delete('/api/transacoes/delete/' + id);

      await refreshDados();

    } catch (err) {
      console.error('Erro ao adicionar transação', err);
    }
  };

  return (
    <ValuesContext.Provider value={{ novaTransacao, receita, despesa, categorias, transacoes, charts, deletarTransacao }}>
      {children}
    </ValuesContext.Provider>
  );
}

export function useValues() {
  return useContext(ValuesContext);
}
