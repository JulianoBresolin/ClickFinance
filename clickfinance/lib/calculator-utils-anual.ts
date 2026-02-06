import { formatMoeda } from "./calculator-utils";

// Tipos específicos para Análise Anual
export interface EquipamentoDepreciacao {
	id: string;
	nome: string;
	tipo: "camera" | "lente" | "outro";
	valor: number;
	vidaUtil?: number; // Para câmeras com obturador mecânico (em cliques)
	anosDurabilidade?: number; // Para lentes, câmeras mirrorless e outros
	quantidade: number;
}

export interface DadosAnuais {
	// Equipamentos
	equipamentos: EquipamentoDepreciacao[];

	// Dados de uso da câmera principal
	vidaTotal: number;
	cliquesAtuaisMecanicos: number;
	fotosTotais: number;
	fotosTotaisMecanicas: number; // Apenas fotos com obturador mecânico

	// Vendas e eventos
	fotosVendidas: number;
	eventos: number;
	receitaLiquida: number;
	custoEvento: number;

	// Configurações
	usarDepreciacaoPorTempo: boolean;
}

export interface ResultadoAnual {
	custoPorClique: number;
	depreciacaoTotal: number;
	depreciacaoDetalhada: {
		cameras: number;
		lentes: number;
		outros: number;
		itens: Array<{
			nome: string;
			tipo: string;
			valor: number;
		}>;
	};
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

export interface Nivel {
	nome: string;
	classe: string;
	proximo: number | null;
}

// Função principal de cálculo anual
export function calcularAnual(dados: DadosAnuais): ResultadoAnual {
	let custoPorClique = 0;
	let depreciacaoTotal = 0;
	const depreciacaoDetalhada = {
		cameras: 0,
		lentes: 0,
		outros: 0,
		itens: [] as Array<{ nome: string; tipo: string; valor: number }>,
	};
	let vidaRestante = 0;
	let percentualVidaRestante = 0;

	// Calcular depreciação de cada equipamento
	dados.equipamentos.forEach((equip) => {
		let depreciacaoEquip = 0;

		if (equip.tipo === "camera") {
			if (dados.usarDepreciacaoPorTempo && equip.anosDurabilidade) {
				// Câmera mirrorless (obturador eletrônico) - depreciação por tempo
				depreciacaoEquip =
					(equip.valor * equip.quantidade) / equip.anosDurabilidade;
			} else if (equip.vidaUtil && equip.vidaUtil > 0) {
				// Câmera DSLR (obturador mecânico) - depreciação por cliques
				const custoPorCliq = equip.valor / equip.vidaUtil;
				depreciacaoEquip =
					dados.fotosTotaisMecanicas * custoPorCliq * equip.quantidade;
				custoPorClique = custoPorCliq; // Guardar para exibição
			}
		} else {
			// Lentes e outros - sempre por tempo
			if (equip.anosDurabilidade && equip.anosDurabilidade > 0) {
				depreciacaoEquip =
					(equip.valor * equip.quantidade) / equip.anosDurabilidade;
			}
		}

		// Categorizar
		if (equip.tipo === "camera") {
			depreciacaoDetalhada.cameras += depreciacaoEquip;
		} else if (equip.tipo === "lente") {
			depreciacaoDetalhada.lentes += depreciacaoEquip;
		} else {
			depreciacaoDetalhada.outros += depreciacaoEquip;
		}

		depreciacaoDetalhada.itens.push({
			nome: equip.nome,
			tipo: equip.tipo,
			valor: depreciacaoEquip,
		});

		depreciacaoTotal += depreciacaoEquip;
	});

	// Calcular vida restante da câmera principal (se usar obturador mecânico)
	if (!dados.usarDepreciacaoPorTempo && dados.vidaTotal > 0) {
		vidaRestante = dados.vidaTotal - dados.cliquesAtuaisMecanicos;
		percentualVidaRestante = (vidaRestante / dados.vidaTotal) * 100;
	}

	const custoOperacional = dados.eventos * dados.custoEvento;
	const custoTotal = depreciacaoTotal + custoOperacional;

	const lucroLiquido = dados.receitaLiquida - custoTotal;
	const roi = custoTotal > 0 ? (lucroLiquido / custoTotal) * 100 : 0;

	const precoMedioPorFoto =
		dados.fotosVendidas > 0 ? dados.receitaLiquida / dados.fotosVendidas : 0;
	const custoRealPorFoto =
		dados.fotosVendidas > 0 ? custoTotal / dados.fotosVendidas : 0;
	const margemPorFoto = precoMedioPorFoto - custoRealPorFoto;
	const taxaConversao =
		dados.fotosTotais > 0 ? (dados.fotosVendidas / dados.fotosTotais) * 100 : 0;
	const receitaPorEvento =
		dados.eventos > 0 ? dados.receitaLiquida / dados.eventos : 0;
	const fotosPorEvento =
		dados.eventos > 0 ? dados.fotosTotais / dados.eventos : 0;
	const vendasPorEvento =
		dados.eventos > 0 ? dados.fotosVendidas / dados.eventos : 0;

	const mediaMensal = dados.receitaLiquida / 12;
	const nivel = determinarNivel(mediaMensal);

	return {
		custoPorClique,
		depreciacaoTotal,
		depreciacaoDetalhada,
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

	if (vidaRestante > 0 && vidaRestante < 20) {
		recomendacoes.push(
			"⚠️ Câmera com menos de 20% de vida útil. Planeje a aquisição de novo equipamento nos próximos meses.",
		);
	} else if (vidaRestante > 0 && vidaRestante < 50) {
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
