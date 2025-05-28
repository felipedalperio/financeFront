import { BsCashCoin } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import DonutChart from "./DonutChart";
import ScoreGauge from "./ScoreGauge";
import Grid from "./Grid";
import BarChartTemplate from "./BarChartTemplate";
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from "react";
import axios from "axios";

const bubbles = [
    { label: 'Moradia', size: 160, color: 'bg-black', top: '35%', left: '20%' },
    { label: 'Lazer', size: 90, color: 'bg-green-500', top: '46%', left: '60%' },
    { label: 'Saúde', size: 100, color: 'bg-red-500', top: '20%', right: '50%' },
    { label: 'Transporte', size: 70, color: 'bg-orange-500', top: '60%', right: '70%' },
    { label: 'Outros', size: 45, color: 'bg-gray-500', top: '75%', right: '30%' },
];


export default function Dashboard() {
    const { user } = useAuth();
    const [receita, setReceita] = useState(0);
    const [despesa, setDespesa] = useState(0);

    useEffect(() => {
        async function fetchDados() {
            try {
                const resReceita = await axios.get('/api/transacoes/receitas');
                let valorReceita = 0;
                resReceita.data.forEach(item => {
                    valorReceita += item.valor;
                });
                setReceita(valorReceita);

                const resDespesa = await axios.get('/api/transacoes/despesas');
                let valorDespesa = 0;
                resDespesa.data.forEach(item => {
                    valorDespesa += item.valor;
                });
                setDespesa(valorDespesa);

            } catch (err) {
                console.error('Erro ao listar', err);
            }
        }

        fetchDados();
    }, []);


    useEffect(() => {
        console.log()
    })
    return (
        <div className="px-10 flex flex-col h-screen w-full gap-4 " style={{
            background: 'linear-gradient(180deg, #1f273b 140px, #efefef 140px, #efefef 100%)'
        }}>

            <div className="flex justify-between items-center pb-3 px-3 italic text-gray-200">
                <span className="text-3xl">Hi, {user?.nome} seu saldo é {user.saldoAtual} R$</span>
                <span className="text-sm">Today is Friday 15 jan 2025</span>
            </div>


            <div className="flex gap-6">
                <div className="flex flex-col gap-6 w-1/4 ">
                    <div className="w-70 px-3 pb-2 py-1 bg-[#75bf64] text-gray-100 rounded-lg ">
                        <div className="flex justify-between items-center text-gray-100 pt-1 pr-3">
                            <span>Entrada</span>
                            <BsCashCoin size={23} className="relative top-1" />
                        </div>
                        <div className="font-semibold flex gap-5  items-end pb-2  border-1 border-[#75bf64] border-b-[#ededed] ">
                            <span className="text-xl">R$</span>
                            <span className="text-4xl">{receita}</span>
                        </div>

                    </div>
                    <div className="w-70 px-3 pb-2 py-1 bg-gray-800 text-gray-100 rounded-lg ">
                        <div className="flex justify-between items-center text-gray-100 pt-1 pr-3">
                            <span>Saídas</span>
                            <FaMoneyBillTransfer size={23} />
                        </div>
                        <div className="font-semibold flex gap-5  items-end pb-2  border-1 border-gray-800 border-b-[#898989] ">
                            <span className="text-xl">R$</span>
                            <span className="text-4xl">{despesa}</span>
                        </div>

                    </div>
                    <div className="flex bg-white rounded-lg py-4 flex-col min-h-100 overflow-hidden">
                        <h3 className="text-gray-700 font-semibold mb-1 px-3">Proporção de despesas</h3>
                        <div className="relative w-full h-[400px] flex justify-center items-center">
                            {bubbles.map((b, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute ${b.color}  opacity-75 text-white text-center rounded-full flex justify-center items-center`}
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
                                </motion.div>
                            ))}

                        </div>
                    </div>

                </div>
                <div className="grid grid-cols-5 gap-4 w-full">
                    <div className="col-span-4 bg-white rounded-lg py-4">
                        <BarChartTemplate />
                    </div>
                    <div className="col-span-1 flex flex-col gap-4">
                        <div className="bg-white text-white p-4 rounded-lg">
                            <ScoreGauge />
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                            <h3 className="text-gray-600 font-bold mb-3">Economia</h3>
                            <div className="flex justify-between ">
                                <div className="box bg-yellow-500 text-white flex items-center justify-center p-2 rounded-sm font-bold">30%</div>
                                <div className="flex flex-col ">
                                    <div className="text-gray-700  font-semibold flex gap-2 justify-center items-end">
                                        <span className="text-sm">R$</span>
                                        <span className="text-2xl">2049,34</span>
                                    </div>
                                    <span className="text-sm text-gray-400">Economia no periodo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white text-white p-4 rounded-lg col-span-3">
                        <Grid />
                    </div>
                    <div className="col-span-2">
                        <DonutChart />
                    </div>
                </div>
            </div>
        </div>
    )
}
