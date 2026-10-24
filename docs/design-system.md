# Design System — Maia Class

> [!WARNING]
> **RASCUNHO PROVISÓRIO (D-23).** Este documento pode ser usado nas primeiras fases, mas a identidade visual definitiva (cor de destaque, logo, estilo dos menus) será definida numa sessão dedicada com o autor, antes da construção dos menus definitivos. Não invista em polimento visual baseado neste rascunho.

---

## 1. Filosofia: o quadro em primeiro lugar
- **Discreto:** a interface não rouba atenção nem espaço da escrita.
- **Flutuante:** menus flutuam sobre o quadro. O menu principal poderá ser movido para topo, base ou laterais (Fase 7, D-24), pensando em destros e canhotos.
- **Sem fricção:** caneta, borracha e cores rápidas a um toque. Menus contextuais aparecem perto da caneta (Extra 3).
- **Feito para caneta e dedo:** todo alvo de toque tem no mínimo **44 × 44 px** (ideal 48 px), com espaço entre botões para evitar toques acidentais.

---

## 2. Temas da interface

| Elemento | Tema claro | Tema escuro (modo noturno) |
|---|---|---|
| Superfície dos menus | `#FFFFFF`, borda `#E2E8F0`, sombra suave | `#1E1E22`, borda `#3F3F46` |
| Texto e ícones | `#1E293B` | `#F4F4F5` |
| Texto secundário | `#64748B` | `#A1A1AA` |
| Destaque (ferramenta ativa) | `#2563EB` *(provisório)* | `#3B82F6` *(provisório)* |

---

## 3. Papel (fundo do quadro)

### 3.1 Cores de papel (item 9c)
| Token | Claro | Uso |
|---|---|---|
| `papel:branco` | `#FBFBFC` | Padrão |
| `papel:creme` | `#FAF6EC` | Leitura longa |
| `papel:cinza` | `#F1F5F9` | Neutro |
| `papel:lousa` | `#1F3A2E` | Estilo quadro-verde (tintas claras) |
| `papel:escuro` | `#121214` | Padrão do modo noturno |

Também deve haver seletor de cor livre.

### 3.2 Padrões de fundo (item 9a)
Liso, grade matemática, pontilhado, linhas (caderno) e partitura (pentagramas de 5 linhas).
Cor das linhas: `#E2E8F0` no papel claro e `#27272A` no papel escuro. As linhas se adaptam ao zoom: subdividem ao aproximar e se agrupam ao afastar, mantendo um espaçamento confortável na tela.

---

## 4. Tintas

### 4.1 Paleta da caneta
Salva no documento como **referência** (`paleta:preto`), não como código fixo (D-18).

| Token | Modo claro | Modo noturno |
|---|---|---|
| `paleta:preto` | `#1E293B` | `#F8FAFC` (inverte) |
| `paleta:branco` | `#F8FAFC` | `#1E293B` (inverte) |
| `paleta:azul` | `#2563EB` | `#60A5FA` |
| `paleta:vermelho` | `#DC2626` | `#F87171` |
| `paleta:verde` | `#16A34A` | `#4ADE80` |
| `paleta:roxo` | `#9333EA` | `#C084FC` |
| `paleta:laranja` | `#EA580C` | `#FB923C` |

Exportações usam sempre a coluna "modo claro", salvo escolha contrária do usuário.

### 4.2 Paleta do marca-texto
Cor **opaca** + opacidade separada (padrão 40%). A opacidade é aplicada ao traço inteiro, para não escurecer onde ele passa sobre si mesmo.

| Token | Cor base |
|---|---|
| `marca:amarelo` | `#FACC15` |
| `marca:verde` | `#4ADE80` |
| `marca:azul` | `#38BDF8` |
| `marca:rosa` | `#F472B6` |
| `marca:laranja` | `#FB923C` |

---

## 5. Tipografia
- **Interface:** fonte do sistema (`system-ui`, Roboto no Android). Nenhum download.
- **Caixa de texto:** fontes **empacotadas no app** (D-17), licença OFL/Apache, para funcionar offline e sair idênticas no PDF. Categorias: sem serifa, com serifa, monoespaçada e manuscrita. A lista final será escolhida na Fase 5 ([dependencias.md](dependencias.md)).

---

## 6. Ícones
Biblioteca **Lucide** (licença ISC): traço fino e consistente. Tamanho 20–24 px dentro de alvos de 44–48 px.

---

## 7. Menu principal (dock)
- Formato de pílula flutuante com cantos bem arredondados e sombra suave.
- Fase 1: posição fixa (base da tela). Fase 7: alça para arrastar até topo, base ou laterais, com orientação horizontal ou vertical conforme a borda.
- Ferramenta ativa indicada com a cor de destaque.
- Opções de cada ferramenta abrem num painel flutuante junto ao botão da ferramenta.

---

## 8. Movimento
Transições curtas (150–200 ms). Nada de animação durante o traço ou a navegação: o quadro tem prioridade total de desempenho.
