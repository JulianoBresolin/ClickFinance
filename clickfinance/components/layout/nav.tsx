import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
	{ href: "/", label: "Home" },
	{ href: "/calculadora", label: "Calculadora" },
];

export default function Nav() {
	return (
		<nav className="hidden md:flex items-center gap-6">
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className={cn(
						"text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
					)}
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}
