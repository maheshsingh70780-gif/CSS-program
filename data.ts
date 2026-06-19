import { SkillTrack, UserProfile } from './types';

export const INITIAL_TRACKS: SkillTrack[] = [
  {
    id: 'track-4',
    trackNumber: 4,
    title: 'Blog Platform with Comments',
    category: 'Full-Stack Development',
    status: 'AVAILABLE',
    dueDate: '29 Jun 2026',
    daysLeft: 25,
    description: 'Develop a professional blogging platform where users can create architectural posts and engage through a modern commenting system. Focus on state management and backend synchronization.',
    keyFeatures: [
      'User registration, login, and secure authentication flows',
      'Full CRUD operations for blog posts',
      'Real-time comment section for user interaction',
      'Backend with RESTful APIs and database integration'
    ],
    expectedOutcome: 'Learn full-stack development with enterprise-level content management features and optimized user interaction models.',
    author: {
      name: 'Sarah Connor',
      avatarInitials: 'SC'
    }
  },
  {
    id: 'track-grid',
    title: 'Mastering CSS Grid Architectures',
    category: 'Frontend Engineering',
    status: 'AVAILABLE',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGHaAqa8AIax-SZkgvXJvFb5jLlaoZMnFx0RlsF-ZezjIr6seQk35UjLsSsDlMLvHRB9R9k9z-rdjRXaF4-qEZU-3cPm1WKvFjNXCxz_APWVh5lD-HMqOWeTg_wNGz4wgLEQ5loeN_g6dX8R5dU-txwqUizX8xuXxfBCAYg6q4Aujl7hecM6_V032gf8hEkUYPx320Z8qSfCOXcfRPb8dczNW0JSMH_DWPjkxfJCBnzA33O5Uwxfc__O7UHeP66S2RoHgwArNgLmo',
    description: 'Learn how to build complex, responsive layouts without the overhead of heavy frameworks. Dive into explicit and implicit grids, alignment, and template areas.',
    author: {
      name: 'Jonas S.',
      avatarInitials: 'JS'
    },
    contentMarkdown: `### Welcome to Grid Mastery
CSS Grid is the most powerful layout system available in CSS. It is a 2-dimensional system, meaning it can handle both columns and rows, unlike Flexbox which is largely a 1-dimensional system.

#### Key Concept 1: Explicit vs. Implicit Grids
- **Explicit Grid**: Defined using properties like \`grid-template-rows\` and \`grid-template-columns\`.
- **Implicit Grid**: Created automatically by the browser when items are placed outside the defined grids.

#### Key Concept 2: Grid Template Areas
This is one of the most intuitive parts of CSS Grid. You can name sections of your layout and arrange them like a map.
\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
}
\`\`\`

#### Grid Playground Interactive Sandbox
Check out how changing grid columns dynamically rearranges items below in your active development workbench. Make responsive interfaces layouts with zero effort!`
  },
  {
    id: 'track-microservices',
    title: 'Microservices Architecture',
    category: 'Cloud Engineering',
    status: 'LOCKED',
    description: "Complete the 'Full-stack Platform' track to unlock advanced infrastructure concepts.",
    expectedOutcome: 'Learn Docker containerization, Kubernetes orchestration, RPC services, Redis caching, and API gate-keeping.',
    author: {
      name: 'Elena Rostova',
      avatarInitials: 'ER'
    }
  },
  {
    id: 'track-react-19',
    title: 'Advanced React 19 State Architecture',
    category: 'Frontend Engineering',
    status: 'COMPLETED',
    description: 'Unlock state management patterns using modern custom hooks, React compiler, server components integration, and performance optimization.',
    dueDate: '10 May 2026',
    keyFeatures: [
      'Understand useActionState for secure forms',
      'Configure optimized use() hook context access',
      'Eliminate traditional re-render bottlenecks'
    ],
    expectedOutcome: 'A real-time state engine implementation with sub-millisecond paint loops.',
    author: {
      name: 'Dan A.',
      avatarInitials: 'DA'
    },
    submissionDetails: {
      repoUrl: 'https://github.com/maheshsingh70780/advanced-react-comp',
      demoUrl: 'https://react-state-engine.vercel.app',
      notes: 'Implemented using React 19 useTransition and useActionState. Achieved 98% render index optimizations.',
      submittedAt: '2026-05-10T14:32:00Z'
    }
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Mahesh Singh',
  email: 'maheshsingh70780@gmail.com',
  bio: 'Fullstack developer exploring hands-on skill tracks and mastering modern web technologies. Focuses on system architecture and high-performance design.',
  xp: 1240,
  completedCount: 1,
  streakDays: 4,
  joinedDate: 'Mar 2026',
  skills: [
    { name: 'TypeScript', level: 85, color: '#004ac6' },
    { name: 'React 19', level: 90, color: '#2563eb' },
    { name: 'CSS Grid & Flexbox', level: 75, color: '#6a1edb' },
    { name: 'Fullstack APIs', level: 60, color: '#8343f4' }
  ]
};
