import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Nav() {
	return (
		<nav className="hidden md:flex items-center gap-6">
			{/* Home */}
			<Link
				href="/"
				className="text-sm font-medium text-muted-foreground hover:text-foreground"
			>
				Home
			</Link>

			{/* Calculadoras */}
			<DropdownMenu>
				<DropdownMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground">
					Calculadoras ▼
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					<p className="text-xs font-semibold px-3 text-muted-foreground">
						Plataformas
					</p>

					<DropdownMenuItem asChild>
						<Link href="/calculadoras/plataformas/focoradical">
							Foco Radical
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem asChild>
						<Link href="/">Banlek (exemplo)</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Precificação */}
			<DropdownMenu>
				<DropdownMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground">
					Precificação ▼
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					<DropdownMenuItem asChild>
						<Link href="/precificacao/venda-de-fotos-plataformas">
							Venda de fotos em plataformas
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	);
}
