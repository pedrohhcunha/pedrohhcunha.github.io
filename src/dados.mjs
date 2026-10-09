// Conteúdo fixo do site. Os artigos vêm do RSS do blog da Epicora no build.
// Tudo aqui é público: números e frases saem dos cases publicados em
// epicora.com.br/cases e da palestra na Conquer (23/09/2026).

export const SITE = 'https://pedrohhcunha.github.io/';
export const EMAIL = 'pedro.cunha@epicora.com.br';

export const PERFIS = {
  linkedin: 'https://www.linkedin.com/in/pedrohhcunha/',
  instagram: 'https://www.instagram.com/pedrohhcunha/',
  youtube: 'https://www.youtube.com/@pedrohhcunha',
  github: 'https://github.com/pedrohhcunha',
  autor: 'https://epicora.com.br/blog/autor/pedro',
};

export const GRUPOS = {
  planilha: 'Da planilha para o sistema',
  ia: 'IA dentro do processo',
  campo: 'Apps de campo',
  plataforma: 'Plataformas e produtos',
  site: 'Sites',
};

// Ordem de leitura do índice: o que mais impressiona primeiro.
export const TRABALHO = [
  { slug: 'ideal', cliente: 'Ideal Veículos', setor: 'Revenda de veículos', grupo: 'planilha', valor: '11.364', rotulo: 'financiamentos processados em 11 lojas', titulo: 'A operação de crédito das 11 lojas saiu da planilha.' },
  { slug: 'sheep-gen', cliente: 'DNA Genética do Brasil', setor: 'Agronegócio', grupo: 'ia', valor: '735', rotulo: 'laudos genéticos emitidos no clique', titulo: '4,3 GB do laboratório viram uma página por animal.' },
  { slug: 'fitness-academia', cliente: 'Fitness Academia', setor: 'Rede de academias', grupo: 'planilha', valor: '104%', rotulo: 'da meta da rede no primeiro mês', titulo: 'Cinco planilhas de meta viraram um número só.' },
  { slug: 'beckers', cliente: 'Beckers Automação Industrial', setor: 'Indústria', grupo: 'campo', valor: '428', rotulo: 'relatórios técnicos emitidos pelo app', titulo: 'O laudo do ventilador sai pronto da bancada.' },
  { slug: 'cuidar', cliente: 'Sistema Cuidar', setor: 'Saúde e segurança do trabalho', grupo: 'ia', valor: '370', rotulo: 'respostas anônimas; 5 seções do laudo escritas por IA', titulo: 'O laudo da NR-1 nasce da própria coleta.' },
  { slug: 'prohire', cliente: 'ProHire', setor: 'Recrutamento e RH', grupo: 'plataforma', valor: '+590%', rotulo: 'vagas criadas no mês', titulo: 'App e web juntando RH e profissionais.' },
  { slug: 'okse', cliente: 'Agência OKSE', setor: 'Marketing', grupo: 'ia', valor: '8 h', rotulo: 'do site antigo ao novo no ar, com agente de IA atendendo', titulo: 'Site novo e IA no primeiro contato do WhatsApp num dia.' },
  { slug: 'reticar', cliente: 'Reticar Motores', setor: 'Automotivo', grupo: 'campo', valor: '100%', rotulo: 'da operação comercial migrada para o app offline', titulo: 'O vendedor trabalha sem internet e nada se perde.' },
  { slug: 'cleantec', cliente: 'Cleantec', setor: 'Higienização industrial', grupo: 'planilha', valor: '460+', rotulo: 'análises de microbiologia por mês', titulo: 'Do Excel à rastreabilidade total da higienização.' },
  { slug: 'casa-follow-up', cliente: 'Casa Follow Up', setor: 'Saúde', grupo: 'plataforma', valor: '18', rotulo: 'protocolos clínicos em operação', titulo: 'O paciente acompanhado entre uma consulta e outra.' },
  { slug: 'forja', cliente: 'Sistema Forja', setor: 'SaaS de assinatura', grupo: 'ia', valor: '~US$ 20', rotulo: 'de infraestrutura por mês, antes ~R$ 2.000', titulo: 'Um produto feito com IA ficou seguro e barato de manter.' },
  { slug: 'helpe', cliente: 'Helpe', setor: 'Serviços locais', grupo: 'plataforma', valor: '24', rotulo: 'categorias de serviço no marketplace', titulo: 'Assinatura para quem presta, busca livre para quem contrata.' },
  { slug: 'bravio', cliente: 'Bravio Combat Club', setor: 'Esporte', grupo: 'site', valor: '5 sem.', rotulo: 'do briefing ao site no ar', titulo: 'Um clube que só existia no Instagram ganhou site próprio.' },
];

export const DEPOIMENTOS = [
  { texto: 'Empresas com muito mais tempo de mercado e muita credibilidade vieram, e não conseguiram entregar 10% do que vocês entregaram.', autor: 'Paulo Pons', cargo: 'Diretor de Operações, Cleantec do Brasil' },
  { texto: 'Saímos de planilhas que não davam mais conta para um sistema onde acessamos tudo de forma estratégica. A solução ficou até melhor do que imaginávamos.', autor: 'Gabriela', cargo: 'Gerente de F&I, Ideal Veículos' },
  { texto: 'O aplicativo foi entregue com excelência, no prazo e com muito profissionalismo. Automatizou etapas manuais e deixou nossa assistência técnica muito mais eficiente.', autor: 'André Matuella', cargo: 'Desenvolvedor Projetista, Beckers Automação Industrial' },
  { texto: 'Desde o início dos nossos trabalhos sempre obtivemos atualizações e um ótimo acompanhamento, da lapidação da ideia até a execução.', autor: 'João Miguel Sitta Alves', cargo: 'DNA Genética do Brasil' },
];

// Logos em branco (assets/logos), mesma seleção do carrossel do site da Epicora.
export const LOGOS = [
  ['ideal-veiculos', 'Ideal Veículos'], ['cleantec', 'Cleantec'], ['beckers', 'Beckers'], ['dna-genetica', 'DNA Genética do Brasil'],
  ['fitness-academia', 'Fitness Academia'], ['reticar', 'Reticar'], ['gt', 'GT Gestão Otimizada de Manutenção'], ['prohire-01-1', 'ProHire'],
  ['casa-follow-up', 'Casa Follow Up'], ['3d-industrial', '3D Industrial'], ['okse', 'Agência OKSE'], ['helpe', 'Helpe'],
  ['cuidar', 'Sistema Cuidar'], ['forja', 'Sistema Forja'], ['onfinity', 'Onfinity'], ['connect-carbon', 'Connect Carbon'],
  ['carbon-smart', 'Carbon Smart'], ['bravio', 'Bravio'], ['kittado', 'Kittado'], ['filmavys', 'Filmavys'],
];

export const FORMATOS = [
  {
    nome: 'Palestra',
    duracao: '60 a 90 min',
    para: 'Eventos, associações empresariais e escolas de negócio.',
    leva: 'Onde a IA compensa numa empresa, com sistemas reais rodando na tela, e o primeiro passo para o dia seguinte.',
  },
  {
    nome: 'Treinamento in company',
    duracao: 'Meio período',
    para: 'Sócios, diretoria e lideranças de uma empresa.',
    leva: 'O mapa das tarefas que dá para delegar à IA na sua operação e a primeira delas testada na sala.',
  },
  {
    nome: 'Workshop para times de tecnologia',
    duracao: '1 dia',
    para: 'Times de desenvolvimento e produto.',
    leva: 'Como a Epicora trabalha com IA do escopo ao código: método, revisão, segurança e o que não delegar.',
  },
];

export const TEMAS = [
  { tema: 'Onde a IA compensa na sua empresa, e onde não compensa' },
  { tema: 'Chat, assistente ou agente: o que dá para delegar', link: 'https://epicora.com.br/blog/chat-assistente-agente-ia' },
  { tema: 'Como organizar o conhecimento da empresa para a IA', link: 'https://epicora.com.br/blog/organizar-conhecimento-empresa-ia' },
  { tema: 'Como fazer a IA seguir o método da sua empresa', link: 'https://epicora.com.br/blog/restringir-ia-metodologia' },
  { tema: 'Quanto custa pôr IA para trabalhar dentro do sistema', link: 'https://epicora.com.br/blog/quanto-custa-ia-na-empresa' },
  { tema: 'Dado da empresa na IA: o que pode e o que não pode' },
];

export const TRAJETORIA = [
  { quando: '2019', titulo: 'A primeira linha de HTML', texto: 'Curso técnico em Desenvolvimento de Sistemas no SESI SENAI de Chapecó, junto com o ensino médio.' },
  { quando: '2020', titulo: 'Aprender refazendo', texto: 'Refiz do zero as telas da Netflix em cerca de oito horas, sem framework. Depois vieram Prime Video, Tesla e Guaraná Antarctica, tudo em HTML, CSS e JavaScript.' },
  { quando: '2021', titulo: 'Faculdade e conteúdo', texto: 'Análise e Desenvolvimento de Sistemas na Faculdade SENAI e os primeiros posts sobre programação no Instagram.' },
  { quando: '2022', titulo: 'Primeiros clientes', texto: 'Sites e sistemas para empresas, como a landing page da Onfinity, já com React e Node.js.' },
  { quando: '2023', titulo: 'Cofundador da InTracer', texto: 'A primeira empresa própria, de julho de 2023 a maio de 2024.' },
  { quando: '2024', titulo: 'CTO e sócio da Epicora', texto: 'Arquitetura, time de tecnologia e processo de entrega. Hoje a Epicora opera com IA de ponta a ponta, do escopo ao código.', atual: true },
  { quando: '2026', titulo: 'Palco', texto: 'Treinamento de IA aplicada a negócios para empresários na Conquer Chapecó.' },
];

export const STACK = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'React Native', 'Node.js', 'NestJS', 'MongoDB', 'Claude Code'];
