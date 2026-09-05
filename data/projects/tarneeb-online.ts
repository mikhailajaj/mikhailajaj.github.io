import { Project, Technology } from "@/data/schemas/project";

// Tarneeb Online Technologies
const technologies: Record<string, Technology> = {
  // Mobile Frontend
  reactNative: {
    name: "React Native",
    category: "frontend",
    proficiency: "expert",
    icon: "📱",
  },
  react: {
    name: "React",
    category: "frontend",
    proficiency: "expert",
    icon: "⚛️",
  },
  typescript: {
    name: "TypeScript",
    category: "frontend",
    proficiency: "expert",
    icon: "🔷",
  },
  
  // Framework & Tools
  expo: {
    name: "Expo",
    category: "frontend",
    proficiency: "expert",
    icon: "⚡",
  },
  reactNavigation: {
    name: "React Navigation",
    category: "frontend",
    proficiency: "expert",
    icon: "🧭",
  },
  
  // Animation & Graphics
  framerMotion: {
    name: "React Native Reanimated",
    category: "frontend",
    proficiency: "advanced",
    icon: "🎭",
  },
  svg: {
    name: "React Native SVG",
    category: "frontend",
    proficiency: "advanced",
    icon: "🎨",
  },
  
  // State Management
  contextApi: {
    name: "React Context API",
    category: "frontend",
    proficiency: "expert",
    icon: "🔄",
  },
  
  // Testing
  jest: {
    name: "Jest",
    category: "devops",
    proficiency: "expert",
    icon: "🧪",
  },
  reactTestingLibrary: {
    name: "React Native Testing Library",
    category: "devops",
    proficiency: "expert",
    icon: "🔬",
  },
  
  // Deployment
  githubPages: {
    name: "GitHub Pages",
    category: "devops",
    proficiency: "expert",
    icon: "🌐",
  },
  githubActions: {
    name: "GitHub Actions",
    category: "devops",
    proficiency: "expert",
    icon: "⚙️",
  },
};

export const tarneebOnlineProject: Project = {
  id: "tarneeb-online",
  title: "Tarneeb Online - Real-Time Multiplayer Card Game",
  shortTitle: "Tarneeb Online",
  domain: "full-stack",
  description:
    "A fully-featured mobile implementation of Tarneeb, a popular Middle Eastern trick-taking card game, built with React Native and Expo. Features single-player mode with strategic AI opponents, beautiful card animations, and comprehensive game logic.",
  problem:
    "Traditional card games like Tarneeb require physical presence and manual score tracking, limiting accessibility. Players needed a digital solution that preserves the strategic depth and cultural authenticity of the game while providing an engaging mobile experience with intelligent AI opponents.",
  solution:
    "Developed a comprehensive React Native mobile game featuring complete Tarneeb gameplay with bidding, trump selection, and trick-taking mechanics. Implemented strategic AI opponents with sophisticated bidding and play logic, smooth card animations, real-time score tracking, and an intuitive touch-based interface that captures the essence of the traditional game.",
  
  impact: {
    metrics: [
      "Full implementation of traditional Tarneeb rules and gameplay",
      "Strategic AI with intelligent bidding and card play algorithms",
      "Smooth 60 FPS card animations and transitions",
      "Comprehensive test coverage with Jest and React Native Testing Library",
      "Cross-platform support (iOS, Android, Web)",
      "Automated CI/CD pipeline with GitHub Actions",
    ],
    businessValue:
      "Preserves cultural heritage by digitizing a beloved Middle Eastern card game, making it accessible to players worldwide while demonstrating advanced mobile game development and AI decision-making capabilities.",
  },
  
  technologies: [
    technologies.reactNative,
    technologies.react,
    technologies.typescript,
    technologies.expo,
    technologies.reactNavigation,
    technologies.framerMotion,
    technologies.svg,
    technologies.contextApi,
    technologies.jest,
    technologies.reactTestingLibrary,
    technologies.githubPages,
    technologies.githubActions,
  ],
  
  highlights: [
    "React Native 0.73 with Expo 50 for cross-platform mobile development",
    "Strategic AI opponents with advanced bidding and play algorithms",
    "Smooth card animations using React Native Animated API",
    "Finite-state machine for deterministic game flow management",
    "React Navigation for seamless screen transitions",
    "Comprehensive test suite with 70%+ code coverage",
    "Automated CI/CD with GitHub Actions for testing and deployment",
    "Web deployment via GitHub Pages for instant accessibility",
  ],
  
  features: [
    {
      title: "Complete Tarneeb Gameplay",
      items: [
        "Full 4-player partnership card game (North-South vs East-West teams)",
        "Bidding phase with strategic AI decision-making",
        "Trump suit selection by highest bidder",
        "Trick-taking gameplay with proper suit following rules",
        "Anticlockwise turn order (authentic to traditional play)",
        "Round-by-round score tracking and game history",
        "Win condition detection and game completion",
        "Built-in game rules and instructions",
      ],
    },
    {
      title: "Strategic AI Opponents",
      items: [
        "Intelligent bidding strategy based on hand strength",
        "Advanced card play logic with suit following",
        "Strategic trump card usage and conservation",
        "Partnership play coordination (team awareness)",
        "Modular AI system for easy enhancement",
        "Realistic decision-making delays for natural feel",
        "Adaptive strategy based on game state",
      ],
    },
    {
      title: "Beautiful UI/UX",
      items: [
        "Smooth card dealing animations",
        "Intuitive touch-based card selection",
        "Visual feedback for valid/invalid moves",
        "Real-time score display and updates",
        "Trick winner highlighting and collection",
        "Clean, modern card design with SVG graphics",
        "Responsive layout for various screen sizes",
        "Customizable game settings and preferences",
      ],
    },
    {
      title: "Technical Excellence",
      items: [
        "Deterministic game engine with FSM pattern",
        "React Context API for centralized state management",
        "Reducer pattern for predictable state updates",
        "Comprehensive error handling and edge case management",
        "Modular component architecture for maintainability",
        "Performance optimization for smooth 60 FPS gameplay",
        "Unit tests for game logic and AI algorithms",
        "Integration tests for complete game flows",
      ],
    },
  ],
  
  technicalDetails: {
    architecture: "Component-based architecture with centralized state management using React Context and Reducer pattern, modular game engine with separated concerns for UI, logic, and AI",
    highlights: [
      "React Native 0.73 with Expo SDK 50 for modern mobile development",
      "React 18 with concurrent features and automatic batching",
      "TypeScript for type-safe game logic and AI algorithms",
      "React Navigation 6 for stack-based screen management",
      "React Native Animated API for performant card animations",
      "React Native SVG for scalable card graphics",
      "GameReducer pattern for deterministic state transitions",
      "GameStateContext for global game state access",
      "Modular AI system (AiLogic.js, biddingStrategy.js)",
      "PlayEngine for trick resolution and rule enforcement",
      "Jest with React Native Testing Library for comprehensive testing",
      "GitHub Actions workflows for automated testing and builds",
      "Expo web build for browser-based play via GitHub Pages",
    ],
    performance: [
      "60 FPS card animations using native driver",
      "Optimized re-renders with React.memo and useMemo",
      "Efficient state updates with batched actions",
      "Lazy loading of screens with React Navigation",
      "Minimal bundle size with tree shaking",
      "Fast startup time with optimized asset loading",
    ],
  },
  
  links: {
    github: "https://github.com/mikhailajaj/CARDS_HOUSE-react-native-",
    demo: "https://mikhailajaj.github.io/CARDS_HOUSE-react-native-/",
  },
  
  tags: [
    "React Native",
    "React",
    "TypeScript",
    "Expo",
    "Mobile Game Development",
    "Game AI",
    "Card Games",
    "Tarneeb",
    "Mobile Development",
    "Cross-Platform",
    "iOS",
    "Android",
    "Web",
    "Animation",
    "State Management",
    "React Navigation",
    "Jest",
    "Testing",
    "CI/CD",
    "GitHub Actions",
    "GitHub Pages",
    "FSM",
    "Game Engine",
  ],
  
  featured: true,
  status: "completed",
  year: "2026",
  client: "Personal Project",
  role: "Full-Stack & Game Developer",
  teamSize: 1,
  duration: "3 months",
  
  images: [
    {
      src: "/projects/tarneeb-game/02-game-screen-initial.webp",
      alt: "Tarneeb Online game screen before the deal",
      width: 500,
      height: 844,
    },
    {
      src: "/projects/tarneeb-game/06-playing-phase.webp",
      alt: "Tarneeb Online during the playing phase, mid-trick",
      width: 500,
      height: 844,
    },
    {
      src: "/projects/tarneeb-game/04-bidding-modal.webp",
      alt: "Tarneeb Online bidding modal",
      width: 500,
      height: 839,
    },
    {
      src: "/projects/tarneeb-game/09-ai-fix-working.webp",
      alt: "Tarneeb Online AI opponent selecting a card",
      width: 500,
      height: 844,
    },
  ],
};
