 "use server"


import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { prisma } from "./utils/db"
import { redirect } from "next/navigation"

export async function HandleSubmission(formData:FormData) {
   const {getUser} = getKindeServerSession();
   const user = await getUser();

   if(!user) {
    return redirect("api/auth/register")
   }
    
   const title = formData.get('title')
   const content = formData.get('content')
   const url = formData.get('url')
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const data = await prisma.blogPost.create({
    data: {
        title:title as string,
        content:content as string ,
        imageUrl: url as string,
        aurthodrId :user.id,
        authorImage: user.picture as string,
        authoName: user.given_name as string,

    },
   });

   return redirect("/dashboard");
    
}

