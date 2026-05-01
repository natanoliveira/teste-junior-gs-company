# Relatório Técnico de Implementação

Recebi o scaffold desse projeto e achei o desafio interessante. Transformaei o esqueleto em um painel de atendimento de acordo com o solicitado.

## Obrigatórios

Tudo que foi pedido foi feito, tô lhe dizendo:

- **Sidebar** buscando os contatos direto da `/api/contacts`, com filtro de busca por nome funcionando em tempo real — digita o nome e aparece na hora, sem enrolação
- **ChatWindow** carregando o histórico completo ao clicar num contato via `/api/messages?contactId={id}`, que Deus é bom
- Mensagens **inbound** do lado esquerdo com balão branco e **outbound** do lado direito com balão azul — bem diferenciado, como manda o figurino
- Horário exibido em cada mensagem, direitinho
- Input com envio via botão ou **Enter**, com **Optimistic UI** — a mensagem aparece na tela na hora, antes mesmo da API responder, igual a um passe de mágica

## Extras que Adicionei

Num me contentei só com o básico não, acrescentei uns caprichos que fazem diferença:

- **Toast de feedback** fechável que aparece ao enviar — verde pra sucesso, vermelho pra erro, e tem um X pra fechar quando quiser
- **Templates de resposta rápida** via `/api/templates` — tem um botão de raio no input que abre a lista das respostas prontas, facilitando o trabalho do atendente
- **Tags coloridas** dos contatos aparecem na sidebar, deixando tudo bem organizado
- **Indicador de status** online/offline no avatar, tanto na sidebar quanto no header do chat
- **Scroll automático** pra última mensagem ao abrir a conversa ou enviar uma nova
- **Timestamp relativo** nas conversas da sidebar — "há 5 min", "ontem" — bem mais natural que ficar mostrando hora absoluta
- **Indicador digitando...** que aparece brevemente após o envio, dando aquela sensação de produto real

## Componentes Criados

Fiz tudo separado, bem organizado, como se deve:

- `Toast.tsx` — notificação fechável, reaproveitável em qualquer lugar
- `MessageBubble.tsx` — balão de mensagem reutilizável
- `TemplateSelector.tsx` — seletor de respostas rápidas
- `src/utils/formatTime.ts` — utilitário de formatação de datas

## Respostas Automáticas

Pra deixar a demonstração mais viva, cada contato responde automaticamente após 2 segundos do envio. O indicador "digitando..." já aparece enquanto a resposta é preparada, e cada personagem tem 3 frases no estilo dele, sorteadas de forma aleatória a cada mensagem. Ficou danado de bom.

## Dados de Teste

Num usei nome genérico não, cumpade. Substituí os contatos do mock por um grupo lendário: Josué, Eliseu e Jesus da Bíblia Sagrada, Luke Skywalker, Obi-Wan Kenobi e Darth Vader de Star Wars, e Jack Burton com Lo Pan de Big Trouble in Little China. Só pra dar um charme nos dados de teste, visse?

## Sugestões de Melhoria

Os dados hoje vivem em memória e resetam ao reiniciar o servidor, o que é suficiente pro escopo do desafio. Mas numa versão real do produto, integraria um banco de dados de verdade, que num tem como ficar só na memória não. Duas opções que fazem sentido dependendo do caminho:

- **PostgreSQL** com Prisma ORM: faz sentido se o produto crescer com relatórios, filas, equipes e dashboards — dado estruturado, relacionamentos claros entre contatos, mensagens e usuários, e queries mais poderosas pra analytics
- **MongoDB**: faz sentido se o volume de mensagens for absurdo e a estrutura variar bastante por cliente — documentos flexíveis, escala horizontal mais fácil, e cada conversa pode ser um documento com as mensagens aninhadas

Pra esse produto de CRM com WhatsApp, minha preferência seria **PostgreSQL + Prisma** pela previsibilidade dos dados e pela facilidade de gerar relatórios de atendimento depois. Num tem erro não.

---

Natan de Oliveira Sousa
Analista Desenvolvedor Sênior
