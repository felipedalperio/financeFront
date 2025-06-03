import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#dcdcdc", "#1f2937"]; // claro (fundo), escuro (valor)

// Score atual (exemplo: 745 de 1000)
const score = 700;
const max = 1000;
const percentage = score / max;

// Dados com 2 fatias: porcentagem atingida e restante
const data = [
    { name: "restante", value: max - score },
    { name: "atingido", value: score },
];

export default function ScoreGauge() {
    return (
        <div className="flex-1 lg:flex-none bg-white text-gray-600 rounded-lg relative min-h-58 flex flex-col justify-center items-center">
            
             <h3 className=" text-lg font-bold pt-2">Score de Risco</h3>
            
            <ResponsiveContainer width="100%" height="100%" className="scale-x-[-1] pt-2">
                <PieChart>
                    <Pie
                        data={data}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={70}
                        outerRadius={90}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Score no centro */}
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-10">
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-2xl font-bold">{score}</p>
                {/* Legenda inferior */}
                <div className="flex justify-center gap-13 items-center text-xs text-gray-400 w-full px-2">
                    <span>0</span>
                    <span className="text-xs px-2 py-1 mt-1 bg-yellow-500 text-white rounded-full">
                        Médio
                    </span>
                    <span>1k</span>
                </div>

            </div>


        </div>
    );
}
