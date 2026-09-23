import type { L10n } from '@/i18n';

/* Textes repris à l'identique de l'ancien aboutme.html, restructurés en blocs. */

export const bio: L10n = {
  fr: `Je m'appelle Mattéo Canada, étudiant en troisième année de BUT Réseaux et Télécommunications, parcours cybersécurité. Passionné par l'informatique, les réseaux et les nouvelles technologies, je combine rigueur, créativité et esprit d'analyse pour mener à bien mes projets. J'accorde une importance particulière à l'innovation et à la résolution de problèmes, des valeurs que je partage avec un univers qui m'inspire au quotidien : le sport automobile, et la Formule 1 en particulier.`,
  en: `My name is Mattéo Canada, a third-year student in Networks and Telecommunications on the cybersecurity track. Passionate about IT, networks, and new technologies, I combine rigor, creativity, and analytical thinking to carry out my projects. I place great importance on innovation and problem-solving — values I share with a world that inspires me daily: motorsport, and Formula 1 in particular.`,
};

export const origin: L10n = {
  fr: `Dès mes 11 ans, j'ai initié un projet personnel de convertisseur de langage de programmation avec un ami, posant les bases de ma passion pour la tech. Plus récemment, j'ai dirigé un projet de ruche connectée pour un apiculteur afin de lui faire gagner en efficacité et en économie. Ce projet IoT, mêlant électronique, programmation embarquée et réseau, m'a permis d'exploiter pleinement mes compétences techniques et humaines.`,
  en: `Since I was 11, I started a personal project to create a programming language converter with a friend, laying the foundations of my passion for tech. More recently, I led a project to create a connected beehive for a beekeeper, helping him increase efficiency and reduce costs. This IoT project, combining electronics, embedded programming, and networking, allowed me to fully leverage my technical and interpersonal skills.`,
};

export const teammates = [
  { name: 'Soulim Rechidov', href: 'https://www.linkedin.com/in/soulim-rechidov/' },
  { name: 'Oualid Okych', href: 'https://www.linkedin.com/in/okych-oualid/' },
  { name: 'Nolan Ben Yahya', href: 'https://www.linkedin.com/in/nolan-by/' },
];

const mates = (and: string) =>
  teammates
    .map((m) => `<a href="${m.href}" target="_blank" rel="noopener">${m.name}</a>`)
    .reduce((acc, a, i, arr) => acc + (i === 0 ? '' : i === arr.length - 1 ? ` ${and} ` : ', ') + a, '');

export const cup = {
  ranks: [
    { rank: { fr: '1ᵉʳ', en: '1st' }, scope: { fr: 'France', en: 'France' } },
    { rank: { fr: '4ᵉ', en: '4th' }, scope: { fr: 'Europe', en: 'Europe' } },
    { rank: { fr: '5ᵉ', en: '5th' }, scope: { fr: 'Zone EMEA', en: 'EMEA region' } },
  ],
  text: {
    fr: `L'une de mes plus belles réussites collectives reste la <strong>finale de la Cisco EMEA Cup</strong>, disputée aux côtés de mes coéquipiers ${mates('et')}. Nous avons décroché la <strong>1ʳᵉ place en France</strong>, la <strong>4ᵉ en Europe</strong> et la <strong>5ᵉ sur toute la zone EMEA</strong> (Europe, Afrique, Moyen-Orient), une performance qui nous a valu d'être <strong>récompensés par Cisco</strong>. Au-delà du classement, cette finale a démontré la rigueur technique et l'esprit d'équipe que nous développons à l'IUT d'Aix-Marseille, et je tiens à remercier notre coach M. Nguyen ainsi que notre école pour leur soutien constant.`,
    en: `One of my proudest collective achievements remains the <strong>Cisco EMEA Cup final</strong>, competed alongside my teammates ${mates('and')}. We secured <strong>1st place in France</strong>, <strong>4th in Europe</strong> and <strong>5th across the entire EMEA region</strong> (Europe, Middle East and Africa), a performance that earned us <strong>recognition and rewards from Cisco</strong>. Beyond the ranking, this final showcased the technical rigour and team spirit we cultivate at the IUT of Aix-Marseille, and I want to thank our coach Mr. Nguyen and our school for their constant support.`,
  } satisfies L10n,
};

export const work: L10n = {
  fr: `Je suis actuellement en <strong>alternance au sein du D@TA-i</strong> (Département des Technologies Appliquées à l'Investigation), rattaché à la <strong>Direction Nationale de la Police Judiciaire (DNPJ)</strong>, Police Nationale — Ministère de l'Intérieur. Mon poste consiste à travailler sur les <strong>réseaux informatiques</strong> et les <strong>systèmes informatiques</strong> du service.`,
  en: `I'm currently on a <strong>work-study program within D@TA-i</strong> (Department of Technologies Applied to Investigation), part of the <strong>National Directorate of the Judicial Police (DNPJ)</strong>, French National Police — Ministry of the Interior. My role involves working on the department's <strong>computer networks</strong> and <strong>information systems</strong>.`,
};

export interface SkillDomain {
  name: L10n;
  text: L10n;
  tools: string[];
  /** slugs des projets qui mobilisent ce domaine */
  projects: string[];
}

export const skills: SkillDomain[] = [
  {
    name: { fr: 'Réseaux', en: 'Networks' },
    text: {
      fr: `Configuration d'infrastructure réseau, maîtrise des protocoles IPv4, IPv6, TCP/IP, mise en œuvre de NAT et PAT, routage dynamique avec OSPF et RIP et gestion des flux avec les ACL.`,
      en: `Network infrastructure configuration, proficient in IPv4, IPv6, TCP/IP protocols; implementation of NAT and PAT; dynamic routing with OSPF and RIP; traffic management using ACLs.`,
    },
    tools: ['IPv4 / IPv6', 'TCP/IP', 'NAT · PAT', 'OSPF', 'RIP', 'ACL'],
    projects: ['projet-integratif', 'supervision-dhcp', 'lab-kvm-bastion-teleport'],
  },
  {
    name: { fr: 'Systèmes', en: 'Systems' },
    text: {
      fr: `Administration de systèmes sous Linux, gestion des utilisateurs, services réseaux, sécurité de base.`,
      en: `System administration under Linux, user management, network services, basic security.`,
    },
    tools: ['Linux', 'Debian', 'KVM / Libvirt', 'Ansible', 'Teleport'],
    projects: ['lab-kvm-bastion-teleport', 'projet-integratif'],
  },
  {
    name: { fr: 'Programmation', en: 'Programming' },
    text: {
      fr: `Langages C, Python, HTML/CSS/JavaScript (Web), SQL (bases de données), développement d'applications Android.`,
      en: `Languages: C, Python, HTML/CSS/JavaScript (Web), SQL (databases), Android app development.`,
    },
    tools: ['C', 'C++', 'Python', 'MicroPython', 'SQL', 'JavaScript', 'Android'],
    projects: ['supervision-dhcp', 'analyse-donnees-twitter', 'vision-par-ordinateur'],
  },
  {
    name: { fr: 'Électronique', en: 'Electronics' },
    text: {
      fr: `Bases solides en électronique, utilisation de microcontrôleurs (Arduino), intégration de capteurs et modules de communication (GPS, capteurs de température/humidité, modules LTE).`,
      en: `Strong foundation in electronics, use of microcontrollers (Arduino), integration of sensors and communication modules (GPS, temperature/humidity sensors, LTE modules).`,
    },
    tools: ['Arduino', 'STM32WB55', 'BLE', 'MQTT', 'LTE', 'GPS'],
    projects: ['stage-steami-ble', 'ruche-connectee'],
  },
];

export type CertStatus = 'done' | 'prep';

export const certifications: { name: string; detail: L10n; issuer: string; status: CertStatus; when?: L10n }[] = [
  { name: 'Stormshield CSNA', detail: { fr: 'Certified Stormshield Network Administrator', en: 'Certified Stormshield Network Administrator' }, issuer: 'Stormshield', status: 'done', when: { fr: 'BUT 2', en: 'Year 2' } },
  { name: 'CCNA 3', detail: { fr: 'Enterprise Networking, Security and Automation', en: 'Enterprise Networking, Security and Automation' }, issuer: 'Cisco', status: 'done' },
  { name: 'CCNA 2', detail: { fr: 'Switching, Routing and Wireless Essentials', en: 'Switching, Routing and Wireless Essentials' }, issuer: 'Cisco', status: 'done' },
  { name: 'CCNA 1', detail: { fr: 'Cisco Certified Network Associate', en: 'Cisco Certified Network Associate' }, issuer: 'Cisco', status: 'done', when: { fr: 'BUT 1', en: 'Year 1' } },
  { name: 'SecNumacadémie', detail: { fr: 'Certification cybersécurité de l’ANSSI', en: 'ANSSI cybersecurity certification' }, issuer: 'ANSSI', status: 'done' },
  { name: 'CCNP ENCOR', detail: { fr: 'Implementing and Operating Cisco Enterprise Network Core Technologies', en: 'Implementing and Operating Cisco Enterprise Network Core Technologies' }, issuer: 'Cisco', status: 'prep' },
  { name: 'Stormshield CSNE', detail: { fr: 'Certified Stormshield Network Expert', en: 'Certified Stormshield Network Expert' }, issuer: 'Stormshield', status: 'prep' },
];

export const vision: L10n[] = [
  {
    fr: `Mon objectif est de devenir un professionnel complet, capable de concevoir et de sécuriser des infrastructures réseaux tout en intégrant des technologies intelligentes dans des solutions réelles. J'aime l'approche "hands-on" et je cherche constamment à approfondir mes connaissances et à repousser mes limites.`,
    en: `My goal is to become a well-rounded professional, capable of designing and securing network infrastructures while integrating smart technologies into real-world solutions. I love a hands-on approach and I constantly strive to deepen my knowledge and push my limits.`,
  },
  {
    fr: `À plus long terme, je souhaite <strong>poursuivre mes études en école d'ingénieur</strong> afin d'acquérir le niveau d'expertise et la légitimité technique nécessaires pour évoluer vers des postes à responsabilités. Je me vois <strong>diriger une équipe</strong>, transmettre ce que j'apprends et fédérer autour de projets ambitieux — une dimension humaine que la finale Cisco m'a confirmé apprécier autant que la technique. À terme, l'idée de <strong>créer ma propre entreprise</strong> m'attire profondément : pouvoir bâtir une structure qui me ressemble, portée par mes convictions techniques et mon goût de l'autonomie, est une perspective qui guide aujourd'hui mes choix.`,
    en: `In the longer term, I want to <strong>continue my studies at an engineering school</strong> to gain the level of expertise and technical legitimacy needed to move toward positions of responsibility. I see myself <strong>leading a team</strong>, passing on what I learn and rallying people around ambitious projects — a human dimension that the Cisco final confirmed I value as much as the technical side. Eventually, the idea of <strong>starting my own company</strong> deeply appeals to me: building a structure that reflects who I am, driven by my technical convictions and my taste for independence, is a prospect that already shapes my choices today.`,
  },
];

export const beyond: { label: L10n; text: L10n }[] = [
  {
    label: { fr: 'Langues', en: 'Languages' },
    text: {
      fr: `Je crois que ce que l'on fait en dehors du clavier façonne autant l'ingénieur que les compétences techniques. En ce moment, je consacre du temps à l'apprentissage de plusieurs langues — l'<strong>espagnol</strong>, l'<strong>italien</strong> et le <strong>japonais</strong> — par curiosité pour les cultures qu'elles portent autant que pour le plaisir de garder mon esprit en mouvement. Apprendre une langue, c'est un peu comme apprendre un nouveau paradigme de programmation : il faut accepter de se tromper, répéter, et reconstruire sa logique pas à pas.`,
      en: `I believe that what you do away from the keyboard shapes the engineer just as much as technical skills do. Right now, I'm dedicating time to learning several languages — <strong>Spanish</strong>, <strong>Italian</strong> and <strong>Japanese</strong> — out of curiosity for the cultures behind them as much as for the pleasure of keeping my mind active. Learning a language feels a lot like learning a new programming paradigm: you have to accept making mistakes, repeat, and rebuild your logic step by step.`,
    },
  },
  {
    label: { fr: 'Curiosité', en: 'Curiosity' },
    text: {
      fr: `Cette curiosité ne s'arrête pas à la technique. Je m'intéresse aussi à des domaines exigeants comme la <strong>psychologie</strong>, la <strong>finance</strong> et l'<strong>immobilier</strong>. La psychologie m'aide à mieux comprendre les autres et moi-même, ce qui est précieux dans le travail d'équipe et le management ; la finance et l'immobilier nourrissent mon envie d'autonomie et ma vision entrepreneuriale, en me poussant à raisonner sur le long terme et la création de valeur. J'aime explorer des sujets qui sortent de ma zone de confort, convaincu qu'une bonne décision technique se prend rarement en vase clos.`,
      en: `This curiosity doesn't stop at technology. I'm also drawn to demanding fields such as <strong>psychology</strong>, <strong>finance</strong> and <strong>real estate</strong>. Psychology helps me better understand others and myself, which is invaluable in teamwork and management; finance and real estate feed my desire for independence and my entrepreneurial outlook, pushing me to think in terms of the long run and value creation. I enjoy exploring topics outside my comfort zone, convinced that a sound technical decision is rarely made in a vacuum.`,
    },
  },
  {
    label: { fr: 'Sport automobile', en: 'Motorsport' },
    text: {
      fr: `Je suis aussi passionné de <strong>sport automobile</strong>. Je pratique le <strong>sim racing sur iRacing</strong>, aussi bien en <strong>GT3</strong> qu'en <strong>monoplace</strong>, une discipline qui m'a appris la rigueur, la régularité et la gestion du stress : en course, la moindre erreur se paie immédiatement, et la performance vient de la constance plus que de l'exploit isolé. C'est une école de précision et de sang-froid qui se retrouve, étonnamment, dans le débogage et l'optimisation logicielle. Plus largement, j'aime le <strong>sport</strong> sous toutes ses formes, le <strong>football</strong> en particulier, pour l'esprit d'équipe et la combativité qu'il demande.`,
      en: `I'm also passionate about <strong>motorsport</strong>. I practice <strong>sim racing on iRacing</strong>, both in <strong>GT3</strong> and <strong>open-wheel</strong> cars — a discipline that taught me rigour, consistency and stress management: in a race, the slightest mistake is paid for instantly, and performance comes from steadiness rather than isolated heroics. It's a school of precision and composure that, surprisingly, carries over into debugging and software optimisation. More broadly, I love <strong>sport</strong> in all its forms, <strong>football</strong> especially, for the team spirit and competitiveness it demands.`,
    },
  },
  {
    label: { fr: 'Open source', en: 'Open source' },
    text: {
      fr: `Enfin, j'ai des convictions assez tranchées sur la manière dont on construit et partage la technologie. Je suis profondément attaché à la <strong>philosophie de l'open source</strong> : la transparence du code, la liberté de comprendre, de modifier et de contribuer me semblent essentielles, et c'est aussi ce que j'ai pu vivre concrètement en stage à travers les dépôts collaboratifs. À l'inverse, je me reconnais peu dans le modèle fermé et l'écosystème imposé par <strong>Windows</strong> ; je travaille au quotidien sous <strong>Linux</strong>, où je me sens libre de maîtriser ma machine de bout en bout. Je reste néanmoins pragmatique : une conviction n'a de valeur que si l'on sait la confronter à d'autres points de vue, et c'est dans ces échanges que je progresse le plus.`,
      en: `Finally, I hold fairly strong views on how technology should be built and shared. I'm deeply attached to the <strong>open-source philosophy</strong>: code transparency and the freedom to understand, modify and contribute feel essential to me — something I experienced first-hand during my internship through collaborative repositories. Conversely, I don't identify much with the closed model and the ecosystem imposed by <strong>Windows</strong>; I work daily on <strong>Linux</strong>, where I feel free to master my machine from end to end. That said, I stay pragmatic: a conviction is only worth as much as your ability to confront it with other viewpoints, and it's through those exchanges that I grow the most.`,
    },
  },
];

/** Parcours — uniquement des faits présents dans le contenu existant. */
export const timeline: { when: L10n; kind: L10n; title: L10n; text: L10n; href?: string; logo?: boolean }[] = [
  {
    when: { fr: '2026 — auj.', en: '2026 — now' },
    kind: { fr: 'Alternance', en: 'Work-study' },
    title: { fr: 'D@TA-i — DNPJ, Police Nationale', en: 'D@TA-i — DNPJ, French National Police' },
    text: {
      fr: 'Réseaux et systèmes informatiques du Département des Technologies Appliquées à l’Investigation.',
      en: 'Networks and information systems for the Department of Technologies Applied to Investigation.',
    },
    logo: true,
  },
  {
    when: { fr: '2026', en: '2026' },
    kind: { fr: 'Stage de fin de BUT 2', en: 'Year-2 internship' },
    title: { fr: 'LAB — Aix-en-Provence', en: 'LAB — Aix-en-Provence' },
    text: {
      fr: 'Réseau BLE maillé, localisation par trilatération et portage C++ sur la carte STeaMi.',
      en: 'BLE mesh network, trilateration positioning and C++ porting on the STeaMi board.',
    },
    href: 'stage-steami-ble',
  },
  {
    when: { fr: '2024 — 26', en: '2024 — 26' },
    kind: { fr: 'Compétition', en: 'Competition' },
    title: { fr: 'Finale Cisco EMEA Cup', en: 'Cisco EMEA Cup final' },
    text: {
      fr: '1ᵉʳ en France, 4ᵉ en Europe, 5ᵉ sur la zone EMEA — en équipe, récompensés par Cisco.',
      en: '1st in France, 4th in Europe, 5th across EMEA — as a team, rewarded by Cisco.',
    },
  },
  {
    when: { fr: '2025 — 26', en: '2025 — 26' },
    kind: { fr: 'BUT 2 · Cybersécurité', en: 'Year 2 · Cybersecurity' },
    title: { fr: 'IUT d’Aix-Marseille', en: 'IUT Aix-Marseille' },
    text: {
      fr: 'Certification Stormshield CSNA, parcours cybersécurité.',
      en: 'Stormshield CSNA certification, cybersecurity track.',
    },
  },
  {
    when: { fr: '2024 — 25', en: '2024 — 25' },
    kind: { fr: 'BUT 1 · Réseaux & Télécoms', en: 'Year 1 · Networks & Telecoms' },
    title: { fr: 'IUT d’Aix-Marseille', en: 'IUT Aix-Marseille' },
    text: {
      fr: 'CCNA 1 dès la première année. SAE données Twitter et Capture The Flag.',
      en: 'CCNA 1 in the first year. Twitter data and Capture The Flag coursework.',
    },
  },
  {
    when: { fr: 'Lycée', en: 'High school' },
    kind: { fr: 'Projet de Terminale', en: 'Final-year project' },
    title: { fr: 'Ruche connectée', en: 'Connected beehive' },
    text: {
      fr: 'Premier système IoT de bout en bout, pour un vrai apiculteur.',
      en: 'A first end-to-end IoT system, for a real beekeeper.',
    },
    href: 'ruche-connectee',
  },
  {
    when: { fr: '11 ans', en: 'Age 11' },
    kind: { fr: 'Premier projet', en: 'First project' },
    title: { fr: 'Un convertisseur de langage', en: 'A language converter' },
    text: {
      fr: 'Écrit avec un ami. Le point de départ.',
      en: 'Written with a friend. Where it started.',
    },
  },
];
