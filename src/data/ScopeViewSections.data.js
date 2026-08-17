export const sections = [
  {
    id: 'about',
    label: 'Specimen 01',
    title: 'About',
    layout: 'about',

    name: 'João Vedor',
    role: 'Software Developer · Bioinformatics & Biomedical NLP',
    photo: '/images/1766444787358.jpeg',
    cvHref: '/documents/Joao_Vedor_CV.pdf',

    text: 'A closer look at my background in software development, database systems, and bioinformatics.',

    heading: 'Building useful software where systems, data, and biomedical NLP meet.',

    detailHeader: 'Made in Portugal',

    detailIntro:
      'Computer Engineer with a Master’s specialization in Bioinformatics and experience across full-stack development, databases, DevOps, and biomedical entity linking.',

    quickFacts: [
      {
        label: 'Location',
        value: 'Lisbon, Portugal',
      },
      {
        label: 'Education',
        value: 'MSc Computer Engineering · Bioinformatics',
      },
    ],

    experience: [
      {
        role: 'Full-Stack Developer',
        organization: 'Câmara Municipal de Lisboa',
        summary: 'Internal applications, databases, Azure DevOps pipelines, deployment, and support.',
      },
      {
        role: 'IT Specialist Intern',
        organization: 'Câmara Municipal de Lisboa',
        summary: 'Full-stack applications, SQL workflows, deployment, maintenance, and troubleshooting.',
      },
      {
        role: 'Full-Stack Developer',
        organization: 'Inboxsyz Sistemas de Informação',
        summary: 'Node.js and React development, backend integration, GitHub, and Vercel.',
      },
    ],

    education: [
      {
        degree: 'Master’s Degree in Computer Engineering',
        institution: 'Faculty of Sciences, University of Lisbon',
        detail: 'Specialization in Bioinformatics',
        thesis: 'Semantic Indexing of Descriptors, Partitioning and Classification for Mapping Biomedical Entities',
      },
      {
        degree: 'Bachelor’s Degree in Computer Engineering',
        institution: 'Faculty of Sciences, University of Lisbon',
      },
    ],

    highlights: [
      'Full-Stack Development',
      'Bioinformatics',
      'Biomedical NLP',
      'Database Systems',
      'Azure DevOps',
    ],

    focusSteps: [
      {
        title: 'Understand',
        text: 'I start by understanding the system, the data, and the problem behind the application.',
      },
      {
        title: 'Build',
        text: 'I turn ideas into full stack solutions with attention to structure, usability, and maintainability.',
      },
      {
        title: 'Refine',
        text: 'I improve the details through testing, iteration, and a constant interest in learning better ways to solve problems.',
      },
    ],

    detailBlocks: [
      {
        heading: 'Academic Path',
        text: 'Computer Engineering gave me a foundation in software development, data structures, databases, and problem solving. My specialization in Bioinformatics added a scientific layer to how I think about data and complex systems.',
      },
      {
        heading: 'Professional Work',
        text: 'I have worked on full stack applications, database infrastructure, deployment, maintenance, and operational stability, connecting interface work with the systems that support it.',
      },
      {
        heading: 'Mindset',
        text: 'I enjoy projects where research, logic, and visual clarity meet — especially when the goal is to make something complex feel understandable.',
      },
    ],
  },
  {
    id: 'projects',
    label: 'Specimen 02',
    title: 'Projects',
    layout: 'projects',

    text: 'Selected builds, experiments, and case studies presented as focused observations inside the scope view.',

    detailIntro:
      'A selection of experiments, prototypes, and complete builds that show how I take a problem from concept to implementation.',

    projects: [
      {
        title: 'Bioinformatics Studies - XMR4EL',
        type: 'Academic / Research Work',
        status: 'Research',
        year: '2026',
        summary:
          'Master’s thesis work on semantic indexing, descriptor partitioning, and classification for biomedical entity linking.',
        tags: ['Biomedical NLP', 'Entity Linking', 'Ontologies', 'Research'],
        links: [
          {
            label: 'Thesis Document',
            description: 'Research PDF',
            href: 'https://repositorio.ulisboa.pt/entities/publication/5ab3ea28-7a85-40de-91be-dc3afbae1d81',
            kind: 'document',
          },
          {
            label: 'Source Repository',
            description: 'GitHub Archive',
            href: 'https://github.com/lasigeBioTM/XMR4EL',
            kind: 'github',
          },
        ],
      },
      {
        title: 'Sample2Report',
        type: 'CLI toolkit',
        status: 'In Progress',
        year: '2026',
        summary:
          'CLI toolkit that turns common bioinformatics inputs such as FASTA files, sample metadata, count matrices, and gene lists into reproducible analysis reports with validation, summary statistics, plots, and exportable results.',
        tags: ['CLI', 'Python', 'Tooling'],
        links: [
          {
            label: 'Source Repository',
            description: 'Github Archive',
            href: 'https://github.com/vedore/sample2report.git',
            kind: 'github'
          }
        ]
      },
      {
        title: 'Microscope Portfolio',
        type: 'Interactive Portfolio',
        status: 'Stopped (for now)',
        year: '2026',
        summary:
          'A portfolio experience built around the idea of looking through a microscope, using spatial navigation, scroll-driven movement, and a scientific visual language.',
        tags: ['React', 'Three.js', 'Tailwind', 'Motion'],
        links: [
          {
            label: 'Source Repository',
            description: 'GitHub Archive',
            href: 'https://github.com/vedore/portofolio',
            kind: 'github',
          },
        ],
      },
      {
        title: 'scOOD-Benchmark',
        type: 'Single-Cell ML Benchmark',
        status: 'In Progress',
        year: '2026',
        summary:
          'A benchmark project for evaluating how well single-cell foundation models generalize to out-of-distribution data across populations, donors, laboratories, and studies.',
        tags: [
          'Single-Cell RNA-seq',
          'Foundation Models',
          'OOD Generalization',
          'Benchmarking',
        ],
        links: [
          {
            label: 'Source Repository',
            description: 'GitHub Repository',
            href: 'https://github.com/vedore/sc-ood-benchmark',
            kind: 'github',
          },
        ],
      },
      {
        title: 'CMS Riotek System',
        type: 'Full Stack Application',
        status: 'In Progress',
        year: '2026',
        summary:
          'Full CMS system using Vue, Pinia, Cloudflare Workers, AWS Cloud computing, and structured backend security checks.',
        tags: ['Node.js', 'Cloudflare Workers', 'AWS'],
        links: [
          {
            label: 'Website',
            description: 'Website Archive',
            href: 'https://riotekai.vercel.app',
            kind: 'website',
          },
        ],
      },
    ],

    detailBlocks: [
      {
        heading: 'Builds',
        text: 'The strongest projects usually combine narrative, interaction, and implementation quality. I care about how something feels to use, not just how it looks in a static frame.',
      },
      {
        heading: 'Experiments',
        text: 'Alongside finished work, I keep smaller studies and technical experiments that let me test motion, spatial layouts, rendering ideas, and unusual interfaces.',
      },
    ],
  },
  {
    id: 'skills',
    label: 'Specimen 03',
    title: 'Skills',
    layout: 'skills',

    text: 'Tooling, prototyping, software, and craft distilled into a focused technical inventory.',

    detailIntro:
      'The tools, languages, frameworks, and practices I use to turn ideas into software that is usable, readable, and technically solid.',

    skillGroups: [
      {
        heading: 'Frontend Systems',
        note: 'Interfaces, component structure, styling, and interaction.',
        skills: [
          'React',
          'Vue',
          'Vite',
          'Tailwind CSS',
          'SCSS',
          'JavaScript',
          'TypeScript',
          'Responsive UI',
        ],
      },
      {
        heading: 'Backend and Infrastructure',
        note: 'APIs, authentication, databases, and deployment logic.',
        skills: [
          'Node.js',
          'Java',
          'Cloudflare Workers',
          'REST APIs',
          'Authentication',
          'Turnstile',
          'JWT Sessions',
          'Azure DevOps',
          'Docker',
          'Linux',
        ],
      },
      {
        heading: 'Data and Databases',
        note: 'Structured data, querying, persistence, and system organization.',
        skills: [
          'SQL',
          'NoSQL',
          'Oracle',
          'Database Design',
          'Data Modeling',
          'Query Optimization',
          'Ontologies',
          'Knowledge Bases',
          'Bioinformatics Data',
        ],
      },
      {
        heading: 'Data Engineering',
        note: 'Data preparation, analysis, and machine-learning workflows.',
        skills: [
          'Python',
          'PyTorch',
          'Sklearn',
          'Hugging Face',
          'Transformers',
          'LLMs',
          'Biomedical NLP',
          'Entity Linking',
        ],
      },
    ],

    workflow: [
      {
        title: 'Prototype',
        text: 'I test ideas early through layouts, small interactions, and technical experiments.',
      },
      {
        title: 'Structure',
        text: 'I organize components, data, and interfaces so the project can grow without becoming fragile.',
      },
      {
        title: 'Polish',
        text: 'I refine motion, spacing, accessibility, and edge cases until the experience feels stable.',
      },
    ],

    detailBlocks: [
      {
        heading: 'Design and Prototyping',
        text: 'I work comfortably across layout, interaction, typography, and motion, using prototypes to test rhythm and behavior before committing to a final structure.',
      },
      {
        heading: 'Development',
        text: 'On the technical side, I focus on front-end systems, animation, component structure, authentication flows, and the practical details that make an interface stable and maintainable.',
      },
      {
        heading: 'Scientific Thinking',
        text: 'Bioinformatics influences how I approach problems: with attention to data, systems, patterns, and the need to make complex information easier to understand.',
      },
    ],
  },
  {
    id: 'contact',
    label: 'Specimen 04',
    title: 'Contact',
    layout: 'contact',

    text: 'Email, links, and collaboration details revealed as the final field of view inside the lens.',

    detailIntro:
      'A direct route for project inquiries, collaborations, and conversations about the work shown in the scope.',

    contactMethods: [
      {
        label: 'Email',
        value: 'jpvedor123@gmail.com',
        href: 'mailto:jpvedor123@gmail.com',
        description: 'For project inquiries, collaborations, or direct conversations.',
        kind: 'primary',
      },
      {
        label: 'GitHub',
        value: 'github.com/vedore',
        href: 'https://github.com/vedore',
        description: 'Source code, experiments, and technical work.',
        kind: 'secondary',
      },
      {
        label: 'LinkedIn',
        value: 'linkedin.com/in/joão-vedor-7059b8286',
        href: 'https://www.linkedin.com/in/joão-vedor-7059b8286/',
        description: 'Professional profile and academic background.',
        kind: 'secondary',
      },
    ],

    detailBlocks: [
      {
        heading: 'Availability',
        text: 'I am open to projects, collaborations, and conversations that involve software development, bioinformatics, interactive systems, and carefully built visual experiences.',
      },
      {
        heading: 'Reach Out',
        text: 'Use the contact channels above to get in touch. I am especially interested in work that connects technical systems, research, and thoughtful interface design.',
      },
    ],
  },
];

export default sections;
