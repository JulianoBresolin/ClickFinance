"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	type ResultadoAnual as TipoResultadoAnual,
	type DadosAnuais,
	formatMoeda,
	formatNumero,
	formatPorcentagem,
	gerarRecomendacoes,
} from "@/lib/calculator-utils";

interface ResultadoAnualProps {
	resultado: TipoResultadoAnual;
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

export function ResultadoAnual({ resultado, dados }: ResultadoAnualProps) {
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

			<Card>
				<CardHeader>
					<CardTitle>🔧 Custos Detalhados</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Depreciação Câmera
							</div>
							<div className="text-xl font-semibold">
								R$ {formatMoeda(resultado.depreciacaoTotal)}
							</div>
							<p className="text-xs text-muted-foreground">
								{dados.usarDepreciacaoPorTempo
									? `Baseado em ${dados.anosDurabilidade || 0} anos`
									: `R$ ${formatMoeda(resultado.custoPorClique)} por clique`}
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

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								{dados.usarDepreciacaoPorTempo
									? "Durabilidade Estimada"
									: "Vida Útil Restante"}
							</div>
							<div className="text-xl font-semibold">
								{dados.usarDepreciacaoPorTempo
									? `${dados.anosDurabilidade || 0} Anos`
									: `${formatPorcentagem(resultado.percentualVidaRestante, 1)}%`}
							</div>
							<p className="text-xs text-muted-foreground">
								{dados.usarDepreciacaoPorTempo
									? `${dados.quantidadeEquipamento || 1} equipamento(s)`
									: `${formatNumero(resultado.vidaRestante)} cliques`}
							</p>
							{!dados.usarDepreciacaoPorTempo && (
								<Progress
									value={resultado.percentualVidaRestante}
									className="mt-2"
								/>
							)}
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Fotos/Evento
							</div>
							<div className="text-xl font-semibold">
								{formatNumero(resultado.fotosPorEvento)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

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
