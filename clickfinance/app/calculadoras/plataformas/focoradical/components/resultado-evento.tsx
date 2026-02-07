"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	type ResultadoEvento as TipoResultadoEvento,
	type DadosEvento,
	formatMoeda,
	formatPorcentagem,
	formatNumero,
	gerarAnaliseEvento,
} from "@/lib/calculator-utils-evento";
import { Camera, Aperture, Box } from "lucide-react";

interface ResultadoEventoProps {
	resultado: TipoResultadoEvento;
	dados: DadosEvento;
}

export function ResultadoEvento({ resultado, dados }: ResultadoEventoProps) {
	const { lucroLiquido, roi } = resultado;
	const isLucro = lucroLiquido >= 0;

	const analises = gerarAnaliseEvento(
		resultado.taxaConversao,
		resultado.margemPorFoto,
		resultado.roi,
		dados.porcentagemComissao,
	);

	return (
		<div className="space-y-6 animate-in fade-in-50 duration-500">
			{/* Cabeçalho */}
			<Card className="bg-primary/5 border-primary/20">
				<CardHeader className="pb-2">
					<div className="flex justify-between items-start">
						<div>
							<CardTitle>{dados.nome}</CardTitle>
							<p className="text-sm text-muted-foreground mt-1">
								{dados.tipo === "proprio" ? "Evento Próprio" : "Plataforma"} •
								Sua Comissão:{" "}
								<span className="font-semibold text-primary">
									{dados.porcentagemComissao}%
								</span>
							</p>
						</div>
						<div className="text-right">
							<p className="text-sm text-muted-foreground">Vendas</p>
							<p className="text-xl font-bold">
								{formatNumero(dados.fotosVendidas)} fotos
							</p>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Resultado Principal */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card
					className={
						isLucro
							? "bg-green-50 border-green-200"
							: "bg-red-50 border-red-200"
					}
				>
					<CardContent className="pt-6 text-center">
						<p className="text-sm font-medium uppercase tracking-wide opacity-70">
							Lucro Real (No Bolso)
						</p>
						<div
							className={`text-3xl font-bold mt-2 ${isLucro ? "text-green-700" : "text-red-700"}`}
						>
							{isLucro ? "+" : ""}R$ {formatMoeda(lucroLiquido)}
						</div>
						<p className="text-xs mt-2 opacity-80">Após custos e depreciação</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6 text-center">
						<p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
							ROI do Evento
						</p>
						<div
							className={`text-3xl font-bold mt-2 ${roi >= 0 ? "text-blue-600" : "text-red-600"}`}
						>
							{formatPorcentagem(roi, 1)}%
						</div>
						<p className="text-xs mt-2 text-muted-foreground">
							Retorno sobre investimento
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Detalhamento Financeiro */}
			<Card>
				<CardHeader>
					<CardTitle>💰 Fluxo de Caixa</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex justify-between items-center text-sm text-muted-foreground">
							<span>Faturamento Bruto (Estimado)</span>
							<span>R$ {formatMoeda(resultado.faturamentoBruto)}</span>
						</div>

						<div className="flex justify-between items-center text-sm text-red-400">
							<span>
								Taxas da Plataforma (
								{(100 - dados.porcentagemComissao).toFixed(0)}%)
							</span>
							<span>- R$ {formatMoeda(resultado.taxaPlataformaValor)}</span>
						</div>

						<div className="flex justify-between items-center py-2 border-t border-b bg-secondary/10 px-2 rounded font-semibold">
							<span>Receita Líquida (Dashboard)</span>
							<span className="text-primary">
								R$ {formatMoeda(resultado.receitaLiquida)}
							</span>
						</div>

						<div className="flex justify-between items-center text-sm">
							<span>Custos Operacionais</span>
							<span className="text-red-600">
								- R$ {formatMoeda(dados.custosOperacionais)}
							</span>
						</div>

						<div className="flex justify-between items-center text-sm">
							<span>Depreciação Equipamento</span>
							<span className="text-red-600">
								- R$ {formatMoeda(resultado.depreciacaoTotal)}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Depreciação (Igual ao Anual para consistência) */}
			<Card>
				<CardHeader>
					<CardTitle>📷 Custo do Equipamento (Depreciação)</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-2 mb-4">
						<div className="bg-blue-50 p-3 rounded border border-blue-100 text-center">
							<Camera className="h-4 w-4 text-blue-600 mx-auto mb-1" />
							<div className="text-xs text-blue-900">Câmeras</div>
							<div className="font-bold text-blue-700 text-sm">
								R$ {formatMoeda(resultado.depreciacaoDetalhada.cameras)}
							</div>
						</div>
						<div className="bg-green-50 p-3 rounded border border-green-100 text-center">
							<Aperture className="h-4 w-4 text-green-600 mx-auto mb-1" />
							<div className="text-xs text-green-900">Lentes</div>
							<div className="font-bold text-green-700 text-sm">
								R$ {formatMoeda(resultado.depreciacaoDetalhada.lentes)}
							</div>
						</div>
						<div className="bg-gray-50 p-3 rounded border border-gray-100 text-center">
							<Box className="h-4 w-4 text-gray-600 mx-auto mb-1" />
							<div className="text-xs text-gray-900">Outros</div>
							<div className="font-bold text-gray-700 text-sm">
								R$ {formatMoeda(resultado.depreciacaoDetalhada.outros)}
							</div>
						</div>
					</div>

					{/* Lista Detalhada */}
					<div className="space-y-2">
						<p className="text-sm font-medium text-muted-foreground mb-2">
							Detalhamento por Item:
						</p>
						{resultado.depreciacaoDetalhada.itens.map((item, index) => (
							<div
								key={index}
								className="flex justify-between items-center p-2 bg-muted/30 rounded border border-muted"
							>
								<div className="flex items-center gap-2">
									{item.tipo === "camera" && (
										<Camera className="h-3 w-3 text-blue-600" />
									)}
									{item.tipo === "lente" && (
										<Aperture className="h-3 w-3 text-green-600" />
									)}
									{item.tipo === "outro" && (
										<Box className="h-3 w-3 text-gray-600" />
									)}
									<div>
										<span className="font-medium text-sm block leading-none">
											{item.nome}
										</span>
										<span className="text-[10px] text-muted-foreground">
											{item.criterio}
										</span>
									</div>
								</div>
								<span className="text-xs font-semibold">
									R$ {formatMoeda(item.valor)}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* KPIs */}
			<Card>
				<CardHeader>
					<CardTitle>📊 Métricas Unitárias</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<div className="text-xs text-muted-foreground">
								Preço Médio Venda
							</div>
							<div className="font-semibold">
								R$ {formatMoeda(resultado.precoVendaMedio)}
							</div>
						</div>
						<div>
							<div className="text-xs text-muted-foreground">
								Sua Parte / Foto
							</div>
							<div className="font-semibold text-green-600">
								R$ {formatMoeda(resultado.receitaPorFoto)}
							</div>
						</div>
						<div>
							<div className="text-xs text-muted-foreground">Custo / Foto</div>
							<div className="font-semibold text-red-600">
								R$ {formatMoeda(resultado.custoRealPorFoto)}
							</div>
						</div>
						<div>
							<div className="text-xs text-muted-foreground">Margem Real</div>
							<div
								className={`font-semibold ${resultado.margemPorFoto > 0 ? "text-green-600" : "text-red-600"}`}
							>
								R$ {formatMoeda(resultado.margemPorFoto)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Recomendações */}
			{analises.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>💡 Análise</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{analises.map((txt, i) => (
							<Alert key={i} className="py-2">
								<AlertDescription>{txt}</AlertDescription>
							</Alert>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
