#!/bin/bash

# Função para personalizar cada categoria
personalizar() {
    categoria=$1
    titulo=$2
    descricao=$3
    cor_principal=$4
    cor_clara=$5
    cor_escura=$6
    
    arquivo="$categoria/index.html"
    
    # Copiar template base
    cp economia/index.html "$arquivo"
    
    # Personalizar título e descrição
    sed -i "s|<title>Economia - O Valor Capital</title>|<title>$titulo - O Valor Capital</title>|g" "$arquivo"
    sed -i "s|<h1 class=\"category-title\">Economia</h1>|<h1 class=\"category-title\">$titulo</h1>|g" "$arquivo"
    sed -i "s|Análises econômicas, políticas monetárias e tendências do mercado brasileiro e internacional|$descricao|g" "$arquivo"
    
    # Personalizar cores
    sed -i "s|--category-color: #1e40af|--category-color: $cor_principal|g" "$arquivo"
    sed -i "s|--category-light: #dbeafe|--category-light: $cor_clara|g" "$arquivo"
    sed -i "s|--category-dark: #1e3a8a|--category-dark: $cor_escura|g" "$arquivo"
    
    # Atualizar breadcrumb
    sed -i "s|<strong>Economia</strong>|<strong>$titulo</strong>|g" "$arquivo"
    
    echo "✅ Personalizado: $categoria"
}

# Personalizar cada categoria com suas cores
personalizar "investimentos" "Investimentos" "Estratégias de investimento, análise de ativos e gestão patrimonial" "#059669" "#d1fae5" "#047857"
personalizar "mercados" "Mercados" "Cotações, análise técnica e movimentações do mercado financeiro" "#dc2626" "#fee2e2" "#b91c1c"
personalizar "saude" "Saúde" "Gestão financeira para profissionais da saúde e mercado healthcare" "#0891b2" "#cffafe" "#0e7490"
personalizar "mpes" "MPEs" "Soluções financeiras e gestão para micro e pequenas empresas" "#ea580c" "#fed7aa" "#c2410c"
personalizar "previdencia" "Previdência" "Planejamento de aposentadoria e previdência privada" "#0f766e" "#ccfbf1" "#115e59"
personalizar "imoveis" "Imóveis" "Mercado imobiliário, financiamentos e fundos imobiliários" "#a21caf" "#fae8ff" "#86198f"
personalizar "credito" "Crédito" "Linhas de crédito, financiamentos e gestão de dívidas" "#b91c1c" "#fecaca" "#991b1b"
personalizar "seguros" "Seguros" "Proteção patrimonial, seguros de vida e previdência" "#0284c7" "#e0f2fe" "#0369a1"
personalizar "carreira" "Carreira" "Desenvolvimento profissional e gestão de carreira" "#7c2d12" "#fde7e1" "#5c1f0e"
personalizar "colunistas" "Colunistas" "Análises e opiniões de especialistas do mercado" "#4f46e5" "#e0e7ff" "#3730a3"
personalizar "ferramentas" "Ferramentas" "Calculadoras, simuladores e ferramentas financeiras" "#65a30d" "#ecfccb" "#4d7c0f"
personalizar "aprenda" "Aprenda" "Educação financeira, cursos e conteúdo educacional" "#d97706" "#fed7aa" "#b45309"
personalizar "empresas" "Empresas" "Notícias corporativas, balanços e análises empresariais" "#7c3aed" "#ede9fe" "#6d28d9"

echo "✅ TODAS AS CATEGORIAS PERSONALIZADAS!"
