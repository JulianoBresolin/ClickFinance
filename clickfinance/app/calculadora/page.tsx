"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormAnual } from "@/components/calculator/form-anual";
import { FormEvento } from "@/components/calculator/form-evento";
import { ResultadoAnual } from "@/components/calculator/resultado-anual";
import { ResultadoEvento } from "@/components/calculator/resultado-evento";
import {
	calcularAnual,
	calcularEvento,
	DadosAnuais,
	DadosEvento,
	ResultadoAnual as TipoResultadoAnual,
	ResultadoEvento as TipoResultadoEvento,
} from "@/lib/calculator-utils";

export default function CalculadoraPage() {
	const [resultadoAnual, setResultadoAnual] =
		useState<TipoResultadoAnual | null>(null);
	const [dadosAnual, setDadosAnual] = useState<DadosAnuais | null>(null);
	const [resultadoEvento, setResultadoEvento] =
		useState<TipoResultadoEvento | null>(null);
	const [dadosEvento, setDadosEvento] = useState<DadosEvento | null>(null);

	const handleCalcularAnual = (dados: DadosAnuais) => {
		const resultado = calcularAnual(dados);
		setResultadoAnual(resultado);
		setDadosAnual(dados);
	};

	const handleCalcularEvento = (dados: DadosEvento) => {
		const resultado = calcularEvento(dados);
		setResultadoEvento(resultado);
		setDadosEvento(dados);
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-500">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="text-center text-white mb-8">
						<h1 className="text-4xl font-bold mb-2">
							📸 Calculadora Financeira
						</h1>
						<p className="text-lg opacity-90">
							Análise completa para fotógrafos de plataforma (Focoradical,
							Fotto, Balenk)
						</p>
					</div>

					{/* Tabs */}
					<Tabs defaultValue="anual" className="space-y-6">
						<TabsList className="grid w-full grid-cols-2 bg-white/90 backdrop-blur">
							<TabsTrigger value="anual" className="text-base">
								📊 Análise Anual
							</TabsTrigger>
							<TabsTrigger value="evento" className="text-base">
								🎯 Análise por Evento
							</TabsTrigger>
						</TabsList>

						{/* Tab Análise Anual */}
						<TabsContent value="anual" className="space-y-6">
							<div className="bg-white rounded-lg shadow-2xl p-6">
								<FormAnual onCalculate={handleCalcularAnual} />
							</div>

							{resultadoAnual && dadosAnual && (
								<div className="bg-white rounded-lg shadow-2xl p-6">
									<ResultadoAnual
										resultado={resultadoAnual}
										dados={dadosAnual}
									/>
								</div>
							)}
						</TabsContent>

						{/* Tab Análise por Evento */}
						<TabsContent value="evento" className="space-y-6">
							<div className="bg-white rounded-lg shadow-2xl p-6">
								<FormEvento onCalculate={handleCalcularEvento} />
							</div>

							{resultadoEvento && dadosEvento && (
								<div className="bg-white rounded-lg shadow-2xl p-6">
									<ResultadoEvento
										resultado={resultadoEvento}
										dados={dadosEvento}
									/>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
