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
import { Info, Calculator, TrendingUp } from "lucide-react";
import { type DadosEvento } from "@/lib/calculator-utils";
import { Card, CardContent } from "@/components/ui/card";

interface FormEventoProps {
	onCalculate: (dados: DadosEvento) => void;
}

export function FormEvento({ onCalculate }: FormEventoProps) {
	const [nome, setNome] = useState("");
	const [tipo, setTipo] = useState<"proprio" | "plataforma">("proprio");
	const [taxaPlataforma, setTaxaPlataforma] = useState("");
	const [fotosFeitas, setFotosFeitas] = useState("");
	const [fotosVendidas, setFotosVendidas] = useState("");
	const [faturamentoBruto, setFaturamentoBruto] = useState("");
	const [custos, setCustos] = useState("");
	const [valorCamera, setValorCamera] = useState("");
	const [vidaTotal, setVidaTotal] = useState("");
	const [cliquesAtuais, setCliquesAtuais] = useState("");

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
		const valorCam = parseCurrency(valorCamera);
		const vidaTot = Number(vidaTotal) || 1;
		const fotosFeit = Number(fotosFeitas) || 0;

		if (valorCam > 0 && vidaTot > 0 && fotosFeit > 0) {
			const custoPorClique = valorCam / vidaTot;
			const depreciacao = fotosFeit * custoPorClique;
			return formatMoeda(depreciacao);
		}
		return "0,00";
	}, [valorCamera, vidaTotal, fotosFeitas]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const dados: DadosEvento = {
			nome: nome || "Evento sem nome",
			tipo: tipo,
			taxaPlataforma: tipo === "proprio" ? 10 : Number(taxaPlataforma) || 50,
			fotosFeitas: Number(fotosFeitas) || 0,
			fotosVendidas: Number(fotosVendidas) || 0,
			precoFoto: precoMedioPorFoto,
			depreciacao: parseCurrency(depreciacaoCalculada),
			custos: parseCurrency(custos),
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
	};

	return (
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

			{/* Produção e Vendas */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
					📸 Produção e Vendas
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

					<div className="space-y-2">
						<Label htmlFor="fotosVendidas">Fotos vendidas</Label>
						<NumberInput
							id="fotosVendidas"
							placeholder="Ex: 3"
							value={fotosVendidas}
							onValueChange={setFotosVendidas}
						/>
						<p className="text-sm text-muted-foreground">Quantidade vendida</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="faturamentoBruto">Total faturado (R$)</Label>
						<CurrencyInput
							id="faturamentoBruto"
							placeholder="Ex: 30,27"
							value={faturamentoBruto}
							onValueChange={setFaturamentoBruto}
						/>
						<p className="text-sm text-muted-foreground">
							Valor bruto antes das taxas
						</p>
					</div>
				</div>

				{/* Card com preço médio calculado */}
				{precoMedioPorFoto > 0 && (
					<Card className="bg-green-50 border-green-200">
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<TrendingUp className="h-5 w-5 text-green-600" />
									<div>
										<p className="text-sm font-medium text-green-900">
											Preço médio por foto
										</p>
										<p className="text-xs text-green-700">
											R$ {formatMoeda(parseCurrency(faturamentoBruto))} ÷{" "}
											{Number(fotosVendidas)} fotos
										</p>
									</div>
								</div>
								<div className="text-2xl font-bold text-green-600">
									R$ {formatMoeda(precoMedioPorFoto)}
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Equipamento */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
					📷 Equipamento
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label htmlFor="valorCamera">Valor da câmera (R$)</Label>
						<CurrencyInput
							id="valorCamera"
							placeholder="Ex: 25.500,00"
							value={valorCamera}
							onValueChange={setValorCamera}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="vidaTotal">Vida útil do obturador</Label>
						<NumberInput
							id="vidaTotal"
							placeholder="Ex: 350.000"
							value={vidaTotal}
							onValueChange={setVidaTotal}
						/>
						<p className="text-sm text-muted-foreground">
							Total de cliques esperados
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="cliquesAtuais">Cliques atuais</Label>
						<NumberInput
							id="cliquesAtuais"
							placeholder="Ex: 98.600"
							value={cliquesAtuais}
							onValueChange={setCliquesAtuais}
						/>
						<p className="text-sm text-muted-foreground">
							Contagem do obturador
						</p>
					</div>
				</div>

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
											{Number(fotosFeitas).toLocaleString("pt-BR")} fotos × R${" "}
											{formatMoeda(
												parseCurrency(valorCamera) / (Number(vidaTotal) || 1),
											)}{" "}
											por clique
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
	);
}
