"use client";

import { useState, useRef, useEffect } from "react";
import { FormPrecificacao } from "./components/form-precificacao";
import { ResultadoPrecificacao } from "./components/resultado-precificacao";
import {
	calcularPrecificacao,
	type DadosPrecificacao,
	type ResultadoPrecificacao as TipoResultadoPrecificacao,
} from "@/lib/pricing-utils";

export default function PrecificacaoPage() {
	const [resultado, setResultado] = useState<TipoResultadoPrecificacao | null>(
		null,
	);

	const resultadoRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (resultado) {
			resultadoRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [resultado]);

	const handleCalcular = (dados: DadosPrecificacao) => {
		const calc = calcularPrecificacao(dados);
		setResultado(calc);
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-[#8d6e63] via-[#ac968e] to-[#f0cdc1]">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="text-center text-white mb-8">
						<h1 className="text-4xl font-bold mb-2">
							💰 Calculadora de Precificação
						</h1>
						<p className="text-lg opacity-90">
							Descubra o preço ideal para suas fotos em plataformas como
							Focoradical
						</p>
					</div>

					{/* Formulário */}
					<div className="bg-white/90 backdrop-blur rounded-lg shadow-2xl p-6 mb-6">
						<FormPrecificacao onCalculate={handleCalcular} />
					</div>

					{/* Resultados */}
					{resultado && (
						<div
							ref={resultadoRef}
							className="bg-white/90 backdrop-blur rounded-lg shadow-2xl p-6 scroll-mt-24"
						>
							<ResultadoPrecificacao resultado={resultado} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
