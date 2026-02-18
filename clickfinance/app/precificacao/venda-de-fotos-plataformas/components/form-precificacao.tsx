"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { NumberInput } from "@/components/ui/number-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Info, Calculator } from "lucide-react";
import { type DadosPrecificacao } from "@/lib/pricing-utils";
import { Card, CardContent } from "@/components/ui/card";
import { SearchPopup } from "@/components/layout/search-popup";
import { EquipamentosManager } from "@/components/equipamentos/equipamentos-manager";
import { type EquipamentoDepreciacao } from "@/lib/calculator-utils-anual";
interface FormPrecificacaoProps {
	onCalculate: (dados: DadosPrecificacao) => void;
}

export function FormPrecificacao({ onCalculate }: FormPrecificacaoProps) {
	const [custosFixosMensais, setCustosFixosMensais] = useState("");
	const [eventosPorMes, setEventosPorMes] = useState("");

	const [equipamentos, setEquipamentos] = useState<EquipamentoDepreciacao[]>(
		[],
	);
	const [usarDepreciacaoPorTempo, setUsarDepreciacaoPorTempo] = useState(false);

	const [custoOperacional, setCustoOperacional] = useState("");
	const [fotosEstimadasEvento, setFotosEstimadasEvento] = useState("");
	const [taxaPlataforma, setTaxaPlataforma] = useState(10);
	const [margemLucroDesejada, setMargemLucroDesejada] = useState(30);
	const [vendasEstimadas, setVendasEstimadas] = useState("");
	const [showPopup, setShowPopup] = useState(false);

	const parseCurrency = (value: string): number => {
		if (!value) return 0;
		return Number(value.replace(/\./g, "").replace(",", "."));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const dados: DadosPrecificacao = {
			custosFixosMensais: parseCurrency(custosFixosMensais),
			eventosPorMes: parseCurrency(eventosPorMes),
			equipamentos: equipamentos,
			usarDepreciacaoPorTempo: usarDepreciacaoPorTempo,
			custoOperacional: parseCurrency(custoOperacional),

			fotosEstimadasEvento: parseCurrency(fotosEstimadasEvento),
			taxaPlataforma: taxaPlataforma,
			margemLucroDesejada: margemLucroDesejada,
			vendasEstimadas: parseCurrency(vendasEstimadas),
		};

		if (dados.fotosEstimadasEvento === 0 || dados.vendasEstimadas === 0) {
			alert("Por favor, preencha os campos obrigatórios!");
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
					<AlertDescription>
						Calcule o preço ideal para suas fotos considerando todos os custos e
						sua margem de lucro desejada
					</AlertDescription>
				</Alert>

				{/* Custos Fixos e Depreciação */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
						💰 Custos Fixos e Depreciação
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="custosFixosMensais">
								Custos fixos mensais (R$)
							</Label>
							<CurrencyInput
								id="custosFixosMensais"
								placeholder="Ex: 2,500"
								value={custosFixosMensais}
								onValueChange={setCustosFixosMensais}
							/>
							<p className="text-sm text-muted-foreground">
								Software, internet, contador, etc.
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="eventosPorMes">Eventos por mês</Label>
							<NumberInput
								id="eventosPorMes"
								placeholder="Ex: 4"
								value={eventosPorMes}
								onValueChange={setEventosPorMes}
							/>
							<p className="text-sm text-muted-foreground">
								Para diluir os custos fixos.
							</p>
						</div>
					</div>

					{/* Gerenciador de Equipamentos */}
					<div className="space-y-4 pt-2">
						<div className="flex flex-wrap items-center justify-between">
							<Label className="text-base font-medium pb-0.5">
								Equipamentos
							</Label>
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="usarDepreciacaoPorTempo"
									checked={usarDepreciacaoPorTempo}
									onChange={(e) => setUsarDepreciacaoPorTempo(e.target.checked)}
									className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
								/>
								<Label
									htmlFor="usarDepreciacaoPorTempo"
									className="text-sm font-normal cursor-pointer"
								>
									Forçar depreciação por tempo (Câmeras)
								</Label>
							</div>
						</div>
						<EquipamentosManager
							equipamentos={equipamentos}
							onChange={setEquipamentos}
							usarDepreciacaoPorTempo={usarDepreciacaoPorTempo}
						/>
					</div>
				</div>

				{/* Custos Variáveis do Evento */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
						🚗 Custos Variáveis do Evento
					</h3>
					<div className="space-y-2">
						<Label htmlFor="custoOperacional">
							Custo operacional do evento (R$)
						</Label>
						<CurrencyInput
							id="custoOperacional"
							placeholder="Ex: 150,00"
							value={custoOperacional}
							onValueChange={setCustoOperacional}
						/>
						<p className="text-sm text-muted-foreground">
							Combustível, alimentação, estacionamento.
						</p>
					</div>
				</div>

				{/* Estimativas do Evento */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
						📊 Estimativas do Evento
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="fotosEstimadasEvento">
								Fotos que irá capturar
							</Label>
							<NumberInput
								id="fotosEstimadasEvento"
								placeholder="Ex: 2.500"
								value={fotosEstimadasEvento}
								onValueChange={setFotosEstimadasEvento}
							/>
							<p className="text-sm text-muted-foreground">
								Quantas fotos você espera tirar
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="vendasEstimadas">Vendas estimadas</Label>
							<NumberInput
								id="vendasEstimadas"
								placeholder="Ex: 25"
								value={vendasEstimadas}
								onValueChange={setVendasEstimadas}
							/>
							<p className="text-sm text-muted-foreground">
								Quantas fotos você espera vender
							</p>
						</div>
					</div>

					{/* Card de Taxa de Conversão */}
					{parseCurrency(fotosEstimadasEvento) > 0 &&
						parseCurrency(vendasEstimadas) > 0 && (
							<Card className="bg-amber-50 border-amber-200">
								<CardContent className="pt-6">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Calculator className="h-5 w-5 text-amber-600" />
											<div>
												<p className="text-sm font-medium text-amber-900">
													Taxa de conversão esperada
												</p>
												<p className="text-xs text-amber-700">
													{parseCurrency(vendasEstimadas)} vendas de{" "}
													{parseCurrency(fotosEstimadasEvento).toLocaleString(
														"pt-BR",
													)}{" "}
													fotos
												</p>
											</div>
										</div>
										<div className="text-2xl font-bold text-amber-600">
											{(
												(parseCurrency(vendasEstimadas) /
													parseCurrency(fotosEstimadasEvento)) *
												100
											).toFixed(2)}
											%
										</div>
									</div>
								</CardContent>
							</Card>
						)}
				</div>

				{/* Configurações */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
						⚙️ Configurações
					</h3>

					<div className="space-y-6">
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<Label>Taxa da plataforma (%)</Label>
								<span className="text-2xl font-bold text-primary">
									{taxaPlataforma}%
								</span>
							</div>
							<Slider
								value={[taxaPlataforma]}
								onValueChange={(value) => setTaxaPlataforma(value[0])}
								min={5}
								max={70}
								step={5}
								className="w-full"
							/>
							<p className="text-sm text-muted-foreground">
								Focoradical: 10% próprios | 40-70% plataforma
							</p>
						</div>

						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<Label>Margem de lucro desejada (%)</Label>
								<span className="text-2xl font-bold text-green-600">
									{margemLucroDesejada}%
								</span>
							</div>
							<Slider
								value={[margemLucroDesejada]}
								onValueChange={(value) => setMargemLucroDesejada(value[0])}
								min={10}
								max={100}
								step={5}
								className="w-full"
							/>
							<p className="text-sm text-muted-foreground">
								Recomendado: 30% a 50% para eventos
							</p>
						</div>
					</div>
				</div>

				<Button type="submit" className="w-full" size="lg">
					Calcular Precificação
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
