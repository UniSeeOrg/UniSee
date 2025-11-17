"use client"
import { PieChart, Pie, Cell, Tooltip } from "recharts";
interface PieChart
{
  percentAid: number;
}
export default function AidPieChart({percentAid} : PieChart)
{
  const data = 
  [
    { name: "Covering Aid", value: percentAid},
    { name: "Not Covering", value: 100 - percentAid}
  ]; 

  return(
    <div style={{ width: "100%", height: 300}} className="justify-center items-center flex flex-col">
      <PieChart width={500} height={300}>
        <Pie data={data} dataKey="value" outerRadius={100}>
          <Cell fill="#8884d8" />
          <Cell fill="#ff7c7c" />
        </Pie>
        <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
      </PieChart>
    </div>
  );
}
