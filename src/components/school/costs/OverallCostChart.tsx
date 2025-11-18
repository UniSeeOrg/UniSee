"use client"
interface OverallCost
{
  tuition: number;
  roomAndBoard: number;
  bookSupply: number;
  additionalExpenses: number;
  totalCost:number;
}

import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function OverallCostChart({tuition,roomAndBoard,bookSupply,additionalExpenses} : OverallCost)
{
  const data = [{name: "Total Cost", "Tuition": tuition, "Room & Board": roomAndBoard, "Books & Materials": bookSupply, "Misc": additionalExpenses}];


  return(
    <div style={{ width: "100%", height: 200}} className="justify-center items-center flex flex-col">
      <BarChart width={600} height={200} data={data} layout="vertical">
        <XAxis type="number" domain={[0, 80_000]} hide/>
        <YAxis dataKey="name" type="category" axisLine={false} hide/>
        <Tooltip  formatter={(value) => `$${Number(value).toLocaleString()}`} contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'}} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />

        <Bar dataKey="Tuition" stackId="cost" fill="#8884d8" radius={[10, 0, 0, 10]}/>
        <Bar dataKey="Room & Board" stackId="cost" fill="#82ca9d" radius={[0, 0, 0, 0]}/>
        <Bar dataKey="Misc" stackId="cost" fill="#ff7c7c" radius={[0, 0, 0, 0]}/>
        <Bar dataKey="Books & Materials" stackId="cost" fill="#ffc658" radius={[0, 10, 10, 0]}/>
      </BarChart>
    </div>
  );
}
