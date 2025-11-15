"use client"
interface NetCost 
{
  program: number;
  median: number;
}

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid} from "recharts";

export default function NetMedianChart({program, median} : NetCost)
{
  const data = 
  [
    {name: "Net vs Median price", "Net Price": program, "Median Price": median}
  ]
  return(
    <div style={{ width: "100%", height: 200}} className="justify-center items-center flex flex-col">
      <BarChart width={600} height={200} data={data} layout="vertical">
        <XAxis type="number" domain={[0,(program+median)]} hide/>
        <YAxis dataKey="name" type="category" axisLine={false}/>
        <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'}} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
        <Legend />
        <Bar dataKey="Net Price" stackId="cost" fill="#ff7c7c" radius={[10, 0, 0, 10]}/>
        <Bar dataKey="Median Price" stackId="cost" fill="#ffc658" radius={[0, 10, 10, 0]}/>
      </BarChart>
    </div>
  );
}
