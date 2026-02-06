"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	type ResultadoEvento as TipoResultadoEventoV2,
	type DadosEvento as DadosEventoV2,
	formatMoeda,
	formatNumero,
	formatPorcentagem,
	gerarAnaliseEvento,
} from "@/lib/calculator-utils-evento";

interface ResultadoEventoProps {
	resultado: TipoResultadoEventoV2;
	dados: DadosEventoV2;
}

export function ResultadoEvento({ resultado, dados }: ResultadoEventoProps) {
	const { lucroLiquido } = resultado;

	const statusEvento =
		lucroLiquido > 0 ? "✅ Evento lucrativo!" : "⚠️ Evento com prejuízo!";
	const alertVariant: "default" | "destructive" =
		lucroLiquido > 0 ? "default" : "destructive";

	const analises = gerarAnaliseEvento(
		resultado.taxaConversao,
		resultado.margemPorFoto,
		resultado.roi,
		dados.taxaPlataforma,
	);

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-500">
			<Card>
				<CardHeader>
					<CardTitle>{dados.nome}</CardTitle>
					<p className="text-sm text-muted-foreground">
						Tipo:{" "}
						{dados.tipo === "proprio"
							? "Evento Próprio"
							: "Evento da Plataforma"}{" "}
						| Taxa: {formatPorcentagem(dados.taxaPlataforma, 0)}%
					</p>
				</CardHeader>
			</Card>

			<Alert variant={alertVariant}>
				<AlertDescription className="font-semibold">
					{statusEvento}
				</AlertDescription>
			</Alert>

			<Card>
				<CardHeader>
					<CardTitle className="text-sm text-muted-foreground uppercase">
						Resultado do Evento
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className={`text-3xl font-bold ${lucroLiquido >= 0 ? "text-green-600" : "text-red-600"}`}
					>
						{lucroLiquido >= 0 ? "+" : ""}R$ {formatMoeda(lucroLiquido)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>💰 Breakdown Financeiro</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Faturamento Bruto
							</div>
							<div className="text-xl font-semibold">
								R$ {formatMoeda(resultado.faturamentoBruto)}
							</div>
							<p className="text-xs text-muted-foreground">
								{formatNumero(dados.fotosVendidas)} fotos × R${" "}
								{formatMoeda(dados.precoFoto)}
							</p>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Taxa Plataforma ({formatPorcentagem(dados.taxaPlataforma, 0)}%)
							</div>
							<div className="text-xl font-semibold text-red-600">
								-R$ {formatMoeda(resultado.taxaValor)}
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Receita Líquida
							</div>
							<div className="text-xl font-semibold text-green-600">
								R$ {formatMoeda(resultado.receitaLiquida)}
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Custo Total
							</div>
							<div className="text-xl font-semibold text-red-600">
								-R$ {formatMoeda(resultado.custoTotal)}
							</div>
							<p className="text-xs text-muted-foreground">
								{dados.usarDepreciacaoPorTempo
									? "Depreciação (Tempo) + Operacional"
									: "Depreciação (Cliques) + Operacional"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>📊 Métricas do Evento</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Taxa de Conversão
							</div>
							<div className="text-xl font-semibold">
								{formatPorcentagem(resultado.taxaConversao)}%
							</div>
							<p className="text-xs text-muted-foreground">
								{formatNumero(dados.fotosVendidas)} de{" "}
								{formatNumero(dados.fotosFeitas)} fotos
							</p>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Receita/Foto Vendida
							</div>
							<div className="text-xl font-semibold">
								R$ {formatMoeda(resultado.receitaPorFoto)}
							</div>
							<p className="text-xs text-muted-foreground">Líquido após taxa</p>
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
								Margem/Foto
							</div>
							<div
								className={`text-xl font-semibold ${resultado.margemPorFoto >= 0 ? "text-green-600" : "text-red-600"}`}
							>
								R$ {formatMoeda(resultado.margemPorFoto)}
							</div>
						</div>

						<div>
							<div className="text-sm text-muted-foreground mb-1">ROI</div>
							<div
								className={`text-xl font-semibold ${resultado.roi >= 0 ? "text-green-600" : "text-red-600"}`}
							>
								{formatPorcentagem(resultado.roi, 1)}%
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
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Depreciação Equipamento
							</div>
							<div className="text-xl font-semibold">
								R$ {formatMoeda(resultado.depreciacaoTotal)}
							</div>
							<p className="text-xs text-muted-foreground">
								{dados.usarDepreciacaoPorTempo
									? `${dados.diasEvento || 1} dia(s) de uso`
									: "Baseado em cliques do obturador"}
							</p>
						</div>
						<div>
							<div className="text-sm text-muted-foreground mb-1">
								Custos Operacionais
							</div>
							<div className="text-xl font-semibold">
								R$ {formatMoeda(dados.custos)}
							</div>
							<p className="text-xs text-muted-foreground">
								Logística, alimentação, etc.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{analises.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>💡 Análise do Evento</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{analises.map((analise, index) => (
							<Alert key={index}>
								<AlertDescription>{analise}</AlertDescription>
							</Alert>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
