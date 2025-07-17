import { BsCashCoin } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import DonutChart from "./DonutChart";
import ScoreGauge from "./ScoreGauge";
import Grid from "./Grid";
import { motion } from 'framer-motion';
import BarChartTemplate from "./BarChartTemplate";
import { useAuth } from '../context/AuthContext';
import { useValues } from '../context/ValuesContext';
import Orcamento from "./Orcamento";
import { CgProfile } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { formatarValor } from '../utils/Util';
import { MdLogout } from "react-icons/md";
import FiltroData from "./FiltroData";


export default function Dashboard() {
    const { user, logout } = useAuth();
    const { despesa, receita, buddle, aplicarFiltroData } = useValues();

    function MinhaData() {
        const hoje = new Date();

        const dataFormatada = hoje.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        return (
            <div className="flex flex-col">
                <span className="font-bold text-md md:text-xl lg:text-gray-800">Olá, {user.nome}!</span>
                <span className="italic text-xs md:text-sm lg:text-gray-500">
                    Hoje é dia {dataFormatada}
                </span>
            </div>
        );
    }


    return (
        <div className="lg:px-5 lg:bg-[#ececec] pt-10 md:pb-20 lg:pb-8 flex flex-col h-min-screen w-full gap-1 rounded-l-4xl ">

            <div className=" px-2 mb-5 flex gap-3 items-center text-white flex-col">
                <div className="hidden md:flex gap-2 lg:text-[#4e4e4e] self-end">
                    <FaRegBell size={25} />
                    <CgProfile size={25} />
                    <MdLogout size={25} onClick={logout} />
                </div>
                <div className="flex justify-between w-full gap-4 flex-col md:flex-row">
                    <div className="flex gap-2">
                        <img className="rounded-4xl w-14 h-14 md:w-20 md:h-20" alt="" src="https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png" />
                        <div className="flex items-center justify-between w-full">
                            {MinhaData()}
                            <div className="flex gap-2 md:hidden self-start">
                                <FaRegBell size={25} />
                                <CgProfile size={25} />
                                <MdLogout size={25} onClick={logout} />
                            </div>
                        </div>
                    </div>
                    <div className=" flex flex-col gap-3 items-end">
                        <FiltroData
                            onFiltrar={(opcao) => {
                                aplicarFiltroData(opcao);
                            }}
                        />

                    </div>

                </div>

            </div>

            <div className="flex lg:gap-6 flex-col lg:flex-row ">
                <div className="flex flex-col gap-2 lg:gap-6 w-full lg:w-1/4 ">

                    <div className="text-white">
                        <div className="flex items-end" >
                            <span className="text-md lg:text-gray-500 font-bold mb-[-2px] ml-3">Saldo Total</span>

                        </div>
                        <div className="flex font-bold items-end pb-3 px-3">
                            <span className="text-lg mr-4 lg:text-gray-500"> R$ </span>
                            <span className="text-3xl lg:text-gray-800"> {formatarValor(receita - despesa)} </span>
                        </div>
                    </div>
                    <div className="flex gap-2 lg:flex-col lg:gap-6 rounded-t-2xl p-3 pt-6 lg:rounded-none lg:p-0 lg:bg-[#ececec]">
                        <div className="w-full max-w-55  px-2 md:px-3 pb-2 py-1 bg-[#75bf64] text-gray-100 rounded-lg ">
                            <div className="flex justify-between italic items-center text-gray-200 pr-3">
                                <span>Entrada</span>
                                <BsCashCoin className="relative top-1 text-xl md:text-2xl" />
                            </div>
                            <div className="font-semibold flex gap-2 md:gap-5  items-end pb-2  border-1 border-[#75bf64] border-b-[#ececec] ">
                                <span className="text-md">R$</span>
                                <span className="text-xl md:text-3xl">{formatarValor(receita)}</span>
                            </div>

                        </div>
                        <div className="bg-[#ececec] text-gray-800 w-full max-w-55 px-2 md:px-3 pb-2 py-1 lg:bg-gray-800 lg:text-gray-100 rounded-lg ">
                            <div className="flex italic justify-between items-center  text-gray-800 lg:text-gray-200 pr-3">
                                <span>Saídas</span>
                                <FaMoneyBillTransfer className="text-xl md:text-2xl" />
                            </div>
                            <div className="font-semibold flex gap-2 md:gap-5 items-end pb-2 border-1 border-[#ececec] border-b-gray-800  lg:border-1 lg:border-gray-800 lg:border-b-[#898989] ">
                                <span className="text-xl">R$</span>
                                <span className="text-xl md:text-3xl">{formatarValor(despesa)}</span>
                            </div>

                        </div>
                    </div>
                    <div className="flex hidden lg:flex bg-white rounded-lg py-4 flex-col overflow-hidden">
                        <div className="relative w-full min-h-[200px] flex jutify-center items-center">
                            <DonutChart despesa={despesa} receita={receita} />
                        </div>
                    </div>
                </div>
                <div className="bg-[#ececec] mt-2 gap-2 pb-20 lg:pb-0 lg:bg-transparent grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 lg:gap-4 w-full">
                    <div className="row-start-1 col-span-6 lg:col-span-4 xl:col-span-4 bg-white rounded-lg py-4">
                        <BarChartTemplate />
                    </div>
                    <div className="row-start-2 lg:row-start-1 col-span-6  lg:col-span-2 flex flex-col gap-4">
                        <div className="bg-white rounded-lg py-4 relative w-full h-[400px] flex items-center justify-center flex-col">
                            <h3 className="mb-1 px-3 text-xl font-bold text-gray-600">Top 5 maiores Despesas</h3>
                            <div className="w-full max-w-70 relative h-screen">
                                {buddle.length > 0 ? (
                                    buddle.map((b, i) => (
                                        <motion.div
                                            key={i}
                                            className={`absolute ${b.color} flex-col opacity-75 text-white text-center rounded-full flex justify-center items-center`}
                                            style={{
                                                width: b.size,
                                                height: b.size,
                                                top: b.top,
                                                left: b.left,
                                                right: b.right,
                                                bottom: b.bottom,
                                            }}
                                            animate={{ y: [0, -15, 0] }}
                                            transition={{ repeat: Infinity, duration: 3 + i, ease: "easeInOut" }}
                                        >
                                            <span className="text-sm px-1">{b.label}</span>
                                            <span className="text-xs px-1 font-bold">{b.porcentagem}%</span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center text-sm text-gray-500">Sem registro</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-6 row-start-4 lg:row-start-2 bg-white text-white p-4 rounded-lg lg:col-span-6">
                        <Grid />
                    </div>
                </div>
            </div>
        </div>
    )
}
