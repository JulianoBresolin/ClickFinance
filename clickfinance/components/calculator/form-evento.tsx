"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Info, Calculator } from "lucide-react";
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
	const [precoFoto, setPrecoFoto] = useState("");
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

	// Calcular depreciação usando useMemo (forma correta)
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
			precoFoto: parseCurrency(precoFoto),
			depreciacao: parseCurrency(depreciacaoCalculada),
			custos: parseCurrency(custos),
		};

		if (
			dados.fotosFeitas === 0 ||
			dados.fotosVendidas === 0 ||
			dados.precoFoto === 0
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
				<AlertDescription>
					Use para analisar eventos <strong>individuais</strong> com cálculo
					automático de depreciação
				</AlertDescription>
			</Alert>

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
							placeholder="Ex: 4.500,00"
							value={valorCamera}
							onValueChange={setValorCamera}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="vidaTotal">Vida útil do obturador</Label>
						<Input
							id="vidaTotal"
							type="number"
							placeholder="Ex: 100000"
							value={vidaTotal}
							onChange={(e) => setVidaTotal(e.target.value)}
						/>
						<p className="text-sm text-muted-foreground">
							Total de cliques esperados
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="cliquesAtuais">Cliques atuais</Label>
						<Input
							id="cliquesAtuais"
							type="number"
							placeholder="Ex: 35600"
							value={cliquesAtuais}
							onChange={(e) => setCliquesAtuais(e.target.value)}
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

			{/* Dados do Evento */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
					🎯 Dados do Evento
				</h3>

				<div className="space-y-2">
					<Label htmlFor="nome">Nome do evento</Label>
					<Input
						id="nome"
						placeholder="Ex: MEIA MARATONA DE CURITIBA 2025"
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
							<Input
								id="taxaPlataforma"
								type="number"
								placeholder="Ex: 60"
								value={taxaPlataforma}
								onChange={(e) => setTaxaPlataforma(e.target.value)}
							/>
							<p className="text-sm text-muted-foreground">
								Entre 40% e 70% para eventos da plataforma
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Produção */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
					📸 Produção
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label htmlFor="fotosFeitas">Fotos capturadas</Label>
						<Input
							id="fotosFeitas"
							type="number"
							placeholder="Ex: 2500"
							value={fotosFeitas}
							onChange={(e) => setFotosFeitas(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="fotosVendidas">Fotos vendidas</Label>
						<Input
							id="fotosVendidas"
							type="number"
							placeholder="Ex: 45"
							value={fotosVendidas}
							onChange={(e) => setFotosVendidas(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="precoFoto">Preço por foto (R$)</Label>
						<CurrencyInput
							id="precoFoto"
							placeholder="Ex: 9,50"
							value={precoFoto}
							onValueChange={setPrecoFoto}
						/>
						<p className="text-sm text-muted-foreground">
							Preço bruto antes das taxas
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
	);
}
