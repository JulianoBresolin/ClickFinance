// Importa do arquivo PAI
import {
	formatMoeda as fmtMoeda,
	formatPorcentagem as fmtPorc,
	type EquipamentoDepreciacao, // Importa aqui
} from "./calculator-utils-anual";

// === CORREÇÃO DO ERRO TS ===
// Re-exporta para que o FormEvento consiga importar daqui
export type { EquipamentoDepreciacao };

export const formatMoeda = fmtMoeda;
export const formatPorcentagem = fmtPorc;

export function formatNumero(valor: number): string {
	return Math.round(valor).toLocaleString("pt-BR");
}

export interface DadosEvento {
	// Equipamentos
	equipamentos: EquipamentoDepreciacao[];
	usarDepreciacaoPorTempo: boolean;
	diasEvento: number;

	// Dados do Evento
	nome: string;
	tipo: "proprio" | "plataforma";
	porcentagemComissao: number;

	// Produção
	fotosFeitas: number;
	fotosFeitasMecanicas: number;
	fotosVendidas: number;

	// Financeiro
	receitaLiquidaTotal: number;
	custosOperacionais: number;
}

export interface ResultadoEvento {
	faturamentoBruto: number;
	taxaPlataformaValor: number;
	receitaLiquida: number;

	depreciacaoTotal: number;
	depreciacaoDetalhada: {
		cameras: number;
		lentes: number;
		outros: number;
		itens: Array<{ nome: string; tipo: string; valor: number }>;
	};

	custoTotal: number;
	lucroLiquido: number;
	roi: number;

	precoVendaMedio: number;
	receitaPorFoto: number;
	custoRealPorFoto: number;
	margemPorFoto: number;
	taxaConversao: number;
}

export function calcularEvento(dados: DadosEvento): ResultadoEvento {
	let depreciacaoTotal = 0;
	const depreciacaoDetalhada = {
		cameras: 0,
		lentes: 0,
		outros: 0,
		itens: [] as Array<{ nome: string; tipo: string; valor: number }>,
	};

	// 1. Calcular Depreciação
	dados.equipamentos.forEach((equip) => {
		let depreciacaoEquip = 0;

		if (equip.tipo === "camera") {
			if (dados.usarDepreciacaoPorTempo && equip.anosDurabilidade) {
				const depAnual =
					(equip.valor * equip.quantidade) / equip.anosDurabilidade;
				const depDiaria = depAnual / 365;
				depreciacaoEquip = depDiaria * dados.diasEvento;
			} else if (equip.vidaUtil && equip.vidaUtil > 0) {
				const custoPorClique = equip.valor / equip.vidaUtil;
				const fotosParaDepreciacao =
					dados.fotosFeitasMecanicas > 0
						? dados.fotosFeitasMecanicas
						: dados.fotosFeitas;
				depreciacaoEquip =
					fotosParaDepreciacao * custoPorClique * equip.quantidade;
			}
		} else {
			if (equip.anosDurabilidade && equip.anosDurabilidade > 0) {
				const depAnual =
					(equip.valor * equip.quantidade) / equip.anosDurabilidade;
				const depDiaria = depAnual / 365;
				depreciacaoEquip = depDiaria * dados.diasEvento;
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

	// 2. Financeiro Reverso
	const comissaoDecimal = dados.porcentagemComissao / 100;
	const faturamentoBruto =
		comissaoDecimal > 0
			? dados.receitaLiquidaTotal / comissaoDecimal
			: dados.receitaLiquidaTotal;

	const taxaPlataformaValor = faturamentoBruto - dados.receitaLiquidaTotal;
	const custoTotal = depreciacaoTotal + dados.custosOperacionais;
	const lucroLiquido = dados.receitaLiquidaTotal - custoTotal;

	// 3. Métricas
	const roi = custoTotal > 0 ? (lucroLiquido / custoTotal) * 100 : 0;
	const taxaConversao =
		dados.fotosFeitas > 0 ? (dados.fotosVendidas / dados.fotosFeitas) * 100 : 0;

	const precoVendaMedio =
		dados.fotosVendidas > 0 ? faturamentoBruto / dados.fotosVendidas : 0;
	const receitaPorFoto =
		dados.fotosVendidas > 0
			? dados.receitaLiquidaTotal / dados.fotosVendidas
			: 0;
	const custoRealPorFoto =
		dados.fotosVendidas > 0 ? custoTotal / dados.fotosVendidas : 0;
	const margemPorFoto = receitaPorFoto - custoRealPorFoto;

	return {
		faturamentoBruto,
		taxaPlataformaValor,
		receitaLiquida: dados.receitaLiquidaTotal,
		depreciacaoTotal,
		depreciacaoDetalhada,
		custoTotal,
		lucroLiquido,
		roi,
		precoVendaMedio,
		receitaPorFoto,
		custoRealPorFoto,
		margemPorFoto,
		taxaConversao,
	};
}

export function gerarAnaliseEvento(
	taxaConversao: number,
	margemPorFoto: number,
	roi: number,
	comissaoFotografo: number,
): string[] {
	const analises: string[] = [];

	if (roi > 50)
		analises.push("🎉 ROI excelente! Este tipo de evento vale muito a pena.");
	else if (roi < 0)
		analises.push(
			"🚨 Evento com prejuízo (ROI Negativo). Custo superou o ganho.",
		);

	if (taxaConversao < 1)
		analises.push("📸 Conversão baixa (< 1%). Analise o público e a edição.");
	else if (taxaConversao > 3)
		analises.push("✅ Ótima conversão! Público engajado.");

	if (comissaoFotografo < 60 && comissaoFotografo > 0)
		analises.push(
			`⚠️ Comissão de ${comissaoFotografo}%. Eventos oficiais pagam mais (65%+).`,
		);

	if (margemPorFoto < 2 && margemPorFoto > 0)
		analises.push("💰 Margem por foto apertada. Cuidado com custos.");

	return analises;
}
