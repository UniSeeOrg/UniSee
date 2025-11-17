"use client"
import { PieChart, Pie, Cell, Tooltip } from "recharts";
interface PieChart
{
  percentLoans: number
}
export default function LoanPieChart({percentLoans} : PieChart)
{
  const data = 
  [
    { name: "With Loans", value: percentLoans },
    { name: "Without Loans", value: 100 - percentLoans }
  ]; 

  return(
    <div style={{ width: "100%", height: 300}} className="justify-center items-center flex flex-col">
      <PieChart width={500} height={300}>
        <Pie data={data} dataKey="value" outerRadius={100}>
          <Cell fill="#82ca9d" />
          <Cell  />
        </Pie>
        <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
      </PieChart>
    </div>
  );
}
