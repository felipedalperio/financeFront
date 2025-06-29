import { useState, useRef, useEffect } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { IoIosArrowDown } from 'react-icons/io';

export default function FiltroData({ onFiltrar }) {
  const [aberto, setAberto] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('anoAtual');
  const ref = useRef();

  useEffect(() => {
    function handleClickFora(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setAberto(false);
      }
    }
    document.addEventListener('mousedown', handleClickFora);
    return () => {
      document.removeEventListener('mousedown', handleClickFora);
    };
  }, []);

  const aplicarFiltro = (opcao) => {
    setOpcaoSelecionada(opcao);
    setAberto(false);
    onFiltrar(opcao);
  };

  const getTextoOpcao = () => {
    switch (opcaoSelecionada) {
      case 'anoAtual':
        return 'Ano atual';
      case 'ultimos12':
        return 'Últimos 12 meses';
      case 'anoAnterior':
        return 'Ano anterior';
      default:
        return 'Selecione';
    }
  };

  return (
    <div className="relative flex flex-col items-end" ref={ref}>
      <div
        onClick={() => setAberto(!aberto)}
        className="flex gap-3 p-2 bg-white rounded-2xl items-center text-[#525252] cursor-pointer border hover:shadow transition"
      >
        <CiCalendar size={20} />
        <span className="text-gray-500 text-xs md:text-sm">{getTextoOpcao()}</span>
        <IoIosArrowDown size={20} />
      </div>

      {aberto && (
        <div className="absolute text-gray-500 top-full mt-2 right-0 bg-white border rounded-lg shadow-lg p-4 z-50 w-64 space-y-2">
          <button
            onClick={() => aplicarFiltro('anoAtual')}
            className="w-full text-left hover:bg-gray-100 p-2 rounded"
          >
            Ano atual
          </button>
          <button
            onClick={() => aplicarFiltro('ultimos12')}
            className="w-full text-left hover:bg-gray-100 p-2 rounded"
          >
            Últimos 12 meses
          </button>
          <button
            onClick={() => aplicarFiltro('anoAnterior')}
            className="w-full text-left hover:bg-gray-100 p-2 rounded"
          >
            Ano anterior
          </button>
        </div>
      )}
    </div>
  );
}
