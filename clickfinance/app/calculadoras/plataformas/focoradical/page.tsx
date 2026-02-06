"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormAnualV2 } from "@/app/calculadoras/plataformas/focoradical/components/form-anual-v2";
import { ResultadoAnualV2 } from "@/app/calculadoras/plataformas/focoradical/components/resultado-anual-v2";
import { FormEvento } from "@/app/calculadoras/plataformas/focoradical/components/form-evento";
import { ResultadoEvento } from "@/app/calculadoras/plataformas/focoradical/components//resultado-evento";
import {
	calcularAnual,
	type DadosAnuais as DadosAnuaisV2,
	type ResultadoAnual as TipoResultadoAnualV2,
} from "@/lib/calculator-utils-anual";
import {
	calcularEvento as calcularEventoV2,
	type DadosEvento as DadosEventoV2,
	type ResultadoEvento as TipoResultadoEventoV2,
} from "@/lib/calculator-utils-evento";

export default function CalculadoraPage() {
	const [resultadoAnual, setResultadoAnual] =
		useState<TipoResultadoAnualV2 | null>(null);
	const [dadosAnual, setDadosAnual] = useState<DadosAnuaisV2 | null>(null);
	const [resultadoEvento, setResultadoEvento] =
		useState<TipoResultadoEventoV2 | null>(null);
	const [dadosEvento, setDadosEvento] = useState<DadosEventoV2 | null>(null);

	const resultadoAnualRef = useRef<HTMLDivElement>(null);
	const resultadoEventoRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (resultadoAnual) {
			resultadoAnualRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [resultadoAnual]);

	useEffect(() => {
		if (resultadoEvento) {
			resultadoEventoRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [resultadoEvento]);

	const handleCalcularAnual = (dados: DadosAnuaisV2) => {
		const resultado = calcularAnual(dados);
		setResultadoAnual(resultado);
		setDadosAnual(dados);
	};

	const handleCalcularEvento = (dados: DadosEventoV2) => {
		const resultado = calcularEventoV2(dados);
		setResultadoEvento(resultado);
		setDadosEvento(dados);
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-[#8d6e63] via-[#ac968e] to-[#f0cdc1]">
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
							<div className="bg-white/90 backdrop-blur rounded-lg shadow-2xl p-6">
								<FormAnualV2 onCalculate={handleCalcularAnual} />
							</div>

							{resultadoAnual && dadosAnual && (
								<div
									ref={resultadoAnualRef}
									className="bg-white/90 backdrop-blur rounded-lg shadow-2xl p-6 scroll-mt-24"
								>
									<ResultadoAnualV2
										resultado={resultadoAnual}
										dados={dadosAnual}
									/>
								</div>
							)}
						</TabsContent>

						{/* Tab Análise por Evento */}
						<TabsContent value="evento" className="space-y-6">
							<div className="bg-white/90 backdrop-blur rounded-lg shadow-2xl p-6">
								<FormEvento onCalculate={handleCalcularEvento} />
							</div>

							{resultadoEvento && dadosEvento && (
								<div
									ref={resultadoEventoRef}
									className="bg-white/90 backdrop-blur rounded-lg shadow-2xl p-6 scroll-mt-24"
								>
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
