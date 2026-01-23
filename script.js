// Controle de tabs
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
}

// Função para formatar valor como moeda brasileira
function formatCurrency(input) {
    let value = input.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    input.value = value;
}

// Função para converter moeda brasileira em númeroo
function parseCurrency(value) {
    if (!value) return 0;
    return Number(value.replace(/\./g, '').replace(',', '.'));
}

// Função para formatar número como moeda para exibição
function formatMoeda(valor) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Função para formatar números inteiros com separador de milhares
function formatNumero(valor) {
    return Math.round(valor).toLocaleString('pt-BR');
}

// Função para formatar porcentagem
function formatPorcentagem(valor, casasDecimais = 2) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: casasDecimais, maximumFractionDigits: casasDecimais });
}

// Aplicar formatação de moeda aos campos
document.addEventListener('DOMContentLoaded', function() {
    // Formatar campos de moeda
    const currencyInputs = document.querySelectorAll('.currency-input');
    currencyInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatCurrency(this);
        });
        
        // Permitir apenas números e vírgula
        input.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[\d,]/.test(char)) {
                e.preventDefault();
            }
        });
        // Atualizar depreciação automaticamente no evento
['evento_valorCamera', 'evento_vidaTotal', 'evento_fotosFeitas'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', calcularDepreciacaoEvento);
    }
});

    });
    
    // Mostrar/ocultar campo de taxa customizada
    const eventoTipo = document.getElementById('evento_tipo');
    if (eventoTipo) {
        eventoTipo.addEventListener('change', function() {
            const taxaGroup = document.getElementById('taxa_customizada_group');
            if (this.value === 'plataforma') {
                taxaGroup.style.display = 'block';
            } else {
                taxaGroup.style.display = 'none';
            }
        });
    }
});

// CÁLCULO ANUAL
function calcularAnual() {
    const valorCamera = parseCurrency(document.getElementById('anual_valorCamera').value);
    const vidaTotal = Number(document.getElementById('anual_vidaTotal').value) || 1;
    const cliquesAtuais = Number(document.getElementById('anual_cliquesAtuais').value) || 0;
    const fotosTotais = Number(document.getElementById('anual_fotosTotais').value) || 0;
    const fotosVendidas = Number(document.getElementById('anual_fotosVendidas').value) || 0;
    const eventos = Number(document.getElementById('anual_eventos').value) || 0;
    const receitaLiquida = parseCurrency(document.getElementById('anual_receitaLiquida').value);
    const custoEvento = parseCurrency(document.getElementById('anual_custoEvento').value);
    
    if (fotosTotais === 0 || fotosVendidas === 0 || receitaLiquida === 0) {
        alert('Por favor, preencha os campos obrigatórios!');
        return;
    }
    
    // Depreciação
    const custoPorClique = valorCamera / vidaTotal;
    const depreciacaoTotal = fotosTotais * custoPorClique;
    const vidaRestante = vidaTotal - cliquesAtuais;
    const percentualVidaRestante = (vidaRestante / vidaTotal) * 100;
    
    // Custos
    const custoOperacional = eventos * custoEvento;
    const custoTotal = depreciacaoTotal + custoOperacional;
    
    // Resultado
    const lucroLiquido = receitaLiquida - custoTotal;
    const roi = (lucroLiquido / custoTotal) * 100;
    
    // Métricas
    const precoMedioPorFoto = receitaLiquida / fotosVendidas;
    const custoRealPorFoto = custoTotal / fotosVendidas;
    const margemPorFoto = precoMedioPorFoto - custoRealPorFoto;
    const taxaConversao = (fotosVendidas / fotosTotais) * 100;
    const receitaPorEvento = receitaLiquida / eventos;
    const fotosPorEvento = fotosTotais / eventos;
    const vendasPorEvento = fotosVendidas / eventos;
    
    // Nível do fotógrafo (baseado em média mensal)
    const mediaMensal = receitaLiquida / 12;
    const nivel = determinarNivel(mediaMensal);
    
    // Status do negócio
    let statusNegocio = '';
    let alertClass = '';
    
    if (lucroLiquido > 0) {
        if (roi > 100) {
            statusNegocio = '🎉 Excelente! Seu negócio está muito lucrativo!';
            alertClass = 'alert-success';
        } else if (roi > 30) {
            statusNegocio = '✅ Bom! Operação rentável e sustentável.';
            alertClass = 'alert-success';
        } else {
            statusNegocio = '⚠️ Atenção! Lucro baixo. Considere otimizar custos ou aumentar vendas.';
            alertClass = 'alert-warning';
        }
    } else {
        statusNegocio = '🚨 Prejuízo! Revise urgentemente sua operação.';
        alertClass = 'alert-warning';
    }
    
    const resultadosDiv = document.getElementById('resultados-anual');
    resultadosDiv.className = 'results show';
    resultadosDiv.innerHTML = `
        <div class="alert-box ${alertClass}">
            <strong>${statusNegocio}</strong>
        </div>
        
        <div class="metric-card">
            <h3>Resultado Final do Período</h3>
            <div class="metric-value ${lucroLiquido >= 0 ? 'positive' : 'negative'}">
                ${lucroLiquido >= 0 ? '+' : ''}R$ ${formatMoeda(lucroLiquido)}
            </div>
            <div class="input-hint">Lucro/Prejuízo Líquido</div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">Receita Líquida Total</div>
                <div class="stat-value" style="color: #10b981;">R$ ${formatMoeda(receitaLiquida)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Custo Total</div>
                <div class="stat-value" style="color: #ef4444;">R$ ${formatMoeda(custoTotal)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">ROI do Período</div>
                <div class="stat-value" style="color: ${roi >= 0 ? '#10b981' : '#ef4444'};">${formatPorcentagem(roi, 1)}%</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Média Mensal</div>
                <div class="stat-value">R$ ${formatMoeda(mediaMensal)}</div>
                <div class="nivel-badge ${nivel.classe}">${nivel.nome}</div>
            </div>
        </div>
        
        <div class="section-title" style="margin-top: 30px;">📊 Métricas de Performance</div>
        
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">Taxa de Conversão</div>
                <div class="stat-value">${formatPorcentagem(taxaConversao)}%</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Preço Médio/Foto</div>
                <div class="stat-value">R$ ${formatMoeda(precoMedioPorFoto)}</div>
                <div class="input-hint">Receita líquida por venda</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Custo Real/Foto</div>
                <div class="stat-value">R$ ${formatMoeda(custoRealPorFoto)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Margem/Foto Vendida</div>
                <div class="stat-value" style="color: ${margemPorFoto >= 0 ? '#10b981' : '#ef4444'};">R$ ${formatMoeda(margemPorFoto)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Receita/Evento</div>
                <div class="stat-value">R$ ${formatMoeda(receitaPorEvento)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Vendas/Evento</div>
                <div class="stat-value">${formatPorcentagem(vendasPorEvento, 1)} fotos</div>
            </div>
        </div>
        
        <div class="section-title" style="margin-top: 30px;">🔧 Custos Detalhados</div>
        
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">Depreciação Câmera</div>
                <div class="stat-value">R$ ${formatMoeda(depreciacaoTotal)}</div>
                <div class="input-hint">R$ ${formatMoeda(custoPorClique)} por clique</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Custos Operacionais</div>
                <div class="stat-value">R$ ${formatMoeda(custoOperacional)}</div>
                <div class="input-hint">${formatNumero(eventos)} eventos × R$ ${formatMoeda(custoEvento)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Vida Útil Restante</div>
                <div class="stat-value">${formatPorcentagem(percentualVidaRestante, 1)}%</div>
                <div class="input-hint">${formatNumero(vidaRestante)} cliques</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentualVidaRestante}%"></div>
                </div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Fotos/Evento</div>
                <div class="stat-value">${formatNumero(fotosPorEvento)}</div>
            </div>
        </div>
        
        ${gerarRecomendacoes(taxaConversao, margemPorFoto, roi, percentualVidaRestante, nivel, receitaLiquida)}
    `;
}

// CÁLCULO POR EVENTO
// Depreciação automática por evento
function calcularDepreciacaoEvento() {
    const valorCamera = parseCurrency(document.getElementById('evento_valorCamera')?.value);
    const vidaTotal = Number(document.getElementById('evento_vidaTotal')?.value) || 0;
    const fotosFeitas = Number(document.getElementById('evento_fotosFeitas')?.value) || 0;

    if (valorCamera > 0 && vidaTotal > 0 && fotosFeitas > 0) {
        const custoPorClique = valorCamera / vidaTotal;
        const depreciacao = fotosFeitas * custoPorClique;

        document.getElementById('evento_depreciacao').value = formatMoeda(depreciacao);
    } else {
        document.getElementById('evento_depreciacao').value = '';
    }
}

function calcularEvento() {
    const nome = document.getElementById('evento_nome').value || 'Evento sem nome';
    const tipo = document.getElementById('evento_tipo').value;
    const taxaPlataforma = tipo === 'proprio' ? 10 : (Number(document.getElementById('evento_taxa').value) || 50);
    
    const fotosFeitas = Number(document.getElementById('evento_fotosFeitas').value) || 0;
    const fotosVendidas = Number(document.getElementById('evento_fotosVendidas').value) || 0;
    const precoFoto = parseCurrency(document.getElementById('evento_precoFoto').value);
    const depreciacao = parseCurrency(document.getElementById('evento_depreciacao').value);
    const custos = parseCurrency(document.getElementById('evento_custos').value);
    
    if (fotosFeitas === 0 || fotosVendidas === 0 || precoFoto === 0) {
        alert('Por favor, preencha os campos obrigatórios!');
        return;
    }
    
    // Cálculos financeiros
    const faturamentoBruto = fotosVendidas * precoFoto;
    const taxaValor = faturamentoBruto * (taxaPlataforma / 100);
    const receitaLiquida = faturamentoBruto - taxaValor;
    
    const custoTotal = depreciacao + custos;
    const lucroLiquido = receitaLiquida - custoTotal;
    
    // Métricas
    const taxaConversao = (fotosVendidas / fotosFeitas) * 100;
    const custoRealPorFoto = custoTotal / fotosVendidas;
    const receitaPorFoto = receitaLiquida / fotosVendidas;
    const margemPorFoto = receitaPorFoto - custoRealPorFoto;
    const roi = (lucroLiquido / custoTotal) * 100;
    
    // Status
    let statusEvento = '';
    let alertClass = '';
    
    if (lucroLiquido > 0) {
        statusEvento = '✅ Evento lucrativo!';
        alertClass = 'alert-success';
    } else {
        statusEvento = '⚠️ Evento com prejuízo!';
        alertClass = 'alert-warning';
    }
    
    const resultadosDiv = document.getElementById('resultados-evento');
    resultadosDiv.className = 'results show';
    resultadosDiv.innerHTML = `
        <div class="metric-card">
            <h3>${nome}</h3>
            <div class="input-hint">Tipo: ${tipo === 'proprio' ? 'Evento Próprio' : 'Evento da Plataforma'} | Taxa: ${formatPorcentagem(taxaPlataforma, 0)}%</div>
        </div>
        
        <div class="alert-box ${alertClass}">
            <strong>${statusEvento}</strong>
        </div>
        
        <div class="metric-card">
            <h3>Resultado do Evento</h3>
            <div class="metric-value ${lucroLiquido >= 0 ? 'positive' : 'negative'}">
                ${lucroLiquido >= 0 ? '+' : ''}R$ ${formatMoeda(lucroLiquido)}
            </div>
        </div>
        
        <div class="section-title" style="margin-top: 30px;">💰 Breakdown Financeiro</div>
        
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">Faturamento Bruto</div>
                <div class="stat-value">R$ ${formatMoeda(faturamentoBruto)}</div>
                <div class="input-hint">${formatNumero(fotosVendidas)} fotos × R$ ${formatMoeda(precoFoto)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Taxa Plataforma (${formatPorcentagem(taxaPlataforma, 0)}%)</div>
                <div class="stat-value" style="color: #ef4444;">-R$ ${formatMoeda(taxaValor)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Receita Líquida</div>
                <div class="stat-value" style="color: #10b981;">R$ ${formatMoeda(receitaLiquida)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Custo Total</div>
                <div class="stat-value" style="color: #ef4444;">-R$ ${formatMoeda(custoTotal)}</div>
                <div class="input-hint">Depreciação + Operacional</div>
            </div>
        </div>
        
        <div class="section-title" style="margin-top: 30px;">📊 Métricas do Evento</div>
        
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">Taxa de Conversão</div>
                <div class="stat-value">${formatPorcentagem(taxaConversao)}%</div>
                <div class="input-hint">${formatNumero(fotosVendidas)} de ${formatNumero(fotosFeitas)} fotos</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Receita/Foto Vendida</div>
                <div class="stat-value">R$ ${formatMoeda(receitaPorFoto)}</div>
                <div class="input-hint">Líquido após taxa</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Custo Real/Foto</div>
                <div class="stat-value">R$ ${formatMoeda(custoRealPorFoto)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">Margem/Foto</div>
                <div class="stat-value" style="color: ${margemPorFoto >= 0 ? '#10b981' : '#ef4444'};">R$ ${formatMoeda(margemPorFoto)}</div>
            </div>
            
            <div class="stat-item">
                <div class="stat-label">ROI</div>
                <div class="stat-value" style="color: ${roi >= 0 ? '#10b981' : '#ef4444'};">${formatPorcentagem(roi, 1)}%</div>
            </div>
        </div>
        
        <div class="section-title" style="margin-top: 30px;">💡 Análise do Evento</div>
        
        ${gerarAnaliseEvento(taxaConversao, margemPorFoto, roi, taxaPlataforma)}
    `;
}

// Determinar nível do fotógrafo
function determinarNivel(mediaMensal) {
    if (mediaMensal < 500) {
        return { nome: 'Iniciante', classe: 'nivel-iniciante', proximo: 500 };
    } else if (mediaMensal < 2000) {
        return { nome: 'Pleno', classe: 'nivel-pleno', proximo: 2000 };
    } else if (mediaMensal < 5000) {
        return { nome: 'Avançado', classe: 'nivel-avancado', proximo: 5000 };
    } else if (mediaMensal < 10000) {
        return { nome: 'Profissional', classe: 'nivel-profissional', proximo: 10000 };
    } else if (mediaMensal < 20000) {
        return { nome: 'Elite', classe: 'nivel-elite', proximo: 20000 };
    } else {
        return { nome: 'Lenda', classe: 'nivel-lenda', proximo: null };
    }
}

// Recomendações análise anual
function gerarRecomendacoes(taxaConversao, margemPorFoto, roi, vidaRestante, nivel, receitaAnual) {
    let recomendacoes = [];
    
    if (taxaConversao < 1) {
        recomendacoes.push('📸 Taxa de conversão baixa (<1%). Melhore o enquadramento, qualidade e entrega das fotos.');
    } else if (taxaConversao > 1.5) {
        recomendacoes.push('✅ Excelente taxa de conversão! Você está capturando os momentos certos.');
    }
    
    if (margemPorFoto < 3) {
        recomendacoes.push('💰 Margem por foto muito baixa. Considere reduzir custos operacionais ou focar em eventos mais lucrativos.');
    } else if (margemPorFoto > 6) {
        recomendacoes.push('✅ Ótima margem por foto! Continue assim.');
    }
    
    if (roi < 30) {
        recomendacoes.push('📊 ROI abaixo de 30%. Analise seus eventos e priorize os mais rentáveis.');
    } else if (roi > 100) {
        recomendacoes.push('🎉 ROI excepcional! Seu negócio está muito bem otimizado.');
    }
    
    if (vidaRestante < 20) {
        recomendacoes.push('⚠️ Câmera com menos de 20% de vida útil. Planeje a aquisição de novo equipamento nos próximos meses.');
    } else if (vidaRestante < 50) {
        recomendacoes.push('⚡ Câmera com vida útil média. Comece a pesquisar opções para substituição futura.');
    }
    
    if (nivel.proximo) {
        const mediaMensal = receitaAnual / 12;
        const faltaMensal = nivel.proximo - mediaMensal;
        recomendacoes.push(`🎯 Fature mais R$ ${formatMoeda(faltaMensal * 12)} no ano para atingir o próximo nível!`);
    }
    
    if (recomendacoes.length === 0) {
        recomendacoes.push('✅ Operação está saudável! Continue monitorando suas métricas.');
    }
    
    return `
        <div class="section-title" style="margin-top: 30px;">💡 Recomendações</div>
        ${recomendacoes.map(r => `
            <div class="alert-box alert-info">
                ${r}
            </div>
        `).join('')}
    `;
}

// Análise por evento
function gerarAnaliseEvento(taxaConversao, margemPorFoto, roi, taxa) {
    let analises = [];
    
    if (roi > 50) {
        analises.push('🎉 ROI excelente! Este tipo de evento vale muito a pena.');
    } else if (roi < 0) {
        analises.push('🚨 Evento com prejuízo. Analise se vale a pena participar deste tipo de evento novamente.');
    }
    
    if (taxaConversao < 1) {
        analises.push('📸 Conversão baixa. Talvez o público deste evento não esteja interessado em comprar fotos.');
    } else if (taxaConversao > 2) {
        analises.push('✅ Ótima conversão! Este é um evento com público engajado.');
    }
    
    if (taxa > 50) {
        analises.push(`⚠️ Taxa da plataforma muito alta (${formatPorcentagem(taxa, 0)}%). Avalie se eventos próprios seriam mais rentáveis.`);
    }
    
    if (margemPorFoto < 2) {
        analises.push('💰 Margem por foto muito baixa. Considere aumentar o preço ou reduzir custos operacionais.');
    }
    
    return analises.map(a => `
        <div class="alert-box alert-info">
            ${a}
        </div>
    `).join('');
}

