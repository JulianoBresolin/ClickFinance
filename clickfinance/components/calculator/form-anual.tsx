"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { NumberInput } from "@/components/ui/number-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { DadosAnuais } from "@/lib/calculator-utils";

interface FormAnualProps {
	onCalculate: (dados: DadosAnuais) => void;
}

export function FormAnual({ onCalculate }: FormAnualProps) {
	const [formData, setFormData] = useState({
		valorCamera: "",
		vidaTotal: "",
		cliquesAtuais: "",
		fotosTotais: "",
		fotosVendidas: "",
		eventos: "",
		receitaLiquida: "",
		custoEvento: "",
	});

	const parseCurrency = (value: string): number => {
		if (!value) return 0;
		return Number(value.replace(/\./g, "").replace(",", "."));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const dados: DadosAnuais = {
			valorCamera: parseCurrency(formData.valorCamera),
			vidaTotal: Number(formData.vidaTotal) || 1,
			cliquesAtuais: Number(formData.cliquesAtuais) || 0,
			fotosTotais: Number(formData.fotosTotais) || 0,
			fotosVendidas: Number(formData.fotosVendidas) || 0,
			eventos: Number(formData.eventos) || 0,
			receitaLiquida: parseCurrency(formData.receitaLiquida),
			custoEvento: parseCurrency(formData.custoEvento),
		};

		if (
			dados.fotosTotais === 0 ||
			dados.fotosVendidas === 0 ||
			dados.receitaLiquida === 0
		) {
			alert("Por favor, preencha os campos obrigatórios!");
			return;
		}

		onCalculate(dados);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<Alert>
				<Info className="h-4 w-4" />
				<AlertDescription className="flex align-items-center">
					Use os valores <strong>líquidos</strong> do seu relatório (já com
					taxas descontadas pela plataforma)
				</AlertDescription>
			</Alert>

			{/* Equipamento */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
					📷 Equipamento
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="valorCamera">Valor da câmera (R$)</Label>
						<CurrencyInput
							id="valorCamera"
							placeholder="Ex: 18.500,00"
							value={formData.valorCamera}
							onValueChange={(value) =>
								setFormData({ ...formData, valorCamera: value })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="vidaTotal">Vida útil do obturador (cliques)</Label>
						<NumberInput
							id="vidaTotal"
							placeholder="Ex: 300.000"
							value={formData.vidaTotal}
							onValueChange={(value) =>
								setFormData({ ...formData, vidaTotal: value })
							}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="cliquesAtuais">Cliques atuais da câmera</Label>
					<NumberInput
						id="cliquesAtuais"
						placeholder="Ex: 35.600"
						value={formData.cliquesAtuais}
						onValueChange={(value) =>
							setFormData({ ...formData, cliquesAtuais: value })
						}
					/>
					<p className="text-sm text-muted-foreground">
						Contagem atual no obturador
					</p>
				</div>
			</div>

			{/* Produção */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
					📊 Produção no Período
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label htmlFor="fotosTotais">Fotos feitas</Label>
						<NumberInput
							id="fotosTotais"
							placeholder="Ex: 282.643"
							value={formData.fotosTotais}
							onValueChange={(value) =>
								setFormData({ ...formData, fotosTotais: value })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="fotosVendidas">Fotos vendidas</Label>
						<NumberInput
							id="fotosVendidas"
							placeholder="Ex: 5.278"
							value={formData.fotosVendidas}
							onValueChange={(value) =>
								setFormData({ ...formData, fotosVendidas: value })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="eventos">Eventos realizados</Label>
						<NumberInput
							id="eventos"
							placeholder="Ex: 100"
							value={formData.eventos}
							onValueChange={(value) =>
								setFormData({ ...formData, eventos: value })
							}
						/>
					</div>
				</div>
			</div>

			{/* Financeiro */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
					💰 Financeiro
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="receitaLiquida">Receita líquida total (R$)</Label>
						<CurrencyInput
							id="receitaLiquida"
							placeholder="Ex: 50.552,49"
							value={formData.receitaLiquida}
							onValueChange={(value) =>
								setFormData({ ...formData, receitaLiquida: value })
							}
						/>
						<p className="text-sm text-muted-foreground">
							Valor após desconto das taxas da plataforma
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="custoEvento">
							Custo operacional por evento (R$)
						</Label>
						<CurrencyInput
							id="custoEvento"
							placeholder="Ex: 150,00"
							value={formData.custoEvento}
							onValueChange={(value) =>
								setFormData({ ...formData, custoEvento: value })
							}
						/>
						<p className="text-sm text-muted-foreground">
							Combustível, alimentação, estacionamento
						</p>
					</div>
				</div>
			</div>

			<Button type="submit" className="w-full" size="lg">
				Calcular Análise Anual
			</Button>
		</form>
	);
}
