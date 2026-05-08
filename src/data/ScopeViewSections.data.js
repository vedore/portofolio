export const sections = [
  {
    id: 'about',
    label: 'Specimen 01',
    title: 'About',
    layout: 'about',

    name: 'João Vedor',
    role: 'Software Developer · Bioinformatics Enthusiast',
    photo: '/images/1766444787358.jpeg',

    text: 'A closer look at my background in software development, database systems, and bioinformatics.',

    heading: 'A developer shaped by curiosity, systems, and scientific thinking.',

    detailHeader: 'Made in Portugal',

    detailIntro:
      'I am a software developer shaped by curiosity: how systems work, how data is structured, and how interfaces can make complex ideas easier to understand. My path connects Computer Engineering, full stack development, database infrastructure, and a growing specialization in Bioinformatics.',

    quickFacts: [
      {
        label: 'Origin',
        value: 'Computer Engineering · FCUL',
      },
      {
        label: 'Direction',
        value: 'Software Systems · Bioinformatics',
      },
    ],

    highlights: [
      'Software Development',
      'Bioinformatics',
      'Database Infrastructure',
      'Full Stack Applications',
      'Research-Driven Thinking',
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
      'This page collects the experiments, prototypes, and complete builds that best show how I think through a problem from concept to execution.',

    projects: [
      {
        title: 'Microscope Portfolio',
        type: 'Interactive Portfolio',
        status: 'In Progress',
        year: '2026',
        summary:
          'A portfolio experience built around the idea of looking through a microscope, using spatial navigation, scroll-driven movement, and a scientific visual language.',
        tags: ['React', 'Three.js', 'Tailwind', 'Motion'],
        links: [
          {
            label: 'Thesis Document',
            description: 'Research PDF',
            href: '/documents/thesis.pdf',
            kind: 'document',
          },
          {
            label: 'Source Repository',
            description: 'GitHub Archive',
            href: 'https://github.com/your-username/microscope-portfolio',
            kind: 'github',
          },
        ],
      },
      {
        title: 'CMS Authentication System',
        type: 'Full Stack Application',
        status: 'Prototype',
        year: '2026',
        summary:
          'A login and signup system using Vue, Pinia, Cloudflare Workers, Turnstile validation, and structured backend security checks.',
        tags: ['Vue', 'Pinia', 'Cloudflare Workers', 'Auth'],
        links: [
          {
            label: 'Source Repository',
            description: 'GitHub Archive',
            href: 'https://github.com/your-username/cms-auth-system',
            kind: 'github',
          },
        ],
      },
      {
        title: 'Bioinformatics Studies',
        type: 'Academic / Research Work',
        status: 'Research',
        year: '2026',
        summary:
          'Projects and studies connected to biological data, structured analysis, and the intersection between software engineering and scientific systems.',
        tags: ['Bioinformatics', 'Data', 'Research', 'Systems'],
        links: [
          {
            label: 'Thesis Document',
            description: 'Research PDF',
            href: '/documents/bioinformatics-studies.pdf',
            kind: 'document',
          },
          {
            label: 'Source Repository',
            description: 'GitHub Archive',
            href: 'https://github.com/your-username/bioinformatics-studies',
            kind: 'github',
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
      'This section breaks down the tools, languages, frameworks, and practices I rely on when turning an idea into something usable, readable, and technically solid.',

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
          'Cloudflare Workers',
          'REST APIs',
          'Authentication',
          'Turnstile',
          'JWT Sessions',
          'Docker',
          'Linux',
        ],
      },
      {
        heading: 'Data and Databases',
        note: 'Structured data, querying, persistence, and system organization.',
        skills: [
          'SQL',
          'Oracle',
          'Database Design',
          'Data Modeling',
          'Query Optimization',
          'Bioinformatics Data',
        ],
      },
      {
        heading: 'Creative Development',
        note: 'Visual systems, motion, spatial interfaces, and prototypes.',
        skills: [
          'Three.js',
          'Blender',
          'Motion Design',
          'Interactive Prototypes',
          'Visual Systems',
          'Portfolio Experiments',
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
      'This page is the direct route for conversations, collaborations, project inquiries, or simply continuing the discussion around the work shown in the scope.',

    contactMethods: [
      {
        label: 'Email',
        value: 'your.email@example.com',
        href: 'mailto:your.email@example.com',
        description: 'For project inquiries, collaborations, or direct conversations.',
        kind: 'primary',
      },
      {
        label: 'GitHub',
        value: 'github.com/your-username',
        href: 'https://github.com/your-username',
        description: 'Source code, experiments, and technical work.',
        kind: 'secondary',
      },
      {
        label: 'LinkedIn',
        value: 'linkedin.com/in/your-profile',
        href: 'https://linkedin.com/in/your-profile',
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
