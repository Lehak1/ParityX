import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { NoProducts } from "./_components/NoProduct";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";


export default async function DashboardPage(){
    const {userId,redirectToSignIn}=await auth()
if(userId == null) return redirectToSignIn()
    const products=await getProducts(userId,{limit:6})
if(products.length === 0) return <NoProducts/>
    return <>
    <h2>
        <Link className="group flex gap-2 items-center hover:underline" href="/dashboard/products">
        Products
        <ArrowRightIcon className="group-hover:translate-x-1 transition-transform"/>
        </Link>
    </h2>
    </>
}