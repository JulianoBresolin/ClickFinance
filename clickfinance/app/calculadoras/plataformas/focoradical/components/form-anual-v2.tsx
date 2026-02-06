"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { NumberInput } from "@/components/ui/number-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import {
	type DadosAnuais,
	type EquipamentoDepreciacao,
} from "@/lib/calculator-utils-anual";
import { EquipamentosManager } from "./equipamentos-manager";
import { SearchPopup } from "@/components/layout/search-popup";

interface FormAnualProps {
	onCalculate: (dados: DadosAnuais) => void;
}

export function FormAnualV2({ onCalculate }: FormAnualProps) {
	const [equipamentos, setEquipamentos] = useState<EquipamentoDepreciacao[]>(
		[],
	);
	const [usarDepreciacaoPorTempo, setUsarDepreciacaoPorTempo] = useState(false);
	const [formData, setFormData] = useState({
		vidaTotal: "",
		cliquesAtuaisMecanicos: "",
		fotosTotais: "",
		fotosTotaisMecanicas: "",
		fotosVendidas: "",
		eventos: "",
		receitaLiquida: "",
		custoEvento: "",
	});
	const [showPopup, setShowPopup] = useState(false);
	const parseCurrency = (value: string): number => {
		if (!value) return 0;
		return Number(value.replace(/\./g, "").replace(",", "."));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (equipamentos.length === 0) {
			alert("Adicione pelo menos um equipamento!");
			return;
		}

		const dados: DadosAnuais = {
			equipamentos,
			usarDepreciacaoPorTempo,
			vidaTotal: Number(formData.vidaTotal) || 0,
			cliquesAtuaisMecanicos: Number(formData.cliquesAtuaisMecanicos) || 0,
			fotosTotais: Number(formData.fotosTotais) || 0,
			fotosTotaisMecanicas: Number(formData.fotosTotaisMecanicas) || 0,
			fotosVendidas: Number(formData.fotosVendidas) || 0,
			eventos: Number(formData.eventos) || 0,
			receitaLiquida: parseCurrency(formData.receitaLiquida),
			custoEvento: parseCurrency(formData.custoEvento),
		};

		if (dados.fotosVendidas === 0 || dados.receitaLiquida === 0) {
			alert("Por favor, preencha os dados de vendas e receita!");
			return;
		}

		onCalculate(dados);
		// Mostrar popup após 5 segundos
		setTimeout(() => {
			setShowPopup(true);
		}, 5000);
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-6">
				<Alert>
					<Info className="h-4 w-4" />
					<AlertTitle>Utilize valores líquidos para o cálculo</AlertTitle>
					<AlertDescription>
						Entre na sua conta da plataforma para pegar os valores líquidos
						(após taxas) e insira no formulário.
					</AlertDescription>
				</Alert>

				{/* Equipamentos */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold border-b-2 border-primary pb-2 flex-1">
							📷 Equipamentos
						</h3>
					</div>

					<div className="flex items-center space-x-2 bg-secondary/20 p-3 rounded-md">
						<input
							type="checkbox"
							id="usarDepreciacaoPorTempo"
							className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
							checked={usarDepreciacaoPorTempo}
							onChange={(e) => setUsarDepreciacaoPorTempo(e.target.checked)}
						/>
						<Label
							htmlFor="usarDepreciacaoPorTempo"
							className="text-sm font-medium cursor-pointer"
						>
							Calcular depreciação por tempo de uso (Ideal para Mirrorless /
							Obturador Eletrônico)
						</Label>
					</div>

					<EquipamentosManager
						equipamentos={equipamentos}
						onChange={setEquipamentos}
						usarDepreciacaoPorTempo={usarDepreciacaoPorTempo}
					/>

					{!usarDepreciacaoPorTempo &&
						equipamentos.some((e) => e.tipo === "camera") && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
								<div className="space-y-2">
									<Label htmlFor="vidaTotal">
										Vida útil do obturador (cliques)
									</Label>
									<NumberInput
										id="vidaTotal"
										placeholder="Ex: 300.000"
										value={formData.vidaTotal}
										onValueChange={(value) =>
											setFormData({ ...formData, vidaTotal: value })
										}
									/>
									<p className="text-sm text-muted-foreground">
										Da câmera principal
									</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="cliquesAtuaisMecanicos">
										Cliques mecânicos atuais
									</Label>
									<NumberInput
										id="cliquesAtuaisMecanicos"
										placeholder="Ex: 35.600"
										value={formData.cliquesAtuaisMecanicos}
										onValueChange={(value) =>
											setFormData({
												...formData,
												cliquesAtuaisMecanicos: value,
											})
										}
									/>
								</div>
							</div>
						)}
				</div>

				{/* Produção */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
						📊 Produção no Período
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label htmlFor="fotosTotais">Total de fotos feitas</Label>
							<NumberInput
								id="fotosTotais"
								placeholder="Ex: 282.643"
								value={formData.fotosTotais}
								onValueChange={(value) =>
									setFormData({ ...formData, fotosTotais: value })
								}
							/>
						</div>

						{!usarDepreciacaoPorTempo && (
							<div className="space-y-2">
								<Label htmlFor="fotosTotaisMecanicas">
									Fotos com obturador mecânico
								</Label>
								<NumberInput
									id="fotosTotaisMecanicas"
									placeholder="Ex: 150.000"
									value={formData.fotosTotaisMecanicas}
									onValueChange={(value) =>
										setFormData({ ...formData, fotosTotaisMecanicas: value })
									}
								/>
							</div>
						)}

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
			<SearchPopup
				isManual
				isOpen={showPopup}
				onClose={() => setShowPopup(false)}
			/>
		</>
	);
}
