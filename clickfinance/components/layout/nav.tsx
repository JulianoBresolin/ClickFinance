import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export default function Nav() {
	return (
		<>
			{/* Desktop Nav */}
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
				<Link
					href="/pesquisa"
					className="text-sm font-medium text-muted-foreground hover:text-foreground"
				>
					Pesquisa
				</Link>
			</nav>

			{/* Mobile Nav */}
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="h-6 w-6" />
						<span className="sr-only">Abrir menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="right">
					<SheetHeader>
						<SheetTitle>Menu</SheetTitle>
					</SheetHeader>
					<div className="flex flex-col gap-4 mt-4 ml-4">
						<Link href="/" className="text-sm font-medium hover:text-primary">
							Home
						</Link>
						<div className="flex flex-col gap-2">
							<span className="text-sm font-semibold text-muted-foreground">
								Calculadoras
							</span>
							<Link
								href="/calculadoras/plataformas/focoradical"
								className="text-sm pl-4 hover:text-primary"
							>
								Foco Radical
							</Link>
							<Link href="/" className="text-sm pl-4 hover:text-primary">
								Banlek (exemplo)
							</Link>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-sm font-semibold text-muted-foreground">
								Precificação
							</span>
							<Link
								href="/precificacao/venda-de-fotos-plataformas"
								className="text-sm pl-4 hover:text-primary"
							>
								Venda de fotos em plataformas
							</Link>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
