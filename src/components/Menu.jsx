import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { LuBell } from "react-icons/lu";
import { useAuth } from '../context/AuthContext';
import { useState } from "react";
import TransacaoModal from "./TransacaoForm";
import axios from "axios";

export default function Menu() {
  const { user } = useAuth();
  const [showTransiction, setShowTransiction] = useState(true)

 const handleNovaTransacao = async (data) => {
  try {
    await axios.post('/api/transacoes', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    alert('Transação adicionada!');
  } catch (err) {
    console.error('Erro ao adicionar transação', err);
  }
};

  
  return (
    <div className="flex justify-between items-center px-10 py-4 bg-[#1f273b] text-gray-200 font-bold">
      <div className="flex flex-col ml-3">
        <span className="text-2xl">BULLDASH</span>
        <span className="font-normal text-sm italic text-gray-400">Gestão financeira</span>
      </div>

      <ul className="flex gap-5 justify-center items-center">
        <li>Home</li>
        <li className="bg-gray-600 p-1 px-3 rounded-lg">Dashboard</li>
        <li className="flex gap-2 justify-center items-center bg-[#75bf64] p-1 px-3 rounded-lg">
          <GoArrowDownLeft />
          Registrar Entrada
        </li>
        <li className="flex gap-2 justify-center items-center bg-[#ff6262] p-1 px-3 rounded-lg">
          <GoArrowUpRight />
          Registrar Saida
        </li>
      </ul>

      <div className="flex gap-5">
        <LuBell size={30} />
        <CgProfile size={30} />
      </div>

      {showTransiction && (
        <TransacaoModal
          onSubmit={handleNovaTransacao}
          onClose={() => setShowTransiction(false)}
        />
      )}

    </div>
  )
}
