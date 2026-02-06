"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { NumberInput } from "@/components/ui/number-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Camera, Aperture, Box } from "lucide-react";
import { type EquipamentoDepreciacao } from "@/lib/calculator-utils-anual";

interface EquipamentosManagerProps {
	equipamentos: EquipamentoDepreciacao[];
	onChange: (equipamentos: EquipamentoDepreciacao[]) => void;
	usarDepreciacaoPorTempo: boolean;
}

export function EquipamentosManager({
	equipamentos,
	onChange,
	usarDepreciacaoPorTempo,
}: EquipamentosManagerProps) {
	const [mostrarForm, setMostrarForm] = useState(false);
	const [novoEquip, setNovoEquip] = useState({
		nome: "",
		tipo: "camera" as "camera" | "lente" | "outro",
		valor: "",
		vidaUtil: "",
		anosDurabilidade: "",
		quantidade: "1",
	});

	const parseCurrency = (value: string): number => {
		if (!value) return 0;
		return Number(value.replace(/\./g, "").replace(",", "."));
	};

	const adicionarEquipamento = () => {
		if (!novoEquip.nome || !novoEquip.valor) {
			alert("Preencha o nome e valor do equipamento!");
			return;
		}

		const equipamento: EquipamentoDepreciacao = {
			id: Date.now().toString(),
			nome: novoEquip.nome,
			tipo: novoEquip.tipo,
			valor: parseCurrency(novoEquip.valor),
			vidaUtil: Number(novoEquip.vidaUtil) || undefined,
			anosDurabilidade: Number(novoEquip.anosDurabilidade) || undefined,
			quantidade: Number(novoEquip.quantidade) || 1,
		};

		onChange([...equipamentos, equipamento]);

		// Resetar form
		setNovoEquip({
			nome: "",
			tipo: "camera",
			valor: "",
			vidaUtil: "",
			anosDurabilidade: "",
			quantidade: "1",
		});
		setMostrarForm(false);
	};

	const removerEquipamento = (id: string) => {
		onChange(equipamentos.filter((e) => e.id !== id));
	};

	const getIcon = (tipo: string) => {
		switch (tipo) {
			case "camera":
				return <Camera className="h-4 w-4" />;
			case "lente":
				return <Aperture className="h-4 w-4" />;
			default:
				return <Box className="h-4 w-4" />;
		}
	};

	const getTipoBadge = (tipo: string) => {
		const styles = {
			camera: "bg-blue-100 text-blue-800",
			lente: "bg-green-100 text-green-800",
			outro: "bg-gray-100 text-gray-800",
		};
		return styles[tipo as keyof typeof styles] || styles.outro;
	};

	return (
		<div className="space-y-4">
			{/* Lista de Equipamentos */}
			{equipamentos.length > 0 && (
				<div className="space-y-2">
					{equipamentos.map((equip) => (
						<Card key={equip.id} className="bg-muted/50">
							<CardContent className="pt-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 flex-1">
										<div className="p-2 bg-background rounded-lg">
											{getIcon(equip.tipo)}
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<p className="font-medium">{equip.nome}</p>
												<Badge className={getTipoBadge(equip.tipo)}>
													{equip.tipo === "camera"
														? "Câmera"
														: equip.tipo === "lente"
															? "Lente"
															: "Outro"}
												</Badge>
											</div>
											<div className="flex gap-4 text-sm text-muted-foreground mt-1">
												<span>
													R${" "}
													{equip.valor.toLocaleString("pt-BR", {
														minimumFractionDigits: 2,
													})}
												</span>
												{equip.quantidade > 1 && (
													<span>Qtd: {equip.quantidade}</span>
												)}
												{equip.vidaUtil && (
													<span>
														{equip.vidaUtil.toLocaleString("pt-BR")} cliques
													</span>
												)}
												{equip.anosDurabilidade && (
													<span>{equip.anosDurabilidade} anos</span>
												)}
											</div>
										</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => removerEquipamento(equip.id)}
										className="text-destructive hover:text-destructive"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Formulário de Novo Equipamento */}
			{mostrarForm ? (
				<Card>
					<CardContent className="pt-6 space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="equipNome">Nome do Equipamento</Label>
								<Input
									id="equipNome"
									placeholder="Ex: Sony A7IV"
									value={novoEquip.nome}
									onChange={(e) =>
										setNovoEquip({ ...novoEquip, nome: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="equipTipo">Tipo</Label>
								<Select
									value={novoEquip.tipo}
									onValueChange={(value: "camera" | "lente" | "outro") =>
										setNovoEquip({ ...novoEquip, tipo: value })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="camera">Câmera</SelectItem>
										<SelectItem value="lente">Lente</SelectItem>
										<SelectItem value="outro">
											Outro (Flash, Tripé, etc)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="equipValor">Valor (R$)</Label>
								<CurrencyInput
									id="equipValor"
									placeholder="Ex: 18.500,00"
									value={novoEquip.valor}
									onValueChange={(value) =>
										setNovoEquip({ ...novoEquip, valor: value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="equipQuantidade">Quantidade</Label>
								<NumberInput
									id="equipQuantidade"
									placeholder="Ex: 1"
									value={novoEquip.quantidade}
									onValueChange={(value) =>
										setNovoEquip({ ...novoEquip, quantidade: value })
									}
								/>
							</div>

							{novoEquip.tipo === "camera" && !usarDepreciacaoPorTempo && (
								<div className="space-y-2">
									<Label htmlFor="equipVidaUtil">Vida Útil (cliques)</Label>
									<NumberInput
										id="equipVidaUtil"
										placeholder="Ex: 300.000"
										value={novoEquip.vidaUtil}
										onValueChange={(value) =>
											setNovoEquip({ ...novoEquip, vidaUtil: value })
										}
									/>
									<p className="text-xs text-muted-foreground">
										Para câmeras DSLR
									</p>
								</div>
							)}

							{(novoEquip.tipo !== "camera" || usarDepreciacaoPorTempo) && (
								<div className="space-y-2">
									<Label htmlFor="equipAnos">Durabilidade (Anos)</Label>
									<NumberInput
										id="equipAnos"
										placeholder="Ex: 5"
										value={novoEquip.anosDurabilidade}
										onValueChange={(value) =>
											setNovoEquip({ ...novoEquip, anosDurabilidade: value })
										}
									/>
									<p className="text-xs text-muted-foreground">
										{novoEquip.tipo === "camera"
											? "Para câmeras Mirrorless"
											: "Tempo até troca"}
									</p>
								</div>
							)}
						</div>

						<div className="flex gap-2">
							<Button onClick={adicionarEquipamento} className="flex-1">
								Adicionar Equipamento
							</Button>
							<Button variant="outline" onClick={() => setMostrarForm(false)}>
								Cancelar
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<Button
					variant="outline"
					className="w-full"
					onClick={() => setMostrarForm(true)}
				>
					<Plus className="h-4 w-4 mr-2" />
					Adicionar Equipamento
				</Button>
			)}
		</div>
	);
}
