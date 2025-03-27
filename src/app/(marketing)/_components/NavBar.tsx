import { BrandLogo } from "@/components/BrandLogo";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function NavBar() {
  return (
    <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
      <nav className="flex items-center gap-10 container font-semibold">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        <Link className="text-lg hover:text-blue-500 transition-colors" href="/#testimonials">
          Testimonials
        </Link>
        <Link className="text-lg hover:text-blue-500 transition-colors" href="/#pricing">
          Pricing
        </Link>
        <Link className="text-lg hover:text-blue-500 transition-colors" href="#">
          About
        </Link>
        <span className="text-lg">
          <SignedIn>
            <Link href="/dashboard" className="hover:text-blue-500 transition-colors">
              Dashboard
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <span className="hover:text-blue-500 transition-colors">Login</span>
            </SignInButton>
          </SignedOut>
        </span>
      </nav>
    </header>
  );
}
