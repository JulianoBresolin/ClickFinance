// Tipos para Precificação
export interface DadosPrecificacao {
	// Custos Fixos (Mensal)
	custosFixosMensais: number; // Softwares, armazenamento, etc.
	eventosPorMes: number; // Média de eventos para diluir o custo

	// Custos do Equipamento
	valorEquipamento: number; // Valor total do seu equipamento (câmera, lentes)
	vidaUtilEquipamentoCliques: number; // Vida útil em cliques do obturador
	tempoDepreciacaoAnos: number; // Tempo de depreciação em anos

	// Custos do Evento
	custoOperacional: number; // Custo operacional por evento (transporte, etc)
	fotosEstimadasEvento: number; // Quantas fotos você espera tirar
	// Taxas da Plataforma
	taxaPlataforma: number; // % da plataforma

	// Metas
	margemLucroDesejada: number; // % de lucro desejado
	vendasEstimadas: number; // Quantas fotos você espera vender
}

export interface ResultadoPrecificacao {
	// Preços Calculados
	custoTotalPorFotoVendida: number;
	precoMinimoSemPrejuizo: number;
	precoSugeridoComMargem: number;
	precoComTaxaPlataforma: number;

	// Análise Financeira
	receitaBrutaEstimada: number;
	taxaPlataformaValor: number;
	receitaLiquidaEstimada: number;
	custoTotalEstimado: number;
	custoDepreciacaoEstimado: number;
	lucroLiquidoEstimado: number;
	margemLucroReal: number;
	roiEstimado: number;

	// Métricas
	taxaConversaoNecessaria: number;
	pontoEquilibrio: number; // Quantas fotos precisa vender para não ter prejuízo

	// Comparação de Cenários
	cenarios: CenarioPrecificacao[];
}

export interface CenarioPrecificacao {
	preco: number;
	receitaBruta: number;
	receitaLiquida: number;
	lucro: number;
	margem: number;
	roi: number;
}

export function calcularPrecificacao(
	dados: DadosPrecificacao,
): ResultadoPrecificacao {
	// Custo Fixo por Evento (rateio dos custos mensais)
	const custoFixoPorEvento =
		dados.eventosPorMes > 0
			? dados.custosFixosMensais / dados.eventosPorMes
			: 0;

	// Depreciação por clique
	const custoPorClique =
		dados.vidaUtilEquipamentoCliques > 0
			? dados.valorEquipamento / dados.vidaUtilEquipamentoCliques
			: 0;
	const depreciacaoCliques = custoPorClique * dados.fotosEstimadasEvento;

	// Depreciação por tempo (Mensal)
	const depreciacaoMensal =
		dados.tempoDepreciacaoAnos > 0
			? dados.valorEquipamento / (dados.tempoDepreciacaoAnos * 12)
			: 0;

	const depreciacaoTempoPorEvento =
		dados.eventosPorMes > 0 ? depreciacaoMensal / dados.eventosPorMes : 0;

	const depreciacaoTotal = depreciacaoCliques + depreciacaoTempoPorEvento;

	// Custo total do evento
	const custoTotalEvento =
		custoFixoPorEvento + depreciacaoTotal + dados.custoOperacional;

	// Custo por foto vendida
	const custoTotalPorFotoVendida =
		dados.vendasEstimadas > 0 ? custoTotalEvento / dados.vendasEstimadas : 0;

	// Preço mínimo (break-even)
	const precoMinimoLiquido = custoTotalPorFotoVendida;
	const precoMinimoSemPrejuizo =
		precoMinimoLiquido / (1 - dados.taxaPlataforma / 100);

	// Preço sugerido com margem
	const precoSugeridoLiquido =
		custoTotalPorFotoVendida * (1 + dados.margemLucroDesejada / 100);
	const precoSugeridoComMargem =
		precoSugeridoLiquido / (1 - dados.taxaPlataforma / 100);

	// Análise financeira com preço sugerido
	const receitaBrutaEstimada = precoSugeridoComMargem * dados.vendasEstimadas;
	const taxaPlataformaValor =
		receitaBrutaEstimada * (dados.taxaPlataforma / 100);
	const receitaLiquidaEstimada = receitaBrutaEstimada - taxaPlataformaValor;
	const lucroLiquidoEstimado = receitaLiquidaEstimada - custoTotalEvento;
	const margemLucroReal =
		custoTotalEvento > 0 ? (lucroLiquidoEstimado / custoTotalEvento) * 100 : 0;
	const roiEstimado =
		custoTotalEvento > 0 ? (lucroLiquidoEstimado / custoTotalEvento) * 100 : 0;

	// Taxa de conversão necessária
	const taxaConversaoNecessaria =
		dados.fotosEstimadasEvento > 0
			? (dados.vendasEstimadas / dados.fotosEstimadasEvento) * 100
			: 0;

	// Ponto de equilíbrio
	const pontoEquilibrio =
		precoSugeridoLiquido > 0 ? custoTotalEvento / precoSugeridoLiquido : 0;

	// Gerar cenários de precificação
	const precoBase = precoSugeridoComMargem;
	const cenarios: CenarioPrecificacao[] = [];

	for (let multiplicador = 0.7; multiplicador <= 1.5; multiplicador += 0.1) {
		const preco = precoBase * multiplicador;
		const receitaBruta = preco * dados.vendasEstimadas;
		const taxaValor = receitaBruta * (dados.taxaPlataforma / 100);
		const receitaLiquida = receitaBruta - taxaValor;
		const lucro = receitaLiquida - custoTotalEvento;
		const margem = custoTotalEvento > 0 ? (lucro / custoTotalEvento) * 100 : 0;
		const roi = custoTotalEvento > 0 ? (lucro / custoTotalEvento) * 100 : 0;

		cenarios.push({
			preco: Number(preco.toFixed(2)),
			receitaBruta: Number(receitaBruta.toFixed(2)),
			receitaLiquida: Number(receitaLiquida.toFixed(2)),
			lucro: Number(lucro.toFixed(2)),
			margem: Number(margem.toFixed(1)),
			roi: Number(roi.toFixed(1)),
		});
	}

	return {
		custoTotalPorFotoVendida,
		precoMinimoSemPrejuizo,
		precoSugeridoComMargem,
		precoComTaxaPlataforma: precoSugeridoComMargem,
		receitaBrutaEstimada,
		taxaPlataformaValor,
		receitaLiquidaEstimada,
		custoTotalEstimado: custoTotalEvento,
		custoDepreciacaoEstimado: depreciacaoTotal,
		lucroLiquidoEstimado,
		margemLucroReal,
		roiEstimado,
		taxaConversaoNecessaria,
		pontoEquilibrio,
		cenarios,
	};
}

export function gerarInsightsPrecificacao(
	resultado: ResultadoPrecificacao,
): string[] {
	const insights: string[] = [];

	// Análise de preço
	if (resultado.precoSugeridoComMargem < 8) {
		insights.push(
			"💡 Preço sugerido muito baixo. Considere aumentar para valorizar seu trabalho.",
		);
	} else if (resultado.precoSugeridoComMargem > 20) {
		insights.push(
			"⚠️ Preço alto. Certifique-se de que seu público-alvo pode pagar este valor.",
		);
	}

	// Análise de margem
	if (resultado.margemLucroReal < 20) {
		insights.push(
			"📊 Margem de lucro baixa (<20%). Considere reduzir custos ou aumentar preços.",
		);
	} else if (resultado.margemLucroReal > 50) {
		insights.push(
			"🎉 Excelente margem de lucro! Seu negócio está muito bem posicionado.",
		);
	}

	// Análise de conversão
	if (resultado.taxaConversaoNecessaria < 0.5) {
		insights.push(
			"✅ Taxa de conversão necessária muito baixa. Meta facilmente atingível!",
		);
	} else if (resultado.taxaConversaoNecessaria > 2) {
		insights.push(
			"⚠️ Taxa de conversão alta (>2%). Pode ser difícil atingir essa meta. Considere aumentar o preço ou reduzir custos.",
		);
	}

	// Análise de ponto de equilíbrio
	const percentualEquilibrio =
		(resultado.pontoEquilibrio / resultado.taxaConversaoNecessaria) * 100;
	if (percentualEquilibrio > 80) {
		insights.push(
			"🚨 Ponto de equilíbrio muito alto. Pouca margem para erros ou imprevistos.",
		);
	}

	// Análise de ROI
	if (resultado.roiEstimado < 30) {
		insights.push(
			"💰 ROI baixo (<30%). Analise se vale a pena o investimento neste evento.",
		);
	} else if (resultado.roiEstimado > 100) {
		insights.push(
			"🚀 ROI excepcional! Este evento tem grande potencial de lucro.",
		);
	}

	if (insights.length === 0) {
		insights.push("✅ Precificação equilibrada e saudável para seu negócio!");
	}

	return insights;
}
