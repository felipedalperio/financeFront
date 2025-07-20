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
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
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

      // 1. cria a série Jan‑Dez do ano atual COM chave
      const anoAtual = new Date().getFullYear();
      const initialData = monthNames.map((name, i) => ({
        name,
        key: `${anoAtual}-${String(i + 1).padStart(2, '0')}`, // ex.: 2025-01
        receita: 0,
        despesa: 0,
      }));

      // 2. percorre as transações
      resTransacoes.data.forEach((transacao) => {
        const [dia, mes, ano] = transacao.dataTransacao.split('/');
        const dataBase = new Date(`${ano}-${mes}-${dia}`);

        // RECEITA ───────────────────────────────
        if (transacao.tipo === 'RECEITA') {
          const key = `${dataBase.getFullYear()}-${String(dataBase.getMonth() + 1).padStart(2, '0')}`;
          const item = initialData.find(m => m.key === key);
          if (item) item.receita += transacao.valor;
          return; // receita não tem parcelas
        }

        // DESPESA ───────────────────────────────
        const parcelas = +transacao.parcelas || 1;
        const valorParcela = transacao.valor / parcelas;

        for (let i = 0; i < parcelas; i++) {
          const dataParcela = new Date(dataBase);
          dataParcela.setDate(1);
          dataParcela.setMonth(dataParcela.getMonth() + i);

          const key = `${dataParcela.getFullYear()}-${String(dataParcela.getMonth() + 1).padStart(2, '0')}`;
          const item = initialData.find(m => m.key === key);
          if (item) item.despesa += valorParcela;   // só soma se o mês for do ano atual
        }
      });

      setCharts(initialData);

    } catch (err) {
      console.error('Erro ao atualizar dados', err);
    } finally {
      setLoading(false);
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
        let currentDate = new Date(novaInicio);
        while (currentDate <= novaFim) {
          const nome = `${monthNames[currentDate.getMonth()]}/${currentDate.getFullYear().toString().slice(2)}`;
          meses.push({
            name: nome,
            key: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`,
            receita: 0,
            despesa: 0,
          });
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return meses;
      };

      fetchDadosComDatas(novaInicio, novaFim, gerarUltimos12Meses());
    } else if (opcao === 'anoAtual') {

      novaFim = new Date(hoje.getFullYear(), 11, 31, 23, 59, 59);

      novaInicio = new Date(hoje.getFullYear(), 0, 1);
      novaInicio.setMonth(novaInicio.getMonth() - 11);
      novaFim = new Date(hoje.getFullYear(), 11, 31, 23, 59, 59);
      // Gera os 12 meses do ano corrente
      const mesesAnoAtual = monthNames.map((name, i) => ({
        name,                                   // "Jan", "Fev"…
        key: `${hoje.getFullYear()}-${String(i + 1).padStart(2, '0')}`,
        receita: 0,
        despesa: 0,
      }));

      // Passa a lista pronta para o fetch
      fetchDadosComDatas(novaInicio, novaFim, mesesAnoAtual);
    } else if (opcao === 'anoAnterior') {
      novaInicio = new Date(hoje.getFullYear() - 1, 0, 1);
      novaFim = new Date(hoje.getFullYear() - 1, 11, 31, 23, 59, 59);
      fetchDadosComDatas(novaInicio, novaFim);
    } else {
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

      // Usa meses personalizados se vierem, senão gera dinamicamente
      const initialData = mesesPersonalizados ? [...mesesPersonalizados] : (() => {
        const data = [];
        const currentDate = new Date(inicioData);
        while (currentDate <= fimData) {
          data.push({
            name: `${monthNames[currentDate.getMonth()]}/${currentDate.getFullYear().toString().slice(2)}`,
            key: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
            receita: 0,
            despesa: 0,
          });
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return data;
      })();

      const encontrarItemPorData = (dataParcela, createIfMissing = true) => {
        const key = `${dataParcela.getFullYear()}-${String(dataParcela.getMonth() + 1).padStart(2, '0')}`;
        let item = initialData.find(i => i.key === key);

        if (!item && createIfMissing) {
          item = {
            name: `${monthNames[dataParcela.getMonth()]}/${dataParcela.getFullYear().toString().slice(2)}`,
            key,
            receita: 0,
            despesa: 0,
          };
          initialData.push(item);
        }

        return item;
      };

      resTransacoes.data.forEach((transacao) => {
        const [dia, mes, ano] = transacao.dataTransacao.split('/');
        const dataBase = new Date(`${ano}-${mes}-${dia}`);

        if (transacao.tipo === 'RECEITA') {
          const item = encontrarItemPorData(dataBase, !mesesPersonalizados);
          if (item) item.receita += transacao.valor;

        } else if (transacao.tipo === 'DESPESA') {
          const parcelas = parseInt(transacao.parcelas || 0);
          const valorParcela = parcelas > 0 ? transacao.valor / parcelas : transacao.valor;

          for (let i = 0; i < (parcelas || 1); i++) {
            const dataParcela = new Date(dataBase);
            dataParcela.setDate(1);
            dataParcela.setMonth(dataBase.getMonth() + i);

            const item = encontrarItemPorData(dataParcela, !mesesPersonalizados);
            if (item) item.despesa += valorParcela;
          }
        }
      });

      // Ordena se houve adições fora de ordem
      initialData.sort((a, b) => new Date(a.key) - new Date(b.key));

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
      const transacaoOriginal = transacoes.find((t) => t.id === data.id);
      if (!transacaoOriginal) {
        console.warn('Transação original não encontrada para atualizar');
        return;
      }

      const response = await axios.put(`/api/transacoes/${data.id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const transacaoAtualizada = response.data;
      const dataFormatada = new Date(transacaoAtualizada.dataTransacao).toLocaleDateString('pt-BR');

      const novaTransacao = {
        ...transacaoAtualizada,
        dataTransacao: dataFormatada,
        valorFormatado: formatarValorCompleto(transacaoAtualizada.valor),
        categoria: data.categoria ? data.categoria : 'Sem categoria',
      };

      setTranscaoes((prev) => prev.map((t) => (t.id === data.id ? novaTransacao : t)));

      const valorAntigo = parseFloat(transacaoOriginal.valor);
      const valorNovo = parseFloat(data.valor);
      const parcelasAntiga = parseInt(transacaoOriginal.parcelas || 0);
      const parcelasNova = parseInt(data.parcelas || 0);

      const dataAntiga = new Date(transacaoOriginal.dataTransacao.split('/').reverse().join('-'));
      const dataNova = new Date(data.dataTransacao);

      setReceita((prev) => {
        let novoTotal = prev;
        if (transacaoOriginal.tipo === 'RECEITA') {
          novoTotal -= valorAntigo;
        }
        if (data.tipo === 'RECEITA') {
          novoTotal += valorNovo;
        }
        return novoTotal;
      });

      setDespesa((prev) => {
        let novoTotal = prev;
        if (transacaoOriginal.tipo === 'DESPESA') {
          novoTotal -= valorAntigo;
        }
        if (data.tipo === 'DESPESA') {
          novoTotal += valorNovo;
        }
        return novoTotal;
      });

      setCharts((prev) => {
        const updated = prev.map((item) => ({ ...item }));

        // Remover parcelas antigas
        const valorParcelaAntiga = parcelasAntiga > 0 ? valorAntigo / parcelasAntiga : valorAntigo;
        for (let i = 0; i < (parcelasAntiga || 1); i++) {
          const dataParcela = new Date(dataAntiga);
          dataParcela.setDate(1);
          dataParcela.setMonth(dataAntiga.getMonth() + i);
          const key = `${dataParcela.getFullYear()}-${String(dataParcela.getMonth() + 1).padStart(2, '0')}`;
          const item = updated.find((i) => i.key === key);
          if (item) {
            if (transacaoOriginal.tipo === 'RECEITA') {
              item.receita -= valorParcelaAntiga;
            } else if (transacaoOriginal.tipo === 'DESPESA') {
              item.despesa -= valorParcelaAntiga;
            }
          }
        }

        // Adicionar parcelas novas
        const valorParcelaNova = parcelasNova > 0 ? valorNovo / parcelasNova : valorNovo;
        for (let i = 0; i < (parcelasNova || 1); i++) {
          const dataParcela = new Date(dataNova);
          dataParcela.setDate(1);
          dataParcela.setMonth(dataNova.getMonth() + i);
          const key = `${dataParcela.getFullYear()}-${String(dataParcela.getMonth() + 1).padStart(2, '0')}`;
          const item = updated.find((i) => i.key === key);
          if (item) {
            if (data.tipo === 'RECEITA') {
              item.receita += valorParcelaNova;
            } else if (data.tipo === 'DESPESA') {
              item.despesa += valorParcelaNova;
            }
          }
        }

        return updated;
      });
    } catch (err) {
      console.error('Erro ao atualizar transação', err);
    }
  };


  const novaTransacao = async (data) => {
    try {
      const transacao = await axios.post('/api/transacoes', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const dataFormatada = new Date(transacao.data.dataTransacao).toLocaleDateString('pt-BR');
      const transacaoComId = {
        ...data,
        id: transacao.data.id,
        dataTransacao: dataFormatada,
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

      const valorFloat = parseFloat(data.valor);
      if (data.tipo === 'RECEITA') {
        setReceita((prev) => prev + valorFloat);
      } else if (data.tipo === 'DESPESA') {
        setDespesa((prev) => prev + valorFloat);
      }

      const dataBase = new Date(data.dataTransacao);
      const parcelas = parseInt(data.parcelas || 0);
      const valorParcela = parcelas > 0 ? valorFloat / parcelas : valorFloat;

      setCharts((prev) => {
        const updated = prev.map((item) => ({ ...item }));

        for (let i = 0; i < (parcelas || 1); i++) {
          const dataParcela = new Date(dataBase);
          dataParcela.setDate(1);
          dataParcela.setMonth(dataBase.getMonth() + i);
          const key = `${dataParcela.getFullYear()}-${String(dataParcela.getMonth() + 1).padStart(2, '0')}`;
          const item = updated.find((i) => i.key === key);
          if (item) {
            if (data.tipo === 'RECEITA') {
              item.receita += valorParcela;
            } else if (data.tipo === 'DESPESA') {
              item.despesa += valorParcela;
            }
          }
        }

        return updated;
      });
    } catch (err) {
      console.error('Erro ao adicionar transação', err);
    }
  };



  const deletarTransacao = async (id) => {
    try {
      const transacao = transacoes.find((t) => t.id === id);
      if (!transacao) {
        console.warn('Transação não encontrada para deletar');
        return;
      }

      await axios.delete(`/api/transacoes/delete/${id}`);

      setTranscaoes((prev) => prev.filter((t) => t.id !== id));

      if (transacao.tipo === 'RECEITA') {
        setReceita((prev) => prev - parseFloat(transacao.valor));
      } else if (transacao.tipo === 'DESPESA') {
        setDespesa((prev) => prev - parseFloat(transacao.valor));
      }

      const valorTotal = parseFloat(transacao.valor);
      const parcelas = parseInt(transacao.parcelas || 0);
      const valorParcela = parcelas > 0 ? valorTotal / parcelas : valorTotal;

      const dataBase = new Date(transacao.dataTransacao.split('/').reverse().join('-'));

      setCharts((prev) => {
        const updated = prev.map((item) => ({ ...item }));

        for (let i = 0; i < (parcelas || 1); i++) {
          const dataParcela = new Date(dataBase);
          dataParcela.setDate(1);
          dataParcela.setMonth(dataBase.getMonth() + i);
          const key = `${dataParcela.getFullYear()}-${String(dataParcela.getMonth() + 1).padStart(2, '0')}`;
          const item = updated.find((i) => i.key === key);
          if (item) {
            if (transacao.tipo === 'RECEITA') {
              item.receita -= valorParcela;
            } else if (transacao.tipo === 'DESPESA') {
              item.despesa -= valorParcela;
            }
          }
        }

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
      aplicarFiltroData,
      loading
    }}>
      {children}
    </ValuesContext.Provider>
  );
}

export function useValues() {
  return useContext(ValuesContext);
}
