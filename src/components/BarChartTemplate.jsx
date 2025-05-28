import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SlOptions } from "react-icons/sl";

export default function BarChartTemplate() {

    const data = [
        {
            name: 'Jan',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Mar',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Abr',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'May',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Jun',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Jul',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Aug',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
        {
            name: 'Set',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
        {
            name: 'Out',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
        {
            name: 'Nov',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
        {
            name: 'Dec',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];
    return (
        <div className="col-span-4 bg-white rounded-lg">
            <div className="flex justify-between align-center pb-12 px-4">
                <span className="text-xl font-bold text-gray-600">Entradas vs Saídas</span>

                <div className="flex gap-5 items-center">
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#c1c1c1] rounded-full h-2 w-2"></div>
                            <span className="text-sm text-[#c1c1c1]">Entradas</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#1f273b] rounded-full h-2 w-2"></div>
                            <span className="text-sm text-[#1f273b]">Saídas</span>
                        </div>
                    </div>

                    <SlOptions color="" className="text-gray-600" />
                </div>

            </div>
            <ResponsiveContainer width="100%" height={290}>
                <BarChart
                    data={data}
                >

                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={false} // Remove o destaque cinza
                        contentStyle={{ background: "#fff", borderRadius: "4px" }} />
                    <Bar dataKey="pv" stackId="a" fill="#1f273b" barSize={40} name="Saída" />
                    <Bar dataKey="uv" stackId="a" fill="#c1c1c1" barSize={40} name="Entrada" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
