import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, LineChart, Camera, CheckCircle } from "lucide-react";

export default function Home() {
	return (
		<div className="flex flex-col gap-16">
			{/* HERO */}
			<section className="text-center flex flex-col items-center gap-6">
				<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
					Precifique seu trabalho fotográfico
					<br />
					<span className="text-primary">com clareza e lucro</span>
				</h1>

				<p className="max-w-2xl text-muted-foreground text-lg">
					O ClickFinance ajuda fotógrafos a calcular custos reais, preço por
					hora e margem de lucro — sem achismo.
				</p>

				<div className="flex gap-4">
					<Button size="lg" asChild>
						<Link href="/calculadora">
							<Calculator className="mr-2 h-4 w-4" />
							Começar agora
						</Link>
					</Button>

					<Button size="lg" variant="outline" asChild>
						<Link href="/sobre">Saiba mais</Link>
					</Button>
				</div>
			</section>

			{/* BENEFÍCIOS */}
			<section className="grid gap-6 md:grid-cols-3">
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

			{/* CTA FINAL */}
			<section className="text-center flex flex-col gap-4">
				<h2 className="text-3xl font-semibold">
					Comece a precificar com confiança
				</h2>

				<p className="text-muted-foreground">
					Gratuito para começar. Sem cadastro.
				</p>

				<Button size="lg" asChild>
					<Link href="/calculadora">Acessar calculadora</Link>
				</Button>
			</section>
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
		<Card>
			<CardHeader>
				<div className="mb-2 text-primary">{icon}</div>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}
