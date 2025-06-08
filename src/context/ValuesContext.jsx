import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { formatarValorCompleto } from '../utils/Util'

const ValuesContext = createContext();

export function ValuesProvider({ children }) {
  const [receita, setReceita] = useState(0);
  const [valorAtual, setValorAtual] = useState(0);
  const [despesa, setDespesa] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [filtroData, setFiltroData] = useState();
  const [transacoes, setTranscaoes] = useState([]);
  const [charts, setCharts] = useState([]);

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
    async function fetchDados() {
      try {
        const resReceita = await axios.get('/api/transacoes/receitas');
        const totalReceita = resReceita.data.reduce((acc, item) => acc + item.valor, 0);
        setReceita(totalReceita);

        const resDespesa = await axios.get('/api/transacoes/despesas');
        const totalDespesa = resDespesa.data.reduce((acc, item) => acc + item.valor, 0);
        setDespesa(totalDespesa);

        const tras = await axios.get('/api/transacoes/listar/false');
        setTranscaoes(tras.data);

        console.log(tras.data)

        const initialData = monthNames.map((name) => ({
          name,
          receita: 0,
          despesa: 0,
        }));

        tras.data.forEach((transacao) => {
          const [dia, mes, ano] = transacao.dataTransacao.split('/');
          const mesIndex = parseInt(mes, 10) - 1;

          if (transacao.tipo === 'RECEITA') {
            initialData[mesIndex].receita += transacao.valor;
          } else if (transacao.tipo === 'DESPESA') {
            initialData[mesIndex].despesa += transacao.valor;
          }
        });

        setCharts(initialData);
      } catch (err) {
        console.error('Erro ao atualizar dados', err);
      }
    }

    fetchCategorias();
    fetchDados();
  }, []);

  const novaTransacao = async (data) => {
    try {
      const transacao = await axios.post('/api/transacoes', data, {
        headers: { 'Content-Type': 'application/json' }
      });


      // Adiciona id único
      const transacaoComId = {
        ...data,
        id: transacao.data.id,
        dataTransacao: new Date(transacao.data.dataTransacao).toLocaleDateString('pt-BR'),
        valorFormatado: formatarValorCompleto(transacao.data.valor),
        categoria: data.categoria ? data.categoria : 'Sem categoria',
      };

      setTranscaoes((prev) => [...prev, transacaoComId]);


      if (data.tipo === 'RECEITA') {
        setReceita((prev) => prev + parseFloat(data.valor));
      } else if (data.tipo === 'DESPESA') {
        setDespesa((prev) => prev + parseFloat(data.valor));
      }

      const [dia, mes, ano] = data.dataTransacao.split('-');
      const mesIndex = parseInt(mes, 10) - 1;

      setCharts((prev) => {
        // Copia o array do estado atual
        const updated = [...prev];

        // Cria uma cópia do objeto do mês que será alterado para evitar mutação direta
        const mesAtualizado = { ...updated[mesIndex] };

        if (data.tipo === 'RECEITA') {
          mesAtualizado.receita += parseFloat(data.valor);
        } else if (data.tipo === 'DESPESA') {
          mesAtualizado.despesa += parseFloat(data.valor);
        }

        // Substitui o objeto no índice com a cópia atualizada
        updated[mesIndex] = mesAtualizado;

        return updated;
      });

    } catch (err) {
      console.error('Erro ao adicionar transação', err);
    }
  };



  const deletarTransacao = async (id) => {
    try {
      const transacao = transacoes.find(t => t.id === id);
      if (!transacao) {
        console.warn('Transação não encontrada para deletar');
        return;
      }

      await axios.delete('/api/transacoes/delete/' + id);

      setTranscaoes((prev) => prev.filter((t) => t.id !== id));

      if (transacao.tipo === 'RECEITA') {
        setReceita((prev) => prev - parseFloat(transacao.valor));
      } else if (transacao.tipo === 'DESPESA') {
        setDespesa((prev) => prev - parseFloat(transacao.valor));
      }

      const [dia, mes, ano] = transacao.dataTransacao.split('/');
      const mesIndex = parseInt(mes, 10) - 1;

      setCharts((prev) => {
        const updated = [...prev];

        // Cria cópia do objeto do mês para evitar mutação direta
        const mesAtualizado = { ...updated[mesIndex] };

        if (transacao.tipo === 'RECEITA') {
          mesAtualizado.receita -= parseFloat(transacao.valor);
        } else if (transacao.tipo === 'DESPESA') {
          mesAtualizado.despesa -= parseFloat(transacao.valor);
        }

        updated[mesIndex] = mesAtualizado;

        return updated;
      });

    } catch (err) {
      console.error('Erro ao deletar transação', err);
    }
  };


  return (
    <ValuesContext.Provider value={{
      novaTransacao,
      receita,
      despesa,
      categorias,
      transacoes,
      charts,
      deletarTransacao
    }}>
      {children}
    </ValuesContext.Provider>
  );
}

export function useValues() {
  return useContext(ValuesContext);
}
