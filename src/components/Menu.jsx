import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { LuBell } from "react-icons/lu";
import { useState } from "react";
import TransacaoModal from "./TransacaoForm";
import { AiOutlineHome } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import { GrTransaction } from "react-icons/gr";
import { PiTargetBold } from "react-icons/pi";
import { BsGear } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import { TbReportMoney } from "react-icons/tb";


export default function Menu() {
  const [showTransiction, setShowTransiction] = useState(false)

  return (
    <div className="w-60 hidden justify-start items-center py-4 bg-[#1f273b] text-gray-200 flex-col mt-3 xl:flex">

      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-[.16em]">BULLDASH</span>
        <span className="text-gray-400 text-sm font-semibold italic ">Gestão financeira</span>
      </div>

      <ul className="flex flex-col mt-16 gap-6 text-[14px] pl-6 w-full">
        <li className="flex gap-2 bg-[#efefef] text-[#1f273b] rounded-l-2xl p-2 font-semibold"><AiOutlineHome size={20} /> Dashboard</li>
        <li onClick={() => setShowTransiction(true)} className="flex gap-2"><GrTransaction size={18} />Registrar Transferencia</li>
        <li className="flex gap-2 font-semibold"><GrMoney size={18}/> Hístorico</li>
        <li className="flex gap-2 font-semibold"><PiTargetBold size ={18} /> Metas</li>
        <li className="flex gap-2 font-semibold"><TbReportMoney size ={18} /> Orçamento</li>
        <li className="flex gap-2 font-semibold"><VscGraph size ={18} /> Evolução</li>
        <li className="flex gap-2 font-semibold"><BsGear size ={18} /> Configuração</li>
      </ul>

      {showTransiction && (
        <TransacaoModal
          onClose={() => setShowTransiction(false)}
        />
      )}

    </div>
  )
}
