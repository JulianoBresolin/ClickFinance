import Link from "next/link";
//import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import Nav from "./nav";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2 font-bold">
					<Calculator className="h-5 w-5" />
					<span>ClickPhotoFinance</span>
				</Link>

				{/* Nav */}
				<Nav />

				{/* CTA 
				<Button variant="default">Começar grátis</Button>*/}
			</div>
		</header>
	);
}
