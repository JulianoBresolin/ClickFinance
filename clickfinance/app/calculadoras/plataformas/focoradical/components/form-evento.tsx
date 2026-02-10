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
import { EquipamentosManager } from "../../../../../components/equipamentos/equipamentos-manager";
import {
	type DadosEvento,
	type EquipamentoDepreciacao,
	formatMoeda,
} from "@/lib/calculator-utils-evento";
import { Card, CardContent } from "@/components/ui/card";

interface FormEventoProps {
	onCalculate: (dados: DadosEvento) => void;
}

export function FormEvento({ onCalculate }: FormEventoProps) {
	// Equipamentos
	const [equipamentos, setEquipamentos] = useState<EquipamentoDepreciacao[]>(
		[],
	);
	const [usarDepreciacaoPorTempo, setUsarDepreciacaoPorTempo] = useState(false);

	// Dados do Form
	const [formData, setFormData] = useState({
		nome: "",
		tipo: "plataforma" as "proprio" | "plataforma", // Default plataforma agora
		comissaoSelecionada: "65", // Default para Oficial FocoRadical
		comissaoPersonalizada: "",
		diasEvento: "1",
		fotosFeitas: "",
		fotosFeitasMecanicas: "",
		fotosVendidas: "",
		receitaLiquida: "", // Valor que aparece no dashboard
		custosOperacionais: "",
	});

	const parseCurrency = (value: string): number => {
		if (!value) return 0;
		return Number(value.replace(/\./g, "").replace(",", "."));
	};

	// Cálculo de depreciação em tempo real para feedback visual
	const depreciacaoEstimada = useMemo(() => {
		let total = 0;
		const dias = Number(formData.diasEvento) || 1;
		const fotosMec =
			Number(formData.fotosFeitasMecanicas) ||
			Number(formData.fotosFeitas) ||
			0;

		equipamentos.forEach((equip) => {
			if (usarDepreciacaoPorTempo) {
				if (equip.anosDurabilidade && equip.anosDurabilidade > 0) {
					total +=
						((equip.valor * equip.quantidade) /
							(equip.anosDurabilidade * 365)) *
						dias;
				}
			} else {
				if (equip.tipo === "camera" && equip.vidaUtil && equip.vidaUtil > 0) {
					total += fotosMec * (equip.valor / equip.vidaUtil) * equip.quantidade;
				}
			}
		});
		return formatMoeda(total);
	}, [
		equipamentos,
		usarDepreciacaoPorTempo,
		formData.diasEvento,
		formData.fotosFeitasMecanicas,
		formData.fotosFeitas,
	]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (equipamentos.length === 0) {
			alert("Adicione pelo menos um equipamento!");
			return;
		}

		// Determinar comissão
		let comissaoFinal = 100; // Se for próprio, é 100% seu
		if (formData.tipo === "plataforma") {
			if (formData.comissaoSelecionada === "custom") {
				comissaoFinal = Number(formData.comissaoPersonalizada) || 0;
			} else {
				comissaoFinal = Number(formData.comissaoSelecionada);
			}
		}

		const dados: DadosEvento = {
			equipamentos,
			usarDepreciacaoPorTempo,
			diasEvento: Number(formData.diasEvento) || 1,
			nome: formData.nome || "Evento",
			tipo: formData.tipo,
			porcentagemComissao: comissaoFinal,
			fotosFeitas: Number(formData.fotosFeitas) || 0,
			fotosFeitasMecanicas: Number(formData.fotosFeitasMecanicas) || 0,
			fotosVendidas: Number(formData.fotosVendidas) || 0,
			receitaLiquidaTotal: parseCurrency(formData.receitaLiquida),
			custosOperacionais: parseCurrency(formData.custosOperacionais),
		};

		if (dados.fotosVendidas === 0 || dados.receitaLiquidaTotal === 0) {
			alert("Preencha o valor recebido e a quantidade de vendas!");
			return;
		}

		onCalculate(dados);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Seção Equipamentos (Reutilizando Manager) */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
					📷 Equipamentos
				</h3>

				<div className="flex items-center space-x-2 bg-secondary/20 p-3 rounded-md mb-2">
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
						Calcular por tempo (Ideal para Mirrorless)
					</Label>
				</div>

				<EquipamentosManager
					equipamentos={equipamentos}
					onChange={setEquipamentos}
					usarDepreciacaoPorTempo={usarDepreciacaoPorTempo}
				/>

				{usarDepreciacaoPorTempo && (
					<div className="mt-2 w-1/2">
						<Label htmlFor="diasEvento">Duração (Dias)</Label>
						<NumberInput
							id="diasEvento"
							value={formData.diasEvento}
							onValueChange={(v) => setFormData({ ...formData, diasEvento: v })}
						/>
					</div>
				)}

				{parseCurrency(depreciacaoEstimada) > 0 && (
					<Card className="bg-blue-50 border-blue-200 mt-2">
						<CardContent className="pt-4 pb-4">
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<Calculator className="h-4 w-4 text-blue-600" />
									<span className="text-sm text-blue-900 font-medium">
										Depreciação Estimada
									</span>
								</div>
								<span className="font-bold text-blue-600">
									R$ {depreciacaoEstimada}
								</span>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Dados do Evento */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
					🎯 Dados Financeiros (Dashboard)
				</h3>

				<Alert>
					<Info className="h-4 w-4" />
					<AlertDescription>
						Copie os dados diretamente do resumo financeiro do evento na
						plataforma.
					</AlertDescription>
				</Alert>

				<div className="space-y-2">
					<Label htmlFor="nome">Nome do Evento</Label>
					<Input
						id="nome"
						placeholder="Ex: 2° CORRIDA DA PRF"
						value={formData.nome}
						onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Tipo de Venda</Label>
						<Select
							value={formData.tipo}
							onValueChange={(v: "proprio" | "plataforma") =>
								setFormData({ ...formData, tipo: v })
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="plataforma">
									Plataforma (FocoRadical, etc)
								</SelectItem>
								<SelectItem value="proprio">
									Venda Própria (100% seu)
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{formData.tipo === "plataforma" && (
						<div className="space-y-2">
							<Label>Sua Comissão (%)</Label>
							<Select
								value={formData.comissaoSelecionada}
								onValueChange={(v) =>
									setFormData({ ...formData, comissaoSelecionada: v })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="65">Oficial (65%)</SelectItem>
									<SelectItem value="55">Não Oficial (55%)</SelectItem>
									<SelectItem value="custom">Outra...</SelectItem>
								</SelectContent>
							</Select>

							{formData.comissaoSelecionada === "custom" && (
								<div className="mt-2">
									<NumberInput
										placeholder="Digite a %"
										value={formData.comissaoPersonalizada}
										onValueChange={(v) =>
											setFormData({ ...formData, comissaoPersonalizada: v })
										}
									/>
								</div>
							)}
						</div>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="receitaLiquida">Valor Recebido (Líquido)</Label>
						<CurrencyInput
							id="receitaLiquida"
							placeholder="Ex: 950,47"
							value={formData.receitaLiquida}
							onValueChange={(v) =>
								setFormData({ ...formData, receitaLiquida: v })
							}
						/>
						<p className="text-xs text-muted-foreground">
							Valor final que apareceu no app.
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="fotosVendidas">Fotos Vendidas</Label>
						<NumberInput
							id="fotosVendidas"
							placeholder="Ex: 110"
							value={formData.fotosVendidas}
							onValueChange={(v) =>
								setFormData({ ...formData, fotosVendidas: v })
							}
						/>
					</div>
				</div>
			</div>

			{/* Produção e Custos */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold border-b-2 border-primary pb-2">
					📊 Produção e Custos
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label htmlFor="fotosFeitas">Total Fotos Capturadas</Label>
						<NumberInput
							id="fotosFeitas"
							placeholder="Ex: 5000"
							value={formData.fotosFeitas}
							onValueChange={(v) =>
								setFormData({ ...formData, fotosFeitas: v })
							}
						/>
					</div>

					{!usarDepreciacaoPorTempo && (
						<div className="space-y-2">
							<Label htmlFor="fotosMecanicas">Fotos (Mecânicas)</Label>
							<NumberInput
								id="fotosMecanicas"
								placeholder="Ex: 6000"
								value={formData.fotosFeitasMecanicas}
								onValueChange={(v) =>
									setFormData({ ...formData, fotosFeitasMecanicas: v })
								}
							/>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="custos">Custos do Dia (R$)</Label>
						<CurrencyInput
							id="custos"
							placeholder="Ex: 80,00"
							value={formData.custosOperacionais}
							onValueChange={(v) =>
								setFormData({ ...formData, custosOperacionais: v })
							}
						/>
						<p className="text-xs text-muted-foreground">
							Gasolina, lanche, etc.
						</p>
					</div>
				</div>
			</div>

			<Button type="submit" className="w-full" size="lg">
				Calcular Resultado do Evento
			</Button>
		</form>
	);
}
