// Conteúdo fixo do site. Os artigos vêm do RSS do blog da Epicora no build.

export const SITE = 'https://pedrohhcunha.github.io/';
export const EPICORA = 'https://epicora.com.br';

export const PERFIS = {
  linkedin: 'https://www.linkedin.com/in/pedrohhcunha/',
  instagram: 'https://www.instagram.com/pedrohhcunha/',
  youtube: 'https://www.youtube.com/@pedrohhcunha',
  github: 'https://github.com/pedrohhcunha',
  autor: 'https://epicora.com.br/blog/autor/pedro',
};

// Os cases publicados no site da Epicora, na ordem de lá (lib/cases.ts).
export const SISTEMAS = [
  { slug: 'cleantec', cliente: 'Cleantec', setor: 'Higienização industrial', titulo: 'Do Excel à rastreabilidade total da higienização' },
  { slug: 'ideal', cliente: 'Ideal Veículos', setor: 'Revenda de veículos', titulo: 'A operação de crédito de 11 lojas saiu da planilha' },
  { slug: 'prohire', cliente: 'ProHire', setor: 'Recrutamento e RH', titulo: 'Um ecossistema que conecta empresas e profissionais' },
  { slug: 'bravio', cliente: 'Bravio Combat Club', setor: 'Esporte', titulo: 'Um clube que só existia no Instagram ganhou site próprio' },
  { slug: 'fitness-academia', cliente: 'Fitness Academia', setor: 'Rede de academias', titulo: 'A meta comercial de cinco unidades saiu da planilha' },
  { slug: 'helpe', cliente: 'Helpe', setor: 'Serviços locais', titulo: 'Assinatura para quem presta, busca livre para quem contrata' },
  { slug: 'cuidar', cliente: 'Sistema Cuidar', setor: 'Saúde e segurança do trabalho', titulo: 'O laudo de riscos psicossociais da NR-1 nasce da própria coleta' },
  { slug: 'reticar', cliente: 'Reticar Motores', setor: 'Automotivo', titulo: 'A equipe comercial trocou o app antigo por um que trabalha sem internet' },
  { slug: 'forja', cliente: 'Sistema Forja', setor: 'SaaS de assinatura', titulo: 'Um produto feito com IA ganhou segurança e uma conta de infraestrutura menor' },
  { slug: 'casa-follow-up', cliente: 'Casa Follow Up', setor: 'Saúde', titulo: 'O que acontece com o paciente entre duas consultas deixou de depender da memória dele' },
  { slug: 'sheep-gen', cliente: 'DNA Genética do Brasil', setor: 'Agronegócio', titulo: '4,3 GB do laboratório viram um laudo por animal' },
  { slug: 'okse', cliente: 'Agência OKSE', setor: 'Marketing', titulo: 'Site novo em oito horas e um agente de IA no primeiro contato do WhatsApp' },
  { slug: 'beckers', cliente: 'Beckers Automação Industrial', setor: 'Indústria', titulo: 'O laudo do ventilador sai pronto da bancada' },
];

export const TRAJETORIA = [
  {
    quando: '2019 – 2020',
    titulo: 'Técnico em Desenvolvimento de Sistemas',
    texto: 'Curso técnico no SESI SENAI de Chapecó, junto com o ensino médio. Foi ali que programar deixou de ser curiosidade e virou profissão.',
  },
  {
    quando: '2021',
    titulo: 'Análise e Desenvolvimento de Sistemas',
    texto: 'Graduação na Faculdade SENAI, em Chapecó. Na mesma época comecei a publicar conteúdo de programação no Instagram e a pegar os primeiros projetos web.',
  },
  {
    quando: '2023 – 2024',
    titulo: 'Cofundador da InTracer',
    texto: 'Primeira empresa própria, de julho de 2023 a maio de 2024, tocada em paralelo com os projetos de desenvolvimento.',
  },
  {
    quando: '2024',
    titulo: 'Desenvolvedor full stack na ALL TAX Platform',
    texto: 'Trabalho remoto para São Paulo, com Node.js no backend.',
  },
  {
    quando: '2024 – hoje',
    titulo: 'CTO e sócio da Epicora Software House',
    texto: 'Cuido da arquitetura, do time de tecnologia e do processo de entrega. Hoje a Epicora opera com IA de ponta a ponta, do escopo ao código.',
    atual: true,
  },
];
