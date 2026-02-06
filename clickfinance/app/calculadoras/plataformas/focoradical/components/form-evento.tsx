"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { NumberInput } from "@/components/ui/number-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Info, Calculator } from "lucide-react";
import { type DadosEvento } from "@/lib/calculator-utils-evento";
import { Card, CardContent } from "@/components/ui/card";
import { SearchPopup } from "@/components/layout/search-popup";
import { EquipamentosManager } from "./equipamentos-manager";
import { type EquipamentoDepreciacao } from "@/lib/calculator-utils-anual";

interface FormEventoProps {
	onCalculate: (dados: DadosEvento) => void;
}

export function FormEvento({ onCalculate }: FormEventoProps) {
	const [nome, setNome] = useState("");
	const [tipo, setTipo] = useState<"proprio" | "plataforma">("proprio");
	const [taxaPlataforma, setTaxaPlataforma] = useState("");
	const [fotosFeitas, setFotosFeitas] = useState("");
	const [fotosFeitasMecanicas, setFotosFeitasMecanicas] = useState("");
	const [fotosVendidas, setFotosVendidas] = useState("");
	const [faturamentoBruto, setFaturamentoBruto] = useState("");
	const [custos, setCustos] = useState("");
	const [usarDepreciacaoPorTempo, setUsarDepreciacaoPorTempo] = useState(false);
	const [diasEvento, setDiasEvento] = useState("1");
	const [equipamentos, setEquipamentos] = useState<EquipamentoDepreciacao[]>(
		[],
	);
	const [showPopup, setShowPopup] = useState(false);

	const parseCurrency = (value: string): number => {
		if (!value) return 0;
		return Number(value.replace(/\./g, "").replace(",", "."));
	};

	const formatMoeda = (valor: number): string => {
		return valor.toLocaleString("pt-BR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	// Calcular preço médio por foto
	const precoMedioPorFoto = useMemo(() => {
		const faturamento = parseCurrency(faturamentoBruto);
		const vendidas = Number(fotosVendidas) || 0;

		if (faturamento > 0 && vendidas > 0) {
			return faturamento / vendidas;
		}
		return 0;
	}, [faturamentoBruto, fotosVendidas]);

	// Calcular depreciação usando useMemo
	const depreciacaoCalculada = useMemo(() => {
		let total = 0;
		const dias = Number(diasEvento) || 1;
		const fotosMecanicas =
			Number(fotosFeitasMecanicas) || Number(fotosFeitas) || 0;

		equipamentos.forEach((equip) => {
			if (usarDepreciacaoPorTempo) {
				if (equip.anosDurabilidade && equip.anosDurabilidade > 0) {
					const depDiaria =
						(equip.valor * equip.quantidade) / (equip.anosDurabilidade * 365);
					total += depDiaria * dias;
				}
			} else {
				if (equip.tipo === "camera" && equip.vidaUtil && equip.vidaUtil > 0) {
					const custoPorClique = equip.valor / equip.vidaUtil;
					total += fotosMecanicas * custoPorClique * equip.quantidade;
				}
			}
		});

		return formatMoeda(total);
	}, [
		equipamentos,
		usarDepreciacaoPorTempo,
		diasEvento,
		fotosFeitasMecanicas,
		fotosFeitas,
	]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const dados: DadosEvento = {
			nome: nome || "Evento sem nome",
			tipo: tipo,
			taxaPlataforma: tipo === "proprio" ? 10 : Number(taxaPlataforma) || 50,
			fotosFeitas: Number(fotosFeitas) || 0,
			fotosFeitasMecanicas: Number(fotosFeitasMecanicas) || 0,
			fotosVendidas: Number(fotosVendidas) || 0,
			precoFoto: precoMedioPorFoto,
			custos: parseCurrency(custos),
			equipamentos,
			usarDepreciacaoPorTempo,
			diasEvento: Number(diasEvento),
		};

		if (
			dados.fotosFeitas === 0 ||
			dados.fotosVendidas === 0 ||
			precoMedioPorFoto === 0
		) {
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
				{/* Dados do Evento */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
						🎯 Dados do Evento
					</h3>
					<Alert>
						<Info className="h-4 w-4" />
						<AlertDescription className="flex align-items-center">
							Vá até o card do evento e veja os as porcentagens cobradas pela
							plataforma.
						</AlertDescription>
					</Alert>
					<div className="space-y-2">
						<Label htmlFor="nome">Nome do evento</Label>
						<Input
							id="nome"
							placeholder="Ex:Maratona de Curitiba"
							value={nome}
							onChange={(e) => setNome(e.target.value)}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="tipo">Tipo de evento</Label>
							<Select
								value={tipo}
								onValueChange={(value: "proprio" | "plataforma") =>
									setTipo(value)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="proprio">Evento Próprio (10%)</SelectItem>
									<SelectItem value="plataforma">
										Evento da Plataforma (variável)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{tipo === "plataforma" && (
							<div className="space-y-2">
								<Label htmlFor="taxaPlataforma">Taxa da plataforma (%)</Label>
								<NumberInput
									id="taxaPlataforma"
									placeholder="Ex: 60"
									value={taxaPlataforma}
									onValueChange={setTaxaPlataforma}
								/>
								<p className="text-sm text-muted-foreground">
									Entre 40% e 70% para eventos da plataforma
								</p>
							</div>
						)}
					</div>
				</div>
				{/* Equipamento */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
						📷 Equipamento
					</h3>

					<div className="flex items-center space-x-2 bg-secondary/20 p-3 rounded-md mb-4">
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
							Calcular depreciação por tempo (Ideal para Mirrorless / Obturador
							Eletrônico)
						</Label>
					</div>

					<EquipamentosManager
						equipamentos={equipamentos}
						onChange={setEquipamentos}
						usarDepreciacaoPorTempo={usarDepreciacaoPorTempo}
					/>

					{usarDepreciacaoPorTempo && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
							<div className="space-y-2">
								<Label htmlFor="diasEvento">Duração do Evento (Dias)</Label>
								<NumberInput
									id="diasEvento"
									placeholder="Ex: 1"
									value={diasEvento}
									onValueChange={setDiasEvento}
								/>
								<p className="text-sm text-muted-foreground">
									Para cálculo de depreciação por tempo
								</p>
							</div>
						</div>
					)}

					{/* Card com depreciação calculada */}
					{parseCurrency(depreciacaoCalculada) > 0 && (
						<Card className="bg-blue-50 border-blue-200">
							<CardContent className="pt-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Calculator className="h-5 w-5 text-blue-600" />
										<div>
											<p className="text-sm font-medium text-blue-900">
												Depreciação calculada
											</p>
											<p className="text-xs text-blue-700">
												{usarDepreciacaoPorTempo
													? `Baseado em ${diasEvento} dia(s) de uso`
													: `Baseado em cliques do obturador`}
											</p>
										</div>
									</div>
									<div className="text-2xl font-bold text-blue-600">
										R$ {depreciacaoCalculada}
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Produção e Vendas */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
						📸 Produção e Vendas
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label htmlFor="fotosFeitas">Fotos capturadas</Label>
							<NumberInput
								id="fotosFeitas"
								placeholder="Ex: 15.500"
								value={fotosFeitas}
								onValueChange={setFotosFeitas}
							/>
							<p className="text-sm text-muted-foreground">
								Total de fotos tiradas
							</p>
						</div>

						{!usarDepreciacaoPorTempo && (
							<div className="space-y-2">
								<Label htmlFor="fotosFeitasMecanicas">
									Fotos com obturador mecânico
								</Label>
								<NumberInput
									id="fotosFeitasMecanicas"
									placeholder="Ex: 8.500"
									value={fotosFeitasMecanicas}
									onValueChange={setFotosFeitasMecanicas}
								/>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="fotosVendidas">Fotos vendidas</Label>
							<NumberInput
								id="fotosVendidas"
								placeholder="Ex: 120"
								value={fotosVendidas}
								onValueChange={setFotosVendidas}
							/>
							<p className="text-sm text-muted-foreground">
								Quantidade vendida
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="faturamentoBruto">Total faturado (R$)</Label>
							<CurrencyInput
								id="faturamentoBruto"
								placeholder="Ex: 1,308.00"
								value={faturamentoBruto}
								onValueChange={setFaturamentoBruto}
							/>
							<p className="text-sm text-muted-foreground">
								Valor bruto antes das taxas
							</p>
						</div>
					</div>
				</div>

				{/* Custos */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
						💸 Custos Operacionais
					</h3>

					<div className="space-y-2">
						<Label htmlFor="custos">Custos operacionais (R$)</Label>
						<CurrencyInput
							id="custos"
							placeholder="Ex: 150,00"
							value={custos}
							onValueChange={setCustos}
						/>
						<p className="text-sm text-muted-foreground">
							Combustível, alimentação, estacionamento, etc.
						</p>
					</div>
				</div>

				<Button type="submit" className="w-full" size="lg">
					Calcular Análise do Evento
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
