"use client"
import { useRouter } from "next/navigation";
import {useState} from "react";
export default function SearchBar() {
  const [search, onSearch] = useState<string>("");
  let router = useRouter();

  function submit(e: any)
  {
    e.preventDefault();
    if (search.trim())
    {
      router.push(`/schools/${search}`)
    }
  }

  return (
    <div className = "bg-black/10 rounded-md p-2">
        <form onSubmit={submit}>
        <input className= "w-full" type="text" placeholder="Enter a school." value={search} onChange={(e)=> onSearch(e.target.value)}></input>
        </form>
    </div>
  );
}
