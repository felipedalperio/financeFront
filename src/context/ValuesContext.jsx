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
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const usedColors = new Set();

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  async function fetchCategorias() {
    try {
      const res = await axios.get('/api/transacoes/categorias');
      setCategorias(res.data);
    } catch (err) {
      console.error('Erro ao buscar categorias', err);
    }
  }
  const fetchDados = async () => {
    try {
      const resReceita = await axios.get('/api/transacoes/receitas', {
        params: inicio && fim ? { inicio, fim } : {}
      });
      const totalReceita = resReceita.data.reduce((acc, item) => acc + item.valor, 0);
      setReceita(totalReceita);

      const resDespesa = await axios.get('/api/transacoes/despesas', {
        params: inicio && fim ? { inicio, fim } : {}
      });
      const totalDespesa = resDespesa.data.reduce((acc, item) => acc + item.valor, 0);
      setDespesa(totalDespesa);

      const resTransacoes = await axios.get('/api/transacoes/listar', {
        params: inicio && fim ? { inicio, fim } : {}
      });

      setTranscaoes(resTransacoes.data);

      // Gráficos
      const initialData = monthNames.map((name) => ({
        name,
        receita: 0,
        despesa: 0,
      }));

      resTransacoes.data.forEach((transacao) => {
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
  };

  useEffect(() => {

    fetchCategorias();
    fetchDados();
  }, []);

  const aplicarFiltroData = (opcao) => {
    const hoje = new Date();
    let novaInicio = null;
    let novaFim = null;

    if (opcao === 'ultimos12') {
      novaFim = hoje;
      novaInicio = new Date();
      novaInicio.setMonth(novaInicio.getMonth() - 11); // 12 meses incluindo o atual

      const gerarUltimos12Meses = () => {
        const meses = [];

        for (let i = 11; i >= 0; i--) {
          const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
          const nome = `${monthNames[data.getMonth()]}/${data.getFullYear().toString().slice(2)}`;
          meses.push({
            name: nome,
            key: `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}`,
            receita: 0,
            despesa: 0
          });
        }

        return meses;
      };

      fetchDadosComDatas(novaInicio, novaFim, gerarUltimos12Meses());
    }

    else if (opcao === 'anoAtual') {
      novaInicio = new Date(hoje.getFullYear(), 0, 1);
      novaFim = new Date(hoje.getFullYear(), 11, 31, 23, 59, 59);
      fetchDadosComDatas(novaInicio, novaFim);
    }

    else if (opcao === 'anoAnterior') {
      novaInicio = new Date(hoje.getFullYear() - 1, 0, 1);
      novaFim = new Date(hoje.getFullYear() - 1, 11, 31, 23, 59, 59);
      fetchDadosComDatas(novaInicio, novaFim);
    }

    else {
      console.warn('Filtro de data inválido:', opcao);
      return;
    }

    setInicio(novaInicio.toISOString().split('T')[0]);
    setFim(novaFim.toISOString().split('T')[0]);
  };



  const fetchDadosComDatas = async (inicioData, fimData, mesesPersonalizados = null) => {
    try {
      const params = {
        inicio: inicioData.toISOString().split('T')[0],
        fim: fimData.toISOString().split('T')[0],
      };

      const resReceita = await axios.get('/api/transacoes/receitas', { params });
      const totalReceita = resReceita.data.reduce((acc, item) => acc + item.valor, 0);
      setReceita(totalReceita);

      const resDespesa = await axios.get('/api/transacoes/despesas', { params });
      const totalDespesa = resDespesa.data.reduce((acc, item) => acc + item.valor, 0);
      setDespesa(totalDespesa);

      const resTransacoes = await axios.get('/api/transacoes/listar', { params });
      setTranscaoes(resTransacoes.data);

      const initialData = mesesPersonalizados ?? monthNames.map((name, i) => ({
        name,
        key: `${new Date().getFullYear()}-${(i + 1).toString().padStart(2, '0')}`,
        receita: 0,
        despesa: 0
      }));

      resTransacoes.data.forEach((transacao) => {
        const [dia, mes, ano] = transacao.dataTransacao.split('/');
        const key = `${ano}-${mes.padStart(2, '0')}`;

        const mesData = initialData.find((item) => item.key === key);
        if (mesData) {
          if (transacao.tipo === 'RECEITA') {
            mesData.receita += transacao.valor;
          } else if (transacao.tipo === 'DESPESA') {
            mesData.despesa += transacao.valor;
          }
        }
      });

      setCharts(initialData);
    } catch (err) {
      console.error('Erro ao atualizar dados com filtro de data:', err);
    }
  };



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


  const updateTransacao = async (data) => {
    try {
      const transacaoOriginal = transacoes.find(t => t.id === data.id);
      if (!transacaoOriginal) {
        console.warn('Transação original não encontrada para atualizar');
        return;
      }

      const response = await axios.put(`/api/transacoes/${data.id}`, data, {
        headers: { 'Content-Type': 'application/json' }
      });

      const transacaoAtualizada = response.data;

      const dataFormatada = new Date(transacaoAtualizada.dataTransacao).toLocaleDateString('pt-BR');

      const novaTransacao = {
        ...transacaoAtualizada,
        dataTransacao: dataFormatada,
        valorFormatado: formatarValorCompleto(transacaoAtualizada.valor),
        categoria: data.categoria ? data.categoria : 'Sem categoria',
      };

      setTranscaoes((prev) =>
        prev.map((t) => (t.id === data.id ? novaTransacao : t))
      );

      const valorAntigo = parseFloat(transacaoOriginal.valor);
      const valorNovo = parseFloat(data.valor);

      // Ajusta receita e despesa corretamente, mesmo que o tipo mude
      if (transacaoOriginal.tipo === 'RECEITA') {
        setReceita((prev) => prev - valorAntigo);
      } else if (transacaoOriginal.tipo === 'DESPESA') {
        setDespesa((prev) => prev - valorAntigo);
      }

      if (data.tipo === 'RECEITA') {
        setReceita((prev) => prev + valorNovo);
      } else if (data.tipo === 'DESPESA') {
        setDespesa((prev) => prev + valorNovo);
      }


      // Mês antigo (baseado na data em formato pt-BR: "15/06/2025")
      const [diaAntigo, mesAntigo] = transacaoOriginal.dataTransacao.split('/');
      const mesIndexAntigo = parseInt(mesAntigo, 10) - 1;

      // Mês novo (baseado na data atualizada em formato ISO: "2025-07-01")
      const [anoNovo, mesNovo, diaNovo] = data.dataTransacao.split('-');
      const mesIndexNovo = parseInt(mesNovo, 10) - 1;

      setCharts((prev) => {
        const updated = [...prev];

        // Remove do mês antigo
        const mesAntigoChart = { ...updated[mesIndexAntigo] };
        if (transacaoOriginal.tipo === 'RECEITA') {
          mesAntigoChart.receita -= valorAntigo;
        } else if (transacaoOriginal.tipo === 'DESPESA') {
          mesAntigoChart.despesa -= valorAntigo;
        }
        updated[mesIndexAntigo] = mesAntigoChart;

        // Adiciona no mês novo
        const mesNovoChart = { ...updated[mesIndexNovo] };
        if (data.tipo === 'RECEITA') {
          mesNovoChart.receita += valorNovo;
        } else if (data.tipo === 'DESPESA') {
          mesNovoChart.despesa += valorNovo;
        }
        updated[mesIndexNovo] = mesNovoChart;

        return updated;
      });

    } catch (err) {
      console.error('Erro ao atualizar transação', err);
    }
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

      setTranscaoes((prev) => {
        const todas = [...prev, transacaoComId];

        return todas.sort((a, b) => {
          const dataA = new Date(a.dataTransacao.split('/').reverse().join('-'));
          const dataB = new Date(b.dataTransacao.split('/').reverse().join('-'));
          return dataB - dataA;
        });
      });



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
      buddle,
      updateTransacao,
      aplicarFiltroData
    }}>
      {children}
    </ValuesContext.Provider>
  );
}

export function useValues() {
  return useContext(ValuesContext);
}
