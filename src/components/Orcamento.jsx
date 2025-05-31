import { IoHome } from "react-icons/io5";
import { FaRegPenToSquare } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
export default function Orcamento() {

    const dadosBack = [
        {
            "icon": <IoHome color="#173f7c" size={25} />,
            "name": "Aluguel",
            "tipo": "DESPESA FIXA",
            "valIni": "R$ 870,98",
            "valFim": "R$ 1.000,00",
            "percent": "50%"
        },
        {
            "icon": <GiGraduateCap color="#d38d2c" size={25} />,
            "name": "Educação",
            "tipo": "DESPESA FIXA",
            "valIni": "R$ 100",
            "valFim": "R$ 350",
            "percent": "80%"
        },
    ]
    return (
        <div className="p-4 w-full flex h-full flex-col gap-3">
            {dadosBack.map((item, key) => (
                <div key={key} className="p-2 h-30 w-full rounded-xl border border-gray-300 flex flex-col">
                    <div className="flex flex-row">
                        <div className="bg-gray-300 h-10 w-10 rounded-lg flex items-center justify-center">
                            {item.icon}
                        </div>
                        <div className="flex flex-col text-sm pl-2 gap-[3px] w-full">
                            <span className="mt-[-1px] font-bold text-gray-700">{item.name}</span>
                            <span className="mt-[-5px] italic text-gray-600 text-[11px] " >{item.tipo}</span>
                        </div>
                        <FaRegPenToSquare color="#949494" />
                    </div>
                    <div className="mt-3 flex justify-between pr-2 italic text-gray-600 text-xs" >
                        <span>{item.valIni} </span>
                        <span> {item.valFim} </span>
                    </div>
                    <div className="mt-1 bg-gray-200 h-3.8 rounded-xl">
                        <div className='bg-[#75bf64] h-3.8 rounded-xl items-center flex justify-end text-gray-100 font-semibold overflow-hidden' style={{ width: `${item.percent}` }}>
                            <span className="italic text-[10px] pr-2">{item.percent}</span>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    )


}
