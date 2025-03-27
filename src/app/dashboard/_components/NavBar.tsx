import { BrandLogo } from "@/components/BrandLogo";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function NavBar() {
  return (
    <header className="flex py-4 shadow bg-background">
      <nav className="flex items-center gap-10 container">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        <Link href="/dashboard/products" className="hover:text-blue-500 transition-colors">
          Products
        </Link>
        <Link href="/dashboard/analytics" className="hover:text-blue-500 transition-colors">
          Analytics
        </Link>
        <Link href="/dashboard/subscription" className="hover:text-blue-500 transition-colors">
          Subscription
        </Link>
        <UserButton />
      </nav>
    </header>
  );
}
