import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SlOptions } from "react-icons/sl";
import { useValues } from '../context/ValuesContext'

export default function BarChartTemplate() {

    const { charts } = useValues();


    const data = [
        {
            name: 'Jan',
            despesa: 4000,
            receita: 2400,
            amt: 2400,
        },
        {
            name: 'Mar',
            despesa: 3000,
            receita: 1398,
            amt: 2210,
        },
        {
            name: 'Abr',
            despesa: 2000,
            receita: 9800,
            amt: 2290,
        },
        {
            name: 'May',
            despesa: 2780,
            receita: 3908,
            amt: 2000,
        },
        {
            name: 'Jun',
            despesa: 1890,
            receita: 4800,
            amt: 2181,
        },
        {
            name: 'Jul',
            despesa: 2390,
            receita: 3800,
            amt: 2500,
        },
        {
            name: 'Aug',
            despesa: 3490,
            receita: 4300,
            amt: 2100,
        },
        {
            name: 'Set',
            despesa: 3490,
            receita: 4300,
            amt: 2100,
        },
        {
            name: 'Out',
            despesa: 3490,
            receita: 4300,
            amt: 2100,
        },
        {
            name: 'Nov',
            despesa: 3490,
            receita: 4300,
            amt: 2100,
        },
        {
            name: 'Dec',
            despesa: 3490,
            receita: 4300,
            amt: 2100,
        },
    ];


    // Tooltip customizado
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const receita = payload.find(p => p.dataKey === 'receita')?.value || 0;
            const despesa = payload.find(p => p.dataKey === 'despesa')?.value || 0;
            const saldo = receita - despesa;

            return (
                <div style={{ background: '#fff', border: '1px solid #ccc', padding: 10, borderRadius: 4 }}>
                    <strong>{label}</strong><br />
                    Entrada: <strong>{receita}</strong><br />
                    Saída: <strong>{despesa}</strong><br />
                    Saldo: <strong style={{ color: saldo < 0 ? '#cd4f4f' : '#63b873' }}>{saldo}</strong><br />
                </div>
            );
        }

        return null;
    };
    return (
        <div className="col-span-4 bg-white rounded-lg">
            <div className="flex justify-between align-center pb-12 px-4">
                <span className="text-xl font-bold text-gray-600">Entradas vs Saídas</span>

                <div className="flex gap-5 items-center">
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#63b873] rounded-full h-2 w-2"></div>
                            <span className="text-sm text-[#63b873]">Entradas</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#cd4f4f] rounded-full h-2 w-2"></div>
                            <span className="text-sm text-[#cd4f4f]">Saídas</span>
                        </div>
                    </div>

                    <SlOptions color="" className="text-gray-600" />
                </div>

            </div>
            <ResponsiveContainer width="100%" height={290}>
                <BarChart data={charts} barCategoryGap={0} barGap={0}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={false}
                        contentStyle={{ background: "#fff", borderRadius: "4px" }}
                    />

                    {/* As duas barras agora vão se sobrepor sem espaçamento lateral */}
                    <Bar dataKey="despesa" fill="#cd4f4f" barSize={18} name="Saída" />
                    <Bar dataKey="receita" fill="#63b873" barSize={18} name="Entrada" />
                </BarChart>
            </ResponsiveContainer>


        </div>
    )
}
