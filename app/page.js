import { authOptions } from "./api/auth/[...nextauth]/route";
import { Signout } from "./auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'



export default async function Page(){
  const session = await getServerSession(authOptions)
  if(!session){
    redirect('/auth/signin',"replace")
  }

  return (
    <main>
      {JSON.stringify(session)}
      <Signout/>
    </main>
  )
}
