import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';

const data = [
    { name: 'Saídas', value: 75 },
    { name: 'Entradas', value: 25 },
];

const COLORS = ['#212a38', '#d3d3d3'];

export default function DonutChart() {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const saida = data.find(item => item.name === 'Saídas')?.value || 0;
    const percentage = ((saida / total) * 100).toFixed(0);

    return (
        <div className="bg-white text-white rounded-lg p-4 flex-1">
            <h3 className="text-gray-700 font-semibold">Progresso</h3>
            <div className="flex items-center">
                {/* Legenda personalizada */}
                <div className="flex flex-col justify-start mt-4 gap-1 pl-4">
                    <div className="flex items-center gap-2 text-sm text-[#212a38]">
                        <span className="w-3 h-3 bg-[#212a38] rounded-full"></span> Saídas
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#aaa]">
                        <span className="w-3 h-3 bg-[#d3d3d3] rounded-full"></span> Entradas
                    </div>
                </div>
                <div className="relative w-full h-38">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={40}
                                outerRadius={60}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                stroke="none"
                                labelLine={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Texto centralizado no donut */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[16px] font-bold text-gray-800">
                        {percentage}%
                    </div>
                </div>
            </div>
        </div>
    );
}
