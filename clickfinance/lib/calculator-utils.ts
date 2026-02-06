// Funções de formatação
export function formatMoeda(valor: number): string {
	return valor.toLocaleString("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export function formatNumero(valor: number): string {
	return Math.round(valor).toLocaleString("pt-BR");
}

export function formatPorcentagem(
	valor: number,
	casasDecimais: number = 2,
): string {
	return valor.toLocaleString("pt-BR", {
		minimumFractionDigits: casasDecimais,
		maximumFractionDigits: casasDecimais,
	});
}

export function parseCurrency(value: string): number {
	if (!value) return 0;
	return Number(value.replace(/\./g, "").replace(",", "."));
}

// Tipos
export interface DadosAnuais {
	valorCamera: number;
	vidaTotal: number;
	cliquesAtuais: number;
	cliquesAtuaisMecanicos?: number;
	fotosTotais: number;
	fotosTotaisMecanicas?: number;
	fotosVendidas: number;
	eventos: number;
	receitaLiquida: number;
	custoEvento: number;
	usarDepreciacaoPorTempo?: boolean;
	anosDurabilidade?: number;
	quantidadeEquipamento?: number;
}

export interface ResultadoAnual {
	custoPorClique: number;
	depreciacaoTotal: number;
	vidaRestante: number;
	percentualVidaRestante: number;
	custoOperacional: number;
	custoTotal: number;
	lucroLiquido: number;
	roi: number;
	precoMedioPorFoto: number;
	custoRealPorFoto: number;
	margemPorFoto: number;
	taxaConversao: number;
	receitaPorEvento: number;
	fotosPorEvento: number;
	vendasPorEvento: number;
	mediaMensal: number;
	nivel: Nivel;
}

export interface DadosEvento {
	nome: string;
	tipo: "proprio" | "plataforma";
	taxaPlataforma: number;
	fotosFeitas: number;
	fotosVendidas: number;
	precoFoto: number;
	depreciacao: number;
	custos: number;
	usarDepreciacaoPorTempo?: boolean;
	anosDurabilidade?: number;
	diasEvento?: number;
	quantidadeEquipamento?: number;
}

export interface ResultadoEvento {
	faturamentoBruto: number;
	taxaValor: number;
	receitaLiquida: number;
	custoTotal: number;
	lucroLiquido: number;
	taxaConversao: number;
	custoRealPorFoto: number;
	receitaPorFoto: number;
	margemPorFoto: number;
	roi: number;
}

export interface Nivel {
	nome: string;
	classe: string;
	proximo: number | null;
}

// Cálculos
export function calcularAnual(dados: DadosAnuais): ResultadoAnual {
	// A depreciacao é baseada apenas nos cliques mecânicos
	let custoPorClique = 0;
	let depreciacaoTotal = 0;
	let vidaRestante = 0;
	let percentualVidaRestante = 0;

	if (
		dados.usarDepreciacaoPorTempo &&
		dados.anosDurabilidade &&
		dados.anosDurabilidade > 0
	) {
		const quantidade = dados.quantidadeEquipamento || 1;
		// Depreciação Anual = (Valor * Qtd) / Anos
		depreciacaoTotal =
			(dados.valorCamera * quantidade) / dados.anosDurabilidade;

		// Mantemos métricas de clique se disponíveis para referência
		if (dados.vidaTotal > 0) {
			custoPorClique = dados.valorCamera / dados.vidaTotal;
			if (dados.cliquesAtuaisMecanicos !== undefined) {
				vidaRestante = dados.vidaTotal - dados.cliquesAtuaisMecanicos;
				percentualVidaRestante = (vidaRestante / dados.vidaTotal) * 100;
			}
		}
	} else {
		custoPorClique =
			dados.vidaTotal > 0 ? dados.valorCamera / dados.vidaTotal : 0;
		const fotosMecanicas = dados.fotosTotaisMecanicas || 0;
		depreciacaoTotal = fotosMecanicas * custoPorClique;
		const cliquesAtuaisMec = dados.cliquesAtuaisMecanicos || 0;
		vidaRestante = dados.vidaTotal - cliquesAtuaisMec;
		percentualVidaRestante =
			dados.vidaTotal > 0 ? (vidaRestante / dados.vidaTotal) * 100 : 0;
	}

	const custoOperacional = dados.eventos * dados.custoEvento;
	const custoTotal = depreciacaoTotal + custoOperacional;

	const lucroLiquido = dados.receitaLiquida - custoTotal;
	const roi = (lucroLiquido / custoTotal) * 100;

	const precoMedioPorFoto = dados.receitaLiquida / dados.fotosVendidas;
	const custoRealPorFoto = custoTotal / dados.fotosVendidas;
	const margemPorFoto = precoMedioPorFoto - custoRealPorFoto;
	const taxaConversao = (dados.fotosVendidas / dados.fotosTotais) * 100;
	const receitaPorEvento = dados.receitaLiquida / dados.eventos;
	const fotosPorEvento = dados.fotosTotais / dados.eventos;
	const vendasPorEvento = dados.fotosVendidas / dados.eventos;

	const mediaMensal = dados.receitaLiquida / 12;
	const nivel = determinarNivel(mediaMensal);

	return {
		custoPorClique,
		depreciacaoTotal,
		vidaRestante,
		percentualVidaRestante,
		custoOperacional,
		custoTotal,
		lucroLiquido,
		roi,
		precoMedioPorFoto,
		custoRealPorFoto,
		margemPorFoto,
		taxaConversao,
		receitaPorEvento,
		fotosPorEvento,
		vendasPorEvento,
		mediaMensal,
		nivel,
	};
}

export function calcularEvento(dados: DadosEvento): ResultadoEvento {
	const faturamentoBruto = dados.fotosVendidas * dados.precoFoto;
	const taxaValor = faturamentoBruto * (dados.taxaPlataforma / 100);
	const receitaLiquida = faturamentoBruto - taxaValor;

	const custoTotal = dados.depreciacao + dados.custos;
	const lucroLiquido = receitaLiquida - custoTotal;

	const taxaConversao = (dados.fotosVendidas / dados.fotosFeitas) * 100;
	const custoRealPorFoto = custoTotal / dados.fotosVendidas;
	const receitaPorFoto = receitaLiquida / dados.fotosVendidas;
	const margemPorFoto = receitaPorFoto - custoRealPorFoto;
	const roi = (lucroLiquido / custoTotal) * 100;

	return {
		faturamentoBruto,
		taxaValor,
		receitaLiquida,
		custoTotal,
		lucroLiquido,
		taxaConversao,
		custoRealPorFoto,
		receitaPorFoto,
		margemPorFoto,
		roi,
	};
}

export function calcularDepreciacaoMensal(
	valor: number,
	anos: number,
	quantidade: number = 1,
): number {
	if (anos <= 0) return 0;
	return (valor * quantidade) / (anos * 12);
}

export function determinarNivel(mediaMensal: number): Nivel {
	if (mediaMensal < 500) {
		return { nome: "Iniciante", classe: "iniciante", proximo: 500 };
	} else if (mediaMensal < 2000) {
		return { nome: "Pleno", classe: "pleno", proximo: 2000 };
	} else if (mediaMensal < 5000) {
		return { nome: "Avançado", classe: "avancado", proximo: 5000 };
	} else if (mediaMensal < 10000) {
		return { nome: "Profissional", classe: "profissional", proximo: 10000 };
	} else if (mediaMensal < 20000) {
		return { nome: "Elite", classe: "elite", proximo: 20000 };
	} else {
		return { nome: "Lenda", classe: "lenda", proximo: null };
	}
}

export function gerarRecomendacoes(
	taxaConversao: number,
	margemPorFoto: number,
	roi: number,
	vidaRestante: number,
	nivel: Nivel,
	receitaAnual: number,
): string[] {
	const recomendacoes: string[] = [];

	if (taxaConversao < 1) {
		recomendacoes.push(
			"📸 Taxa de conversão baixa (<1%). Melhore o enquadramento, qualidade e entrega das fotos.",
		);
	} else if (taxaConversao > 1.5) {
		recomendacoes.push(
			"✅ Excelente taxa de conversão! Você está capturando os momentos certos.",
		);
	}

	if (margemPorFoto < 3) {
		recomendacoes.push(
			"💰 Margem por foto muito baixa. Considere reduzir custos operacionais ou focar em eventos mais lucrativos.",
		);
	} else if (margemPorFoto > 6) {
		recomendacoes.push("✅ Ótima margem por foto! Continue assim.");
	}

	if (roi < 30) {
		recomendacoes.push(
			"📊 ROI abaixo de 30%. Analise seus eventos e priorize os mais rentáveis.",
		);
	} else if (roi > 100) {
		recomendacoes.push(
			"🎉 ROI excepcional! Seu negócio está muito bem otimizado.",
		);
	}

	if (vidaRestante < 20) {
		recomendacoes.push(
			"⚠️ Câmera com menos de 20% de vida útil. Planeje a aquisição de novo equipamento nos próximos meses.",
		);
	} else if (vidaRestante < 50) {
		recomendacoes.push(
			"⚡ Câmera com vida útil média. Comece a pesquisar opções para substituição futura.",
		);
	}

	if (nivel.proximo) {
		const mediaMensal = receitaAnual / 12;
		const faltaMensal = nivel.proximo - mediaMensal;
		recomendacoes.push(
			`🎯 Fature mais R$ ${formatMoeda(faltaMensal * 12)} no ano para atingir o próximo nível!`,
		);
	}

	if (recomendacoes.length === 0) {
		recomendacoes.push(
			"✅ Operação está saudável! Continue monitorando suas métricas.",
		);
	}

	return recomendacoes;
}

export function gerarAnaliseEvento(
	taxaConversao: number,
	margemPorFoto: number,
	roi: number,
	taxa: number,
): string[] {
	const analises: string[] = [];

	if (roi > 50) {
		analises.push("🎉 ROI excelente! Este tipo de evento vale muito a pena.");
	} else if (roi < 0) {
		analises.push(
			"🚨 Evento com prejuízo. Analise se vale a pena participar deste tipo de evento novamente.",
		);
	}

	if (taxaConversao < 1) {
		analises.push(
			"📸 Conversão baixa. Talvez o público deste evento não esteja interessado em comprar fotos.",
		);
	} else if (taxaConversao > 2) {
		analises.push("✅ Ótima conversão! Este é um evento com público engajado.");
	}

	if (taxa > 50) {
		analises.push(
			`⚠️ Taxa da plataforma muito alta (${formatPorcentagem(taxa, 0)}%). Avalie se eventos próprios seriam mais rentáveis.`,
		);
	}

	if (margemPorFoto < 2) {
		analises.push(
			"💰 Margem por foto muito baixa. Considere aumentar o preço ou reduzir custos operacionais.",
		);
	}

	return analises;
}
//
