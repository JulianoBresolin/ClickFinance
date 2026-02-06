// Funções de formatação (Exportadas para uso global)
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

// === INTERFACE DO EQUIPAMENTO (Fundamental para o erro ts(2459)) ===
export interface EquipamentoDepreciacao {
	id: string;
	nome: string;
	tipo: "camera" | "lente" | "outro";
	valor: number;
	vidaUtil?: number; // Para câmeras com obturador mecânico
	anosDurabilidade?: number; // Para mirrorless/lentes (tempo)
	quantidade: number;
}

// Tipos Anuais (V2)
export interface DadosAnuais {
	equipamentos: EquipamentoDepreciacao[];
	vidaTotal: number;
	cliquesAtuaisMecanicos: number;
	fotosTotais: number;
	fotosTotaisMecanicas: number;
	fotosVendidas: number;
	eventos: number;
	receitaLiquida: number;
	custoEvento: number;
	usarDepreciacaoPorTempo: boolean;
}

export interface Nivel {
	nome: string;
	classe: string;
	proximo: number | null;
}

export interface ResultadoAnual {
	custoPorClique: number;
	depreciacaoTotal: number;
	depreciacaoDetalhada: {
		cameras: number;
		lentes: number;
		outros: number;
		itens: Array<{ nome: string; tipo: string; valor: number }>;
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

// Lógica de Cálculo Anual
export function calcularAnual(dados: DadosAnuais): ResultadoAnual {
	let custoPorClique = 0;
	let depreciacaoTotal = 0;
	const depreciacaoDetalhada = {
		cameras: 0,
		lentes: 0,
		outros: 0,
		itens: [] as Array<{ nome: string; tipo: string; valor: number }>,
	};

	// Calcular depreciação
	dados.equipamentos.forEach((equip) => {
		let depreciacaoEquip = 0;

		if (equip.tipo === "camera") {
			if (dados.usarDepreciacaoPorTempo && equip.anosDurabilidade) {
				depreciacaoEquip =
					(equip.valor * equip.quantidade) / equip.anosDurabilidade;
			} else if (equip.vidaUtil && equip.vidaUtil > 0) {
				const custoPorCliq = equip.valor / equip.vidaUtil;
				depreciacaoEquip =
					dados.fotosTotaisMecanicas * custoPorCliq * equip.quantidade;
				custoPorClique = custoPorCliq;
			}
		} else {
			if (equip.anosDurabilidade && equip.anosDurabilidade > 0) {
				depreciacaoEquip =
					(equip.valor * equip.quantidade) / equip.anosDurabilidade;
			}
		}

		if (equip.tipo === "camera")
			depreciacaoDetalhada.cameras += depreciacaoEquip;
		else if (equip.tipo === "lente")
			depreciacaoDetalhada.lentes += depreciacaoEquip;
		else depreciacaoDetalhada.outros += depreciacaoEquip;

		depreciacaoDetalhada.itens.push({
			nome: equip.nome,
			tipo: equip.tipo,
			valor: depreciacaoEquip,
		});

		depreciacaoTotal += depreciacaoEquip;
	});

	let vidaRestante = 0;
	let percentualVidaRestante = 0;
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
	if (mediaMensal < 500)
		return { nome: "Iniciante", classe: "iniciante", proximo: 500 };
	else if (mediaMensal < 2000)
		return { nome: "Pleno", classe: "pleno", proximo: 2000 };
	else if (mediaMensal < 5000)
		return { nome: "Avançado", classe: "avancado", proximo: 5000 };
	else if (mediaMensal < 10000)
		return { nome: "Profissional", classe: "profissional", proximo: 10000 };
	else if (mediaMensal < 20000)
		return { nome: "Elite", classe: "elite", proximo: 20000 };
	else return { nome: "Lenda", classe: "lenda", proximo: null };
}

export function gerarRecomendacoes(
	taxaConversao: number,
	margemPorFoto: number,
	roi: number,
	percentualVidaRestante: number,
	nivel: Nivel,
	receitaAnual: number,
): string[] {
	const recomendacoes: string[] = [];

	if (taxaConversao < 1)
		recomendacoes.push(
			"📸 Taxa de conversão baixa (<1%). Melhore o enquadramento e a curadoria.",
		);
	if (margemPorFoto < 3)
		recomendacoes.push("💰 Margem baixa. Considere reduzir custos.");
	if (roi < 30) recomendacoes.push("📊 ROI baixo. Revise sua estratégia.");
	if (percentualVidaRestante > 0 && percentualVidaRestante < 20)
		recomendacoes.push("⚠️ Câmera perto do fim da vida útil.");

	if (nivel.proximo) {
		const falta = nivel.proximo - receitaAnual / 12;
		recomendacoes.push(
			`🎯 Fature mais R$ ${formatMoeda(falta * 12)} no ano para subir de nível!`,
		);
	}

	return recomendacoes;
}
