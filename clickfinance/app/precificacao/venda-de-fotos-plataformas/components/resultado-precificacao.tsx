"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	type ResultadoPrecificacao,
	gerarInsightsPrecificacao,
} from "@/lib/pricing-utils";
import { formatMoeda, formatPorcentagem } from "@/lib/calculator-utils";
import { TrendingUp, Target, DollarSign, AlertTriangle } from "lucide-react";

interface ResultadoPrecificacaoProps {
	resultado: ResultadoPrecificacao;
}

export function ResultadoPrecificacao({
	resultado,
}: ResultadoPrecificacaoProps) {
	const insights = gerarInsightsPrecificacao(resultado);

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-500">
			{/* Preços Recomendados */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="border-2 border-red-200 bg-red-50">
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 mb-2">
							<AlertTriangle className="h-5 w-5 text-red-600" />
							<p className="text-sm font-medium text-red-900">Preço Mínimo</p>
						</div>
						<div className="text-3xl font-bold text-red-600">
							R$ {formatMoeda(resultado.precoMinimoSemPrejuizo)}
						</div>
						<p className="text-xs text-red-700 mt-1">Break-even (sem lucro)</p>
					</CardContent>
				</Card>

				<Card className="border-2 border-green-200 bg-green-50">
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 mb-2">
							<Target className="h-5 w-5 text-green-600" />
							<p className="text-sm font-medium text-green-900">
								Preço Sugerido
							</p>
						</div>
						<div className="text-3xl font-bold text-green-600">
							R$ {formatMoeda(resultado.precoSugeridoComMargem)}
						</div>
						<p className="text-xs text-green-700 mt-1">
							Com {formatPorcentagem(resultado.margemLucroReal, 0)}% de margem
						</p>
					</CardContent>
				</Card>

				<Card className="border-2 border-blue-200 bg-blue-50">
					<CardContent className="pt-6">
						<div className="flex items-center gap-2 mb-2">
							<DollarSign className="h-5 w-5 text-blue-600" />
							<p className="text-sm font-medium text-blue-900">
								Custo por Venda
							</p>
						</div>
						<div className="text-3xl font-bold text-blue-600">
							R$ {formatMoeda(resultado.custoTotalPorFotoVendida)}
						</div>
						<p className="text-xs text-blue-700 mt-1">Custo real por foto</p>
					</CardContent>
				</Card>
			</div>

			{/* Análise Financeira */}
			<Card>
				<CardHeader>
					<CardTitle>💰 Projeção Financeira</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Receita Bruta
							</div>
							<div className="text-xl font-semibold">
								R$ {formatMoeda(resultado.receitaBrutaEstimada)}
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Taxa Plataforma
							</div>
							<div className="text-xl font-semibold text-red-600">
								-R$ {formatMoeda(resultado.taxaPlataformaValor)}
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Receita Líquida
							</div>
							<div className="text-xl font-semibold text-green-600">
								R$ {formatMoeda(resultado.receitaLiquidaEstimada)}
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Custo Total
							</div>
							<div className="text-xl font-semibold text-red-600">
								-R$ {formatMoeda(resultado.custoTotalEstimado)}
							</div>
							<p className="text-xs text-muted-foreground">
								Depreciação: R${" "}
								{formatMoeda(resultado.custoDepreciacaoEstimado)}
							</p>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Lucro Estimado
							</div>
							<div
								className={`text-xl font-semibold ${resultado.lucroLiquidoEstimado >= 0 ? "text-green-600" : "text-red-600"}`}
							>
								{resultado.lucroLiquidoEstimado >= 0 ? "+" : ""}R${" "}
								{formatMoeda(resultado.lucroLiquidoEstimado)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Métricas Importantes */}
			<Card>
				<CardHeader>
					<CardTitle>📊 Métricas Importantes</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
							<div className="text-sm text-muted-foreground mb-1">
								ROI Estimado
							</div>
							<div
								className={`text-2xl font-semibold ${resultado.roiEstimado >= 0 ? "text-green-600" : "text-red-600"}`}
							>
								{formatPorcentagem(resultado.roiEstimado, 1)}%
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Margem de Lucro
							</div>
							<div
								className={`text-2xl font-semibold ${resultado.margemLucroReal >= 0 ? "text-green-600" : "text-red-600"}`}
							>
								{formatPorcentagem(resultado.margemLucroReal, 1)}%
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Conversão Necessária
							</div>
							<div className="text-2xl font-semibold">
								{formatPorcentagem(resultado.taxaConversaoNecessaria, 2)}%
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Ponto de Equilíbrio
							</div>
							<div className="text-2xl font-semibold">
								{Math.ceil(resultado.pontoEquilibrio)} fotos
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Cenários de Precificação */}
			<Card>
				<CardHeader>
					<CardTitle>🎯 Cenários de Precificação</CardTitle>
					<p className="text-sm text-muted-foreground">
						Compare diferentes preços e seus impactos no lucro
					</p>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b">
									<th className="text-left p-2 text-sm font-medium">Preço</th>
									<th className="text-right p-2 text-sm font-medium">
										Receita Bruta
									</th>
									<th className="text-right p-2 text-sm font-medium">
										Receita Líquida
									</th>
									<th className="text-right p-2 text-sm font-medium">Lucro</th>
									<th className="text-right p-2 text-sm font-medium">Margem</th>
									<th className="text-right p-2 text-sm font-medium">ROI</th>
								</tr>
							</thead>
							<tbody>
								{resultado.cenarios.map((cenario, index) => {
									const isRecommended =
										Math.abs(cenario.preco - resultado.precoSugeridoComMargem) <
										0.5;
									return (
										<tr
											key={index}
											className={`border-b hover:bg-muted/50 ${isRecommended ? "bg-green-50" : ""}`}
										>
											<td className="p-2">
												<div className="flex items-center gap-2">
													<span className="font-semibold">
														R$ {formatMoeda(cenario.preco)}
													</span>
													{isRecommended && (
														<Badge className="bg-green-600">Recomendado</Badge>
													)}
												</div>
											</td>
											<td className="text-right p-2">
												R$ {formatMoeda(cenario.receitaBruta)}
											</td>
											<td className="text-right p-2">
												R$ {formatMoeda(cenario.receitaLiquida)}
											</td>
											<td
												className={`text-right p-2 font-semibold ${cenario.lucro >= 0 ? "text-green-600" : "text-red-600"}`}
											>
												{cenario.lucro >= 0 ? "+" : ""}R${" "}
												{formatMoeda(cenario.lucro)}
											</td>
											<td
												className={`text-right p-2 ${cenario.margem >= 0 ? "text-green-600" : "text-red-600"}`}
											>
												{formatPorcentagem(cenario.margem, 1)}%
											</td>
											<td
												className={`text-right p-2 ${cenario.roi >= 0 ? "text-green-600" : "text-red-600"}`}
											>
												{formatPorcentagem(cenario.roi, 1)}%
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Insights */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						💡 Insights e Recomendações
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{insights.map((insight, index) => (
						<Alert key={index}>
							<AlertDescription>{insight}</AlertDescription>
						</Alert>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
