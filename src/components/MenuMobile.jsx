import { useState } from "react";
import TransacaoModal from "./TransacaoForm";
import { AiOutlineHome } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import { GrTransaction } from "react-icons/gr";
import { PiTargetBold } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import { FaPlus } from "react-icons/fa";


export default function MenuMobile() {
  const [showTransiction, setShowTransiction] = useState(false)

  return (
    <div className="w-full h-20 fixed bottom-0 z-999 flex position justify-center items-center p-4 md:px-20 bg-[#1f273b] text-gray-200 ">

      <ul className="flex text-[14px] w-full justify-between items-center">
        <li className="flex gap-2 font-semibold"><AiOutlineHome className="text-2xl md:text-xl" /> <span className="hidden md:inline">Dashboard</span></li>
        <li className="flex gap-2 font-semibold"><GrMoney className="text-2xl md:text-xl"/> <span className="hidden md:inline">Hístorico</span></li>
        <li onClick={() => setShowTransiction(true)} className="bg-[#1f273b] flex gap-2 border-6 md:border-8 border-white p-5 md:p-6 rounded-full relative bottom-10">
          <FaPlus size={24} />
        </li>
        <li className="flex gap-2 font-semibold"><PiTargetBold className="text-2xl md:text-xl" /> <span className="hidden md:inline">Metas</span></li>
        <li className="flex gap-2 font-semibold"><VscGraph className="text-2xl md:text-xl" /> <span className="hidden md:inline">Evolução</span></li>
      </ul>

      {showTransiction && (
        <TransacaoModal
          onClose={() => setShowTransiction(false)}
        />
      )}

    </div>
  )
}
