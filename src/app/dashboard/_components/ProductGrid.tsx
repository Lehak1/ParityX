// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { DotsHorizontalIcon } from "@radix-ui/react-icons"
// import Link from "next/link"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Dialog, DialogTrigger } from "@/components/ui/dialog"
// import { AddToSiteProductModalContent } from "./AddToSiteProductModalContent"
// import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
// import { DeleteProductAlertDialogContent } from "./DeleteProductAlertDialogContent"


// export function ProductGrid({
//   products,
// }: {
//   products: {
//     id: string
//     name: string
//     url: string
//     description?: string | null
//   }[]
// }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {products.map(product => (
//         <ProductCard key={product.id} {...product} />
//       ))}
//     </div>
//   )
// }

// export function ProductCard({
//   id,
//   name,
//   url,
//   description,
// }: {
//   id: string
//   name: string
//   url: string
//   description?: string | null
// }) {
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex gap-2 justify-between items-end">
//           <CardTitle>
//             <Link href={`/dashboard/products/${id}/edit`}>{name}</Link>
//           </CardTitle>
//           <Dialog>
//             <AlertDialog>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="size-8 p-0">
//                     <div className="sr-only">Action Menu</div>
//                     <DotsHorizontalIcon className="size-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem asChild>
//                     <Link href={`/dashboard/products/${id}/edit`}>Edit</Link>
//                   </DropdownMenuItem>
//                   <DialogTrigger asChild>
//                     <DropdownMenuItem>Add To Site</DropdownMenuItem>
//                   </DialogTrigger>
//                   <DropdownMenuSeparator />
//                   <AlertDialogTrigger asChild>
//                     <DropdownMenuItem>Delete</DropdownMenuItem>
//                   </AlertDialogTrigger>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <DeleteProductAlertDialogContent id={id} />
//             </AlertDialog>
//             <AddToSiteProductModalContent id={id} />
//           </Dialog>
//         </div>
//         <CardDescription>{url}</CardDescription>
//       </CardHeader>
//       {description && <CardContent>{description}</CardContent>}
//     </Card>
//   )
// }


"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AddToSiteProductModalContent } from "./AddToSiteProductModalContent";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteProductAlertDialogContent } from "./DeleteProductAlertDialogContent";

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ProductGrid({
  products,
}: {
  products: {
    id: string;
    name: string;
    url: string;
    description?: string | null;
  }[];
}) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </motion.div>
  );
}

export function ProductCard({
  id,
  name,
  url,
  description,
}: {
  id: string;
  name: string;
  url: string;
  description?: string | null;
}) {
  return (
    <motion.div variants={cardVariants}>
      <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              <Link href={`/dashboard/products/${id}/edit`} className="hover:text-indigo-600 transition">
                {name}
              </Link>
            </CardTitle>
            <Dialog>
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0 hover:bg-gray-200">
                      <DotsHorizontalIcon className="size-5 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-white shadow-md rounded-md">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/products/${id}/edit`} className="hover:text-indigo-600">
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DialogTrigger asChild>
                      <DropdownMenuItem>Add To Site</DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DeleteProductAlertDialogContent id={id} />
              </AlertDialog>
              <AddToSiteProductModalContent id={id} />
            </Dialog>
          </div>
          <CardDescription className="text-gray-500">{url}</CardDescription>
        </CardHeader>
        {description && (
          <CardContent className="text-gray-700">{description}</CardContent>
        )}
      </Card>
    </motion.div>
  );
}
