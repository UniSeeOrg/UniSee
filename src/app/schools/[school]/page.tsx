import {fetchSchoolIcon, fetchSchoolInfo} from "./fetch";

export default async function SchoolPage({ params }: { params: Promise<{ school: string }> })
{
  let { school: slug } = await params;
  console.log(slug)
  let schoolInfo = await fetchSchoolInfo(slug)

  //TODO: 404 or error page 
  if(! schoolInfo)
  {
    return (<p>not found</p>)
  }


  let result = await schoolInfo.results?.[0]
  let school: any = result.school;
  let latest = result.latest;
  let {name,city,state,school_url} : {name: string, city: string, state:string,school_url:URL}= school;
  let numUndergrads: number = latest.student.size;
  let numGrads :number = latest.student.grad_students;

  //Log school info if shit gets messy
  console.log(latest.student.size)


  return(
    <section className="w-full flex items-start justify-center h-screen text-black bg-gray-200">
      <div className="flex flex-col w-2/4 rounded-md pt-8 outline-black divide-y-1 divide-gray-300 divide-3/4">
        <div className= "flex flex-row divide-x-1 divide-gray-300">
            <img className = "rounded-md p-4" src={`https://logo.clearbit.com/${school_url}`}></img>
            <div className="pl-8 flex flex-col items-start justify-center">
             <h1 className="bold text-5xl">{name}</h1>
             <p className="italic text-xl indent-2">{city},{state}</p>
            </div>
        </div>
          <p>{numUndergrads} undergraduates enrolled,  {numGrads} graduates enrolled.</p>
          <p>{numUndergrads + numGrads} total</p>
          <a className="underline italic bold" href={school_url.toString()} >visit site</a>
      </div>
    </section>
  );
}

