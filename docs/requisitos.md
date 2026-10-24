# Requisitos Originais — Maia Class

> [!IMPORTANT]
> Este arquivo contém o pedido original do autor do projeto, **transcrito palavra por palavra** (23/10/2026).
> É a **fonte oficial do "o que fazer"**. Não reescreva, não resuma e não "corrija" este texto.
> Em caso de dúvida sobre como uma funcionalidade deve se comportar, este documento prevalece sobre resumos em outros arquivos.
> Decisões posteriores que refinam ou limitam estes requisitos estão registradas em [decisoes.md](decisoes.md).

---

##Funcionalidades

Um quadro branco infinito (estilo Miro) com suporte a escrita a mão via caneta digitalizadora, S Pen e Apple Pencil. Deve ser infinito em todas as direções e também “para dentro”, isto é Zoom in e Zoom out infinito. O zoom não pode distorcer o traço desenhado, que deve armazenar suas informações. Ou seja, não basta que o traço da caneta se torne um desenho pixelado fixo, é necessário que a qualidade do traço e os pixels escolhidos para ele sejam adaptados conforme o zoom da tela. Deve ter suporte a exportação do conteúdo escrito via PDF ou como imagem.

##Funções no menu

1. Caneta:
2 possibilidades de escrita (fluida e uniforme), variando a forma como se responde à pressão e sensibilidade do toque.
a) Cores: paletas de cores prontas
b) Espessura: real (espessura na tela, independentemente do zoom) e virtual (escolhe a espessura relativa ao zoom de 100%)
c) Forma do traço: pontilhado ou tracejado

2. Marca texto:
a) Cores: paletas de cores prontas
b) Espessura: real (espessura na tela, independentemente do zoom) e virtual (escolhe a espessura relativa ao zoom de 100%)

3. Borracha:
a) Espessura: real  (espessura na tela, independentemente do zoom) e virtual (escolhe a espessura relativa ao zoom de 100%)
b) Funcionamento: corte parcial ou traço inteiro

4. Selecionar
a) Estilo laço (forma livre) ou estilo quadrado
b) On/Off: inserir na seleção objetos parcialmente selecionados?
c) A depender do objeto selecionado (imagem, formas, etc...), o usuário pode escolher colocá-lo numa camada superior ou inferior da anotação (à frente o atrás de outros elementos)

5. Corrigir forma:
Nessa funcionalidade, o usuário desenha formas livres entre (retas, setas, círculos ou elipses, triângulos, quadriláteros, pentágonos, hexágonos, ..., corações, estrelas, etc) e o programa automaticamente corrige a forma, endireitando os traços, conectando os lados. Caso a aproximação não seja muito grosseira, o programa deve tornar o polígono regular, equilátero e equiângulo.
Edição manual: após desenhado, o usuário pode selecionar a forma. Deve aparecer um destaque nos vértices ou extremidades da figura para ampliar ou reduzir os lados da figura. Também deve abrir uma caixa de seleção com as opções:
Se for um polígono
a) Mostrar ângulos: calcula e escreve de forma discreta os ângulos inscritos no polígono. Cada alteração no tamanho dos lados deve automaticamente recalcular os ângulos inscritos.
b) Polígono regular: aproxima todos os lados e ângulos para o mesmo valor.
Se for um círculo ou elipse
a) On/off: mostrar centro ou pontos focais.
b) Seletor de distância focal: a distância 0 deve gerar uma circunferência perfeita.
Se for uma seta
a) Pontas: ferramenta para selecionar que formato a seta deve ter em cada uma das duas pontas.

6. Preencher:
Essa ferramenta serve para preencher de cor uma figura fechada, como um quadrado, como no paint.

7. Caixa de texto:
O usuário deve delimitar primeiro o espaço que a caixa de texto ocupará.
a) Fonte: seleção das principais fontes
b) Tamanho do texto
c) Negrito, itálico, subscrito, sobrescrito, sublinhado...
d) Cor do texto
e) Justificação: alinhado à esquerda/direita/centro ou justificado

8. Inserir/Importar
a) Imagens
b) PDF (nesse caso, a tela deve ser configurada automaticamente para o modo finito (OFF tela infinita).

9. Configurações da página
a) Fundo: grade matemática, pontilhado, liso, linhas (estilo caderno), partitura.
b) On/Off: Modo noturno
c) Cor do fundo
d) On/Off: ativar divisão em páginas A4. Essa função divide o fundo infinito em molduras de proporção A4. Será importante para delimitar o tamanho de cada página na exportação como PDF
e) On/Off: tela infinita.

10. Exportar
a) Como imagem: deve abrir uma caixa de seleção, para o usuário enquadrar quais partes da anotação devem ser exportados.
b) Como PDF: deve exportar respeitando as molduras de página ou (caso não esteja ativo) ativar a moldura A4 no documento de maneira a enquadrar as anotações.

##Funções extras

1. Quando o usuário desenhar utilizando a caneta comum e manter a caneta parada ao final do traço, deve-se automaticamente implementar a função "corrigir traço". A função caneta deve continuar selecionada.

2. O botão da SPen ou caneta digitalizadora deve ter função personalizavel num menu de configurações.
a) Ativar a borracha enquanto o botão estiver sendo pressionado
b) Selecionar objetos
c) Desfazer
d) Refazer

3. Suporte a gestos com a caneta:
Ao identificar um gesto específico enquanto o botão estiver pressionado, inicia uma ação
a) Abrir menu de configurações da caneta ao lado do local onde a caneta se encontra, para que o usuário não precise deslocar até o menu principal
b) Abrir uma versão do menu principal, para selecionar a função da caneta (borracha, marca texto, etc...) ao lado do local onde a caneta se encontra, para que o usuário não precise deslocar até o menu principal.

4. O menu principal com a seleção das funções da caneta deve ser móvel, para as laterais, topo e baixo da tela.

5. Reconhecimento de texto:
Ao escrever com a própria letra usando a S Pen, o programa deve ser capaz de reconhecer a caligrafia do usuário e executar algumas funções, caso ativadas pelo usuário:
a) Endireitar linhas e tamanho: numa mesma linha escrita, tornar mais regulares o tamanho entre cada letra e alinhar o texto a uma linha imaginária, evitando uma escrita ondulada, sem referência.
b) Transformar em texto formatado. Caso o usuário selecione o texto, utilizando a ferramenta selecionar, deve aparecer a possibilidade de transformar em caixa de texto.

6. No futuro, extensões:
Deve-se manter o código limpo a ponto de ser possível adicionar extensões futuramente.
Um editor de funções matemáticas...
GIFs animados para formatação de questões de física...
etc...
Alguns plugins devem funcionar como janelas redimensionáveis no espaço do caderno. Outros, serão apenas funções extras no mesmo menu já configurado.

##Objetivos

O programa tem 3 objetivos, mas não preciso de todos desde agora. Pense neles como Norte para guiar as decisões iniciais sem fechar portas.

Prioridade 1: funcionar no navegador de internet, se possível desenvolvimento do quadro infinito com zero latência das mesas digitalizadoras e canetas.

Prioridade 2: aplicativo para Android. Compreendo que o maior gargalo dessa portabilidade é a aplicação da S Pen sem latência no quadro infinito. O aplicativo deve ser mantido em Html CSS e Javascript? Ou a parte do quadro branco deve ser reescrita com outra linguagem de programação?

Prioridade 3: colaboração em tempo real. Através de um link de compartilhamento, é necessário que duas pessoas possam colaborar no mesmo quadro infinito, de dispositivos diferentes. Os níveis de permissão (visualização, comentários e edição) devem ser definidos por quem iniciou o quadro.

---

## Respostas complementares do autor (24/10/2026)

1. Sim, pretendo vender.
2. Tenho um S6 Lite e uma mesa digitalizadora WACOM
3. Prefiro que todas as soluções de reconhecimento de letra e colaboração sejam locais. Se não for possível, deixaremos essa parte do projeto em stand by, por enquanto. Montar essa parte de maneira modular, para ser fácil de trocar no futuro. Aliás, é importante pensar no sistema como um todo de maneira modular. Trabalhando nas funcionalidades cada qual de maneira separada, reduz o risco de um sistema quebrar o outro.
4. Apenas português.
5. Sim, deve funcionar sem internet.
