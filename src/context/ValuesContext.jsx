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
  const [buddle, setBuddle] = useState([]);
  const [charts, setCharts] = useState([]);
  const usedColors = new Set();

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

  useEffect(() => {
    const buddleLoad = () => {
      try {
        const somaPorCategoria = {};

        transacoes.forEach(element => {
          if (element.tipo == "DESPESA") {
            const valor = parseFloat(element.valor); // ou element.valorTotal, dependendo do seu modelo
            if (somaPorCategoria[element.categoriaId]) {
              somaPorCategoria[element.categoriaId] += valor;
            } else {
              somaPorCategoria[element.categoriaId] = valor;
            }
          }
        });


        const totalGeral = Object.values(somaPorCategoria).reduce((acc, val) => acc + val, 0);


        let bubbles = Object.entries(somaPorCategoria).map(([categoriaId, valorTotal]) => {
          const categoria = categorias.find(c => c.id == categoriaId);
          const porcentagem = (valorTotal / totalGeral) * 100;
          let sizep = 70 + porcentagem * 2;
          return {
            label: categoria?.nome || 'outros',
            size: sizep >= 150 ? 150 : sizep,
            color: getRandomColor(),
            valorTotal: valorTotal.toFixed(2),
            porcentagem: Math.round(porcentagem) <= 0 ? 1 : Math.round(porcentagem),
          };
        });


        // 1. Ordenar do maior para o menor
        bubbles.sort((a, b) => b.valorTotal - a.valorTotal);

        // 2. Posicionar: maior no centro, menores ao redor
        const centerX = 35;
        let centerY = 35;
        const radius = 25;

        bubbles = bubbles.slice(0, 5).map((bubble, index) => {

          if (index === 0) {
            // Maior bolha no centro
            return {
              ...bubble,
              top: `${centerY}%`,
              left: `${centerX}%`,
            };
          } else {
            // As outras vão ao redor em um círculo
            let numb = index * 3;
            let centerY = 35;

            if (index === 1) {
              numb = index * 1;
            }

            if (index === 3) {
              numb = index * 1;
            }

            if (index === 1) {
              centerY = 40
            }

            if (index === 2) {
              numb = index * 2;
            }


            const angle = (2 * Math.PI * (numb)) / (bubbles.length - 1);
            const top = centerY + radius * Math.sin(numb);
            const left = centerX + radius * Math.cos(numb);

            return {
              ...bubble,
              top: `${top}%`,
              left: `${left}%`,
            };
          }
        });

        setBuddle(bubbles);
      } catch (err) {
        console.error('Erro ao carregar buddle:', err);
      }
    };

    buddleLoad();
  }, [transacoes, categorias]);


  const getRandomColor = () => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-orange-500',
      'bg-gray-500',
    ];

    // Filtra as cores ainda não usadas
    const availableColors = colors.filter(color => !usedColors.has(color));

    // Se todas as cores já foram usadas, reinicia
    if (availableColors.length === 0) {
      usedColors.clear();
      availableColors.push(...colors);
    }

    // Escolhe uma cor aleatória das disponíveis
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];

    // Marca como usada
    usedColors.add(randomColor);

    return randomColor;
  };




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
      deletarTransacao,
      buddle
    }}>
      {children}
    </ValuesContext.Provider>
  );
}

export function useValues() {
  return useContext(ValuesContext);
}
