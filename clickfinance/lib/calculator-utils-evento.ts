import { EquipamentoDepreciacao } from "./calculator-utils-anual";

export interface DadosEvento {
	nome: string;
	tipo: "proprio" | "plataforma";
	taxaPlataforma: number;
	fotosFeitas: number;
	fotosFeitasMecanicas: number;
	fotosVendidas: number;
	precoFoto: number;
	custos: number;
	equipamentos: EquipamentoDepreciacao[];
	usarDepreciacaoPorTempo: boolean;
	diasEvento: number;
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
	depreciacaoTotal: number;
}

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

export function calcularEvento(dados: DadosEvento): ResultadoEvento {
	const faturamentoBruto = dados.fotosVendidas * dados.precoFoto;
	const taxaValor = faturamentoBruto * (dados.taxaPlataforma / 100);
	const receitaLiquida = faturamentoBruto - taxaValor;

	let depreciacaoTotal = 0;

	dados.equipamentos.forEach((equip) => {
		let depreciacaoEquip = 0;

		if (dados.usarDepreciacaoPorTempo) {
			if (equip.anosDurabilidade && equip.anosDurabilidade > 0) {
				// Depreciação diária = (Valor * Qtd) / (Anos * 365)
				const depDiaria =
					(equip.valor * equip.quantidade) / (equip.anosDurabilidade * 365);
				depreciacaoEquip = depDiaria * dados.diasEvento;
			}
		} else {
			// Depreciação por clique
			if (equip.tipo === "camera" && equip.vidaUtil && equip.vidaUtil > 0) {
				const custoPorClique = equip.valor / equip.vidaUtil;
				// Usa fotosFeitasMecanicas se disponível, senão fotosFeitas
				const fotos =
					dados.fotosFeitasMecanicas > 0
						? dados.fotosFeitasMecanicas
						: dados.fotosFeitas;
				depreciacaoEquip = fotos * custoPorClique * equip.quantidade;
			}
		}
		depreciacaoTotal += depreciacaoEquip;
	});

	const custoTotal = depreciacaoTotal + dados.custos;
	const lucroLiquido = receitaLiquida - custoTotal;

	const taxaConversao =
		dados.fotosFeitas > 0 ? (dados.fotosVendidas / dados.fotosFeitas) * 100 : 0;
	const custoRealPorFoto =
		dados.fotosVendidas > 0 ? custoTotal / dados.fotosVendidas : 0;
	const receitaPorFoto =
		dados.fotosVendidas > 0 ? receitaLiquida / dados.fotosVendidas : 0;
	const margemPorFoto = receitaPorFoto - custoRealPorFoto;
	const roi = custoTotal > 0 ? (lucroLiquido / custoTotal) * 100 : 0;

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
		depreciacaoTotal,
	};
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
