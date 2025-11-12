"use client"
import ProgramCard from "./ProgramCard";
import { useState } from "react";
interface ProgramInfo 
{
  name: string;
  earnings: string | null;
}
interface DropdownProp
{
  programs: Array<ProgramInfo>;
  title: string

}
export default function ProgramDropdown({ programs, title}: DropdownProp) {
  const [open, setOpen] = useState(false);

  return (
  <div className="w-full">
    <div className="w-full sticky top-16 z-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm flex flex-row items-center justify-center mb-4">
      <button onClick={() => setOpen(!open)} className="w-2xl bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 text-left flex items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-500">
          {title}
        </h1>

        <span className="text-gray-500 text-sm font-medium bg-gray-50 px-3 py-1 rounded-lg">
          {open ? "▲" : "▼"}
        </span>
      </button>    
    </div>
    
    { open && (
    <div className="flex flex-wrap gap-6 justify-center ">
      {programs.map((program, index) => (
       <ProgramCard key={index} name={program.name} earnings={program.earnings} />
      ))}
    </div>
    )}
  </div>    
  );
}
