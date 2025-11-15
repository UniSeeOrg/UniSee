"use client"
interface IncomeLevel
{
  under30K: number;
  from30To48K: number;
  from48To75K: number;
  from75To110K: number;
  over110K: number;
}

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid} from "recharts";

export default function IncomeLevelChart({under30K,from30To48K, from48To75K,from75To110K,over110K} : IncomeLevel)
{
    const data = 
    [
      { range: "$0-30k",  "Net Cost: ": under30K },
      { range: "$30-48k", "Net Cost: ": from30To48K },
      { range: "$48-75k", "Net Cost: ": from48To75K },
      { range: "$75-110k","Net Cost: ": from75To110K },
      { range: "$110k+",  "Net Cost: ": over110K }
    ];

  return(
    <div style={{ width: "100%", height: 300 }} className="justify-center items-center flex flex-col">
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="range" axisLine={false}tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }}/>
        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${Number(value).toLocaleString()}`}/>

        <Tooltip  formatter={(value) => `$${Number(value).toLocaleString()}`} contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'}} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
        <Bar dataKey="Net Cost: " fill="#6366f1" radius={[8, 8, 0, 0]} />
      </BarChart>
    </div>
  );
}
