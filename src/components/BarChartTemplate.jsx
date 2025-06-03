import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SlOptions } from "react-icons/sl";
import { useValues } from '../context/ValuesContext'
import { formatarValorCompleto } from '../utils/Util';

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
                    Entrada: <strong>{formatarValorCompleto(receita)}</strong><br />
                    Saída: <strong>{formatarValorCompleto(despesa)}</strong><br />
                    Saldo: <strong style={{ color: saldo < 0 ? '#cd4f4f' : '#63b873' }}>{formatarValorCompleto(saldo)}</strong><br />
                </div>
            );
        }

        return null;
    };

    const formatarAbreviado = (valor) => {
        if (Math.abs(valor) >= 1_000_000) {
            return (valor / 1_000_000).toFixed(1).replace('.0', '') + 'M';
        } else if (Math.abs(valor) >= 1_000) {
            return (valor / 1_000).toFixed(1).replace('.0', '') + 'K';
        } else {
            return valor.toString();
        }
    };

    return (
        <div className="bg-white rounded-lg">
            <div className="flex flex-col md:flex-row justify-between align-center pb-12 px-4 ">
                <span className="text-md md:text-xl font-bold text-gray-600">Entradas vs Saídas</span>

                <div className="flex gap-2 md:gap-5 items-center self-end">
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
            <div className='ml-[-25px] lg:ml-0'>
                <ResponsiveContainer width="100%" height={290}>
                <BarChart data={charts} barCategoryGap={0} barGap={0}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatarAbreviado} />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={false}
                        contentStyle={{ background: "#fff", borderRadius: "4px" }}
                    />

                    <Bar dataKey="despesa" fill="#cd4f4f" barSize={18} name="Saída" />
                    <Bar dataKey="receita" fill="#63b873" barSize={18} name="Entrada" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
    )
}
