import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, LineChart, Camera, CheckCircle } from "lucide-react";

export default function Home() {
	return (
		<div className="bg-linear-to-br from-[#8d6e63] via-[#ac968e] to-[#f0cdc1] text-white">
			<div className="container mx-auto px-4 py-16 md:py-24">
				<div className="flex flex-col gap-16 md:gap-24 items-center">
					{/* HERO */}
					<section className="text-center flex flex-col items-center gap-6">
						<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
							Precifique seu trabalho fotográfico
							<br />
							<span className="text-[#d7ccc8]">com clareza e lucro</span>
						</h1>

						<p className="max-w-2xl text-lg md:text-xl opacity-90">
							O ClickFinance ajuda fotógrafos a calcular custos reais, preço por
							hora e margem de lucro — sem achismo.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 mt-4">
							<Button size="lg" asChild>
								<Link href="/calculadora">
									<Calculator className="mr-2 h-5 w-5" />
									Acessar Calculadora
								</Link>
							</Button>
							{/*
							<Button
								size="lg"
								variant="outline"
								className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white"
								asChild
							>
								<Link href="/sobre">Saiba mais</Link>
							</Button> */}
						</div>
					</section>

					{/* BENEFÍCIOS */}
					<section className="grid gap-6 md:grid-cols-3 text-foreground w-full max-w-6xl">
						<Feature
							icon={<Camera className="h-6 w-6" />}
							title="Feito para fotógrafos"
							description="Pensado para quem vive de eventos, ensaios e fotografia profissional."
						/>

						<Feature
							icon={<LineChart className="h-6 w-6" />}
							title="Cálculos reais"
							description="Custo por hora, depreciação, lucro e ponto de equilíbrio."
						/>

						<Feature
							icon={<CheckCircle className="h-6 w-6" />}
							title="Simples e rápido"
							description="Sem planilhas complicadas ou termos difíceis."
						/>
					</section>
				</div>
			</div>
		</div>
	);
}

/* COMPONENTE AUXILIAR */
function Feature({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
			<CardHeader>
				<div className="mb-2 text-[#8d6e63]">{icon}</div>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-foreground/80">{description}</p>
			</CardContent>
		</Card>
	);
}
