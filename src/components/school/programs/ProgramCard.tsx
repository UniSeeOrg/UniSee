interface ProgramInfo {
  name: string;
  earnings: string | null;
}

export default function ProgramCard({ name, earnings }: ProgramInfo) {
  return (
    <div className=" w-1/4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 p-5 flex flex-col items-start">
      <h3 className="text-lg font-semibold text-gray-900 max-w-full truncate" title={name}>{name}</h3>
      <div className="flex flex-row items-center">
        <p className="px-2">Post Grad Earnings: </p>
        <p className="text-green-400">
          {earnings && Number(earnings).toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </p>
        <p className="text-yellow-400">
          {!earnings && "Nothing Found."}
        </p>
      </div>
    </div>
  );
}

