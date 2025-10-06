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


  return (
  <div className= "flex flex-col justify-center items-center">
      <img src={`https://logo.clearbit.com/${school_url}`}></img>
      <h1>{name}</h1>
      <p>{city},{state}</p>
      <p>{numUndergrads} undergraduates enrolled,  {numGrads} graduates enrolled.</p>
      <p>{numUndergrads + numGrads} total</p>
      <a className="underline italic bold "href={school_url.toString()} target="_blank">visit site</a>
    </div>
  );
}

