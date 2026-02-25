"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	type ResultadoAnual,
	type DadosAnuais,
	gerarRecomendacoes,
	formatMoeda,
	formatNumero,
	formatPorcentagem,
} from "@/lib/calculator-utils-anual";
import { Camera, Aperture, Box } from "lucide-react";

interface ResultadoAnualProps {
	resultado: ResultadoAnual;
	dados: DadosAnuais;
}

const nivelStyles: Record<string, string> = {
	iniciante: "bg-blue-100 text-blue-800",
	pleno: "bg-green-100 text-green-800",
	avancado: "bg-indigo-100 text-indigo-800",
	profissional: "bg-yellow-100 text-yellow-800",
	elite: "bg-pink-100 text-pink-800",
	lenda: "bg-purple-100 text-purple-800",
};

export function ResultadoAnualV2({ resultado, dados }: ResultadoAnualProps) {
	const { lucroLiquido, roi } = resultado;

	let statusNegocio = "";
	let alertVariant: "default" | "destructive" = "default";

	if (lucroLiquido > 0) {
		if (roi > 100) {
			statusNegocio = "🎉 Excelente! Seu negócio está muito lucrativo!";
		} else if (roi > 30) {
			statusNegocio = "✅ Bom! Operação rentável e sustentável.";
		} else {
			statusNegocio =
				"⚠️ Atenção! Lucro baixo. Considere otimizar custos ou aumentar vendas.";
			alertVariant = "destructive";
		}
	} else {
		statusNegocio = "🚨 Prejuízo! Revise urgentemente sua operação.";
		alertVariant = "destructive";
	}

	const recomendacoes = gerarRecomendacoes(
		resultado.taxaConversao,
		resultado.margemPorFoto,
		resultado.roi,
		resultado.percentualVidaRestante,
		resultado.nivel,
		dados.receitaLiquida,
	);

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-500">
			<Alert variant={alertVariant}>
				<AlertDescription className="font-semibold">
					{statusNegocio}
				</AlertDescription>
			</Alert>

			<Card>
				<CardHeader>
					<CardTitle className="text-sm text-muted-foreground uppercase">
						Resultado Final do Período
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className={`text-3xl font-bold ${lucroLiquido >= 0 ? "text-green-600" : "text-red-600"}`}
					>
						{lucroLiquido >= 0 ? "+" : ""}R$ {formatMoeda(lucroLiquido)}
					</div>
					<p className="text-sm text-muted-foreground mt-1">
						Lucro/Prejuízo Líquido
					</p>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-sm text-muted-foreground mb-1">
							Receita Líquida Total
						</div>
						<div className="text-xl font-semibold text-green-600">
							R$ {formatMoeda(dados.receitaLiquida)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="text-sm text-muted-foreground mb-1">
							Custo Total
						</div>
						<div className="text-xl font-semibold text-red-600">
							R$ {formatMoeda(resultado.custoTotal)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="text-sm text-muted-foreground mb-1">
							ROI do Período
						</div>
						<div
							className={`text-xl font-semibold ${roi >= 0 ? "text-green-600" : "text-red-600"}`}
						>
							{formatPorcentagem(roi, 1)}%
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="text-sm text-muted-foreground mb-1">
							Média Mensal
						</div>
						<div className="text-xl font-semibold">
							R$ {formatMoeda(resultado.mediaMensal)}
						</div>
						<Badge className={`mt-2 ${nivelStyles[resultado.nivel.classe]}`}>
							{resultado.nivel.nome}
						</Badge>
					</CardContent>
				</Card>
			</div>

			{/* Depreciação Detalhada */}
			<Card>
				<CardHeader>
					<CardTitle>📷 Depreciação Inteligente de Equipamentos</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<Card className="bg-blue-50 border-blue-200">
							<CardContent className="pt-6">
								<div className="flex items-center gap-2 mb-2">
									<Camera className="h-5 w-5 text-blue-600" />
									<p className="text-sm font-medium text-blue-900">Câmeras</p>
								</div>
								<div className="text-2xl font-bold text-blue-600">
									R$ {formatMoeda(resultado.depreciacaoDetalhada.cameras)}
								</div>
							</CardContent>
						</Card>

						<Card className="bg-green-50 border-green-200">
							<CardContent className="pt-6">
								<div className="flex items-center gap-2 mb-2">
									<Aperture className="h-5 w-5 text-green-600" />
									<p className="text-sm font-medium text-green-900">Lentes</p>
								</div>
								<div className="text-2xl font-bold text-green-600">
									R$ {formatMoeda(resultado.depreciacaoDetalhada.lentes)}
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gray-50 border-gray-200">
							<CardContent className="pt-6">
								<div className="flex items-center gap-2 mb-2">
									<Box className="h-5 w-5 text-gray-600" />
									<p className="text-sm font-medium text-gray-900">Outros</p>
								</div>
								<div className="text-2xl font-bold text-gray-600">
									R$ {formatMoeda(resultado.depreciacaoDetalhada.outros)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Lista Detalhada */}
					<div className="space-y-2">
						<p className="text-sm font-medium text-muted-foreground mb-3">
							Detalhamento por Item:
						</p>
						{resultado.depreciacaoDetalhada.itens.map((item, index) => (
							<div
								key={index}
								className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
							>
								<div className="flex items-center gap-2">
									{item.tipo === "camera" && (
										<Camera className="h-4 w-4 text-blue-600" />
									)}
									{item.tipo === "lente" && (
										<Aperture className="h-4 w-4 text-green-600" />
									)}
									{item.tipo === "outro" && (
										<Box className="h-4 w-4 text-gray-600" />
									)}
									<div>
										<span className="font-medium block">{item.nome}</span>
										<div className="text-xs text-muted-foreground">
											{item.criterio}
										</div>
									</div>
								</div>
								<span className="text-sm font-semibold">
									R$ {formatMoeda(item.valor)}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Métricas de Performance */}
			<Card>
				<CardHeader>
					<CardTitle>📊 Métricas de Performance</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Taxa de Conversão
							</div>
							<div className="text-xl font-semibold">
								{formatPorcentagem(resultado.taxaConversao)}%
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Preço Médio/Foto
							</div>
							<div className="text-xl font-semibold">
								R$ {formatMoeda(resultado.precoMedioPorFoto)}
							</div>
							<p className="text-xs text-muted-foreground">
								Receita líquida por venda
							</p>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Custo Real/Foto
							</div>
							<div className="text-xl font-semibold">
								R$ {formatMoeda(resultado.custoRealPorFoto)}
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Margem/Foto Vendida
							</div>
							<div
								className={`text-xl font-semibold ${resultado.margemPorFoto >= 0 ? "text-green-600" : "text-red-600"}`}
							>
								R$ {formatMoeda(resultado.margemPorFoto)}
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Receita/Evento
							</div>
							<div className="text-xl font-semibold">
								R$ {formatMoeda(resultado.receitaPorEvento)}
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Vendas/Evento
							</div>
							<div className="text-xl font-semibold">
								{formatPorcentagem(resultado.vendasPorEvento, 1)} fotos
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Custos Detalhados */}
			<Card>
				<CardHeader>
					<CardTitle>🔧 Custos Detalhados</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Depreciação Total
							</div>

							<div className="text-xl font-semibold">
								R$ {formatMoeda(resultado.depreciacaoTotal)}
							</div>

							<p className="text-xs text-muted-foreground">
								Modelo híbrido (tempo + valor de mercado + uso)
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								Considera valor de revenda médio estimado (30%)
							</p>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Custos Operacionais
							</div>
							<div className="text-xl font-semibold">
								R$ {formatMoeda(resultado.custoOperacional)}
							</div>
							<p className="text-xs text-muted-foreground">
								{formatNumero(dados.eventos)} eventos × R${" "}
								{formatMoeda(dados.custoEvento)}
							</p>
						</div>

						{!dados.usarDepreciacaoPorTempo &&
							resultado.percentualVidaRestante > 0 && (
								<div>
									<div className="text-sm text-muted-foreground mb-1">
										Saúde do Equipamento
									</div>
									<div className="text-xl font-semibold">
										{formatPorcentagem(resultado.percentualVidaRestante, 1)}%
									</div>
									<p className="text-xs text-muted-foreground">
										Indicador de risco operacional (não impede uso)
									</p>
									<Progress
										value={resultado.percentualVidaRestante}
										className="mt-2"
									/>
								</div>
							)}
					</div>
				</CardContent>
			</Card>

			{/* Recomendações */}
			<Card>
				<CardHeader>
					<CardTitle>💡 Recomendações</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{recomendacoes.map((rec, index) => (
						<Alert key={index}>
							<AlertDescription>{rec}</AlertDescription>
						</Alert>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
