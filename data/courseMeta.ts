export interface CourseAssignment {
  title: string;
  brief?: string;
  link?: string;
}

export interface CourseMeta {
  code: string;
  title?: string;
  description?: string;
  techStack?: string[];
  assignments?: CourseAssignment[];
  resources?: { label: string; href: string }[];
}

export const courseMeta: Record<string, CourseMeta> = {
  // Semester 1 — Programming Principles (PROG10004)
  PROG10004: {
    code: "PROG10004",
    title: "Programming Principles",
    description:
      "Foundation course in programming and problem solving. Build progressively complex object-oriented applications; learn fundamental algorithms, data structures, file I/O, UML, and version control using an industry-standard language (Python).",
    techStack: [
      "Python",
      "Git",
      "IDE Debugger",
      "UML (Visual Paradigm)",
      "Text file I/O (CSV/JSON)",
    ],
    assignments: [
      { title: "Quizzes", brief: "Four quizzes covering fundamentals and core concepts." },
      { title: "Assignments", brief: "Two small and two larger programming assignments." },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Foundations of Python Programming (Runestone eText)", href: "https://runestone.academy/runestone/static/fopp/index.html" },
      { label: "Learning Python (O'Reilly, 5th ed.)", href: "https://www.oreilly.com/library/view/learning-python-5th/9781449355722/" },
    ],
  },

  // Semester 1 — Operating Systems Fundamentals (SYST10082)
  SYST10082: {
    code: "SYST10082",
    title: "Operating Systems Fundamentals",
    description:
      "Introduction to OS structure and concepts with hands-on Linux/Unix: CLI utilities, file systems, shell scripting, processes/threads, editors, and basic OS security.",
    techStack: [
      "Linux/Unix",
      "Bash",
      "Vim/CLI Editors",
      "Regex (grep/egrep)",
      "Python (threads/async)",
    ],
    assignments: [
      { title: "Assignments", brief: "Two OS tasks/projects using CLI and scripting." },
      { title: "Labs", brief: "Two hands-on labs reinforcing shell and OS concepts." },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Operating System Concepts (10th)", href: "https://www.wiley.com/en-us/Operating+System+Concepts%2C+10th+Edition-p-9781119456339" },
      { label: "UNIX The Textbook (3rd)", href: "https://www.routledge.com/UNIX-The-Textbook/Sarwar-Koretsky/p/book/9781482233582" },
    ],
  },

  // Semester 1 — Mathematics for Computing (MATH10025)
  MATH10025: {
    code: "MATH10025",
    title: "Mathematics for Computing",
    description:
      "Discrete mathematics foundations for computer science: number systems, logic and proofs, sets and functions, graphs and trees, fundamentals of algorithms and complexity.",
    techStack: [
      "Discrete Math",
      "Logic & Proofs",
      "Graphs & Trees",
      "Algorithms (basics)",
      "Combinational Circuits (K-maps)",
    ],
    assignments: [
      { title: "Quizzes", brief: "Six short quizzes on core topics." },
      { title: "Assignments", brief: "Two problem-solving assignments." },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Discrete Mathematics and Its Applications (8th)", href: "https://www.mheducation.com/highered/product/discrete-mathematics-its-applications-rosen/M9781259676512.html" },
    ],
  },

  // Semester 1 — Edge to Core: Network Foundations (TELE10025)
  TELE10025: {
    code: "TELE10025",
    title: "Edge to Core: Network Foundations",
    description:
      "Foundational networking: transmission media, analog/digital signals, multiplexing/compression, LAN/WLAN, OSI & TCP/IP models, addressing, routing, DNS/DHCP, VPN and cloud basics.",
    techStack: [
      "OSI Model",
      "TCP/IP",
      "LAN/WLAN",
      "IP Addressing & Subnetting",
      "Routing & DHCP/DNS",
    ],
    assignments: [
      { title: "Quizzes", brief: "Five quizzes across modules." },
      { title: "Assignments", brief: "Three applied exercises (network classification, media, protocol stack)." },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Data Communications and Networking (Forouzan, 6th)", href: "https://www.mheducation.com/highered/product/data-communications-networking-forouzan/M9780073376226.html" },
    ],
  },

  // Semester 1 — Composition and Rhetoric (ENGL17889GD)
  ENGL17889GD: {
    code: "ENGL17889GD",
    title: "Composition and Rhetoric",
    description:
      "Advanced composition focused on argument and persuasion: analyze rhetorical models, integrate primary/secondary sources, construct and present well-supported arguments.",
    techStack: [
      "Rhetoric & Argumentation",
      "Research & Sources",
      "MLA Documentation",
      "Presentation Skills",
    ],
    assignments: [
      { title: "Rhetorical Analysis #1" },
      { title: "Rhetorical Analysis #2" },
      { title: "Exam" },
      { title: "Collaborative Research Project" },
      { title: "Collaborative Research Proposal" },
    ],
    resources: [],
  },

  // Semester 2 — Mobile Computing (INFO10229), Interactive App Dev (PROG10065), Database Modelling (DBAS20146), Linear Algebra (MATH11044)
  INFO10229: {
    code: "INFO10229",
    title: "Mobile Computing",
    description:
      "Foundations of mobile computing: mobile technologies, application paradigms (native/web/hybrid), development environments, and HCI. Intro to iOS tools and current/future trends including mobile and cloud computing.",
    techStack: [
      "Swift",
      "SwiftUI",
      "Xcode",
      "iOS SDK",
      "HCI Guidelines",
      "Mobile + Cloud (overview)",
    ],
    assignments: [
      { title: "Assignments", brief: "4 assignments on mobile fundamentals and HCI" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Swift Documentation", href: "https://swift.org/documentation/" },
      { label: "Apple Developer Documentation", href: "https://developer.apple.com/develop" },
    ],
  },

  PROG10065: {
    code: "PROG10065",
    title: "Interactive Application Development",
    description:
      "Build robust, data-driven interactive applications using object-oriented design principles in an industry-standard framework. Covers GUI development, persistence, debugging, iterative development, and team workflows with VCS.",
    techStack: ["C#", ".NET", "Visual Studio", "XAML", "Git", "Unit Testing"],
    assignments: [
      { title: "Quizzes" },
      { title: "Assignments" },
      { title: "Midterm Exam" },
      { title: "Team Project" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Microsoft Visual C# (Step by Step)", href: "https://www.microsoftpressstore.com/" },
    ],
  },

  DBAS20146: {
    code: "DBAS20146",
    title: "Database Modelling",
    description:
      "Relational data modeling, ERD, normalization to 3NF, SQL/T-SQL queries, stored procedures/functions, cursors, and an introduction to NoSQL.",
    techStack: ["ER Modeling", "SQL", "T-SQL", "Stored Procedures", "Functions", "Triggers", "NoSQL (intro)"],
    assignments: [
      { title: "Assignments", brief: "3 x 10% modeling and SQL/T-SQL tasks" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Modern Database Management", href: "https://www.pearson.com/" },
    ],
  },

  MATH11044: {
    code: "MATH11044",
    title: "Linear Algebra",
    description:
      "Linear algebra foundations: systems of equations, matrices, vector spaces, eigenvalues/eigenvectors, linear transformations, determinants, with applications to computer graphics.",
    techStack: ["Matrices", "Vectors", "Gaussian Elimination", "Vector Spaces", "Eigenvalues/Eigenvectors", "Linear Transformations", "MATLAB"],
    assignments: [
      { title: "Assignments", brief: "2 short problem sets" },
      { title: "Quizzes", brief: "10 short quizzes across the term" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Linear Algebra with Applications (Lyryx, open)", href: "https://lyryx.com/linear-algebra-applications/" },
    ],
  },

  // Semester 3 — Mobile Device App Principles (PROG20082), Programming Languages (PROG24310), Scripting & Web (INFO16206), Computer Systems Architecture (SYST19207)
  PROG20082: {
    code: "PROG20082",
    title: "Mobile Device Application Principles",
    description:
      "Native Android application development with Kotlin and modern Android frameworks. UI design with Jetpack Compose, data/persistence, networking, concurrency with coroutines/flows, dependency injection, and app lifecycle.",
    techStack: [
      "Kotlin",
      "Android Studio",
      "Jetpack Compose",
      "Coroutines",
      "Flow",
      "Room",
      "Hilt",
      "REST/JSON",
    ],
    assignments: [
      { title: "Assignments", brief: "4 app-building assignments" },
      { title: "Quizzes", brief: "2 short quizzes" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Android Developers Training", href: "https://developer.android.com/" },
      { label: "Jetpack Compose Essentials", href: "https://www.payloadmedia.com/" },
    ],
  },

  PROG24310: {
    code: "PROG24310",
    title: "Programming Languages",
    description:
      "Principles and paradigms of modern languages: imperative, object-oriented, functional. Syntax/semantics, type systems, memory management, compilers/interpreters. Practice in C, C++, and a functional language.",
    techStack: ["C", "C++", "Functional (e.g., Haskell/F#/Swift)", "Type Systems", "Semantics", "Compilers/VMs"],
    assignments: [
      { title: "Assignments", brief: "3 programming/problem sets" },
      { title: "Quizzes", brief: "2 quizzes" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [],
  },

  INFO16206: {
    code: "INFO16206",
    title: "Scripting & Web Languages",
    description:
      "Web foundations: HTTP/HTTPS, client/server roles, HTML5, CSS, JavaScript, DOM, AJAX/JSON/XML, and introductory Node.js for server-side scripting.",
    techStack: ["HTML5", "CSS", "JavaScript", "DOM", "AJAX", "Node.js"],
    assignments: [
      { title: "Quizzes", brief: "2 quizzes" },
      { title: "Labs/In-class Exercises", brief: "2 labs" },
      { title: "Midterm Exam" },
      { title: "Assignments", brief: "2 assignments" },
      { title: "Final Exam" },
    ],
    resources: [],
  },

  SYST19207: {
    code: "SYST19207",
    title: "Computer Systems Architecture",
    description:
      "Computer architecture fundamentals: data representation, digital logic, buses/interrupts, ISA vs microarchitecture, assembly programming, and modern multi-core/mobile architectures (ARM).",
    techStack: ["Data Representation", "Digital Logic", "Buses/Interrupts", "Assembly", "CPU/Cache", "ARM Architecture"],
    assignments: [
      { title: "Assignments", brief: "3 x 10%" },
      { title: "Labs", brief: "2 labs" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Computer Architecture: A Quantitative Approach", href: "https://www.elsevier.com/books/computer-architecture/hennessy/978-0-12-811905-1" },
    ],
  },



  // Semester 4 — Mobile Web App Dev (PROG20261), DSA (PROG23672), Web App Design & Impl (PROG27545), InfoSec (INFO23431)
  PROG20261: {
    code: "PROG20261",
    title: "Mobile Web Application Development",
    description:
      "Mobile-friendly web development across devices: responsive design, DOM manipulation, AJAX/WebSockets, device APIs (camera, geolocation, storage), and packaging/publishing hybrid apps.",
    techStack: [
      "HTML5",
      "CSS",
      "JavaScript",
      "Responsive Design",
      "Bootstrap/jQuery/ReactJS",
      "Device APIs (Camera, Geolocation)",
      "AJAX/WebSockets",
      "Cordova/React Native (hybrid)",
    ],
    assignments: [
      { title: "Quizzes", brief: "2 quizzes" },
      { title: "Labs/In-class Exercises", brief: "2 labs" },
      { title: "Assignments", brief: "2 assignments" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Course materials provided by professor", href: "" },
    ],
  },

  PROG23672: {
    code: "PROG23672",
    title: "Data Structures and Algorithms",
    description:
      "Design, analysis, and implementation of data structures and algorithms: stacks/queues, trees, heaps, hash tables, sorting, graph algorithms, and algorithmic paradigms (greedy, divide-and-conquer, DP).",
    techStack: [
      "Algorithm Analysis (Big-O)",
      "Stacks/Queues",
      "Trees (BST, AVL, Red-Black, Splay)",
      "Heaps/Priority Queues",
      "Hash Tables/Skip Lists",
      "Sorting (Merge/Quick/Radix)",
      "Graphs (MST, Shortest Paths)",
    ],
    assignments: [
      { title: "Assignments", brief: "4 x 7.5%" },
      { title: "Quizzes", brief: "5 x 2%" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Algorithm Design (Goodrich & Tamassia)", href: "https://www.wiley.com" },
    ],
  },

  PROG27545: {
    code: "PROG27545",
    title: "Web Application Design & Implementation",
    description:
      "Full-stack Java web development: Java + Spring Boot (MVC, Data JPA, REST), object-relational mapping, testing, and modern Angular front-end (TypeScript, RxJS, NgRx). Deployment and security intro.",
    techStack: [
      "Java",
      "Spring Boot",
      "Spring Data JPA",
      "REST APIs",
      "Angular",
      "TypeScript/RxJS/NgRx",
      "Docker/Cloud (intro)",
    ],
    assignments: [
      { title: "Assignments", brief: "4 assignments" },
      { title: "Quizzes", brief: "2 quizzes" },
      { title: "Midterm Exam (theory/practical)" },
      { title: "Final Exam (theory/practical)" },
    ],
    resources: [
      { label: "Spring Boot and Angular (Packt)", href: "https://www.packtpub.com" },
      { label: "Learning Spring Boot 3.0 (Packt)", href: "https://www.packtpub.com" },
      { label: "Learning Angular (Packt)", href: "https://www.packtpub.com" },
    ],
  },

  INFO23431: {
    code: "INFO23431",
    title: "Introduction to Information Systems Security",
    description:
      "Foundations of information security: risk, threats, cryptography, web security (OWASP Top 10), network security, OS/application security, access control, and security technologies.",
    techStack: [
      "CIA Triad",
      "Cryptography (hashing, MAC/HMAC, PKI)",
      "OWASP Top 10",
      "Network Security",
      "Linux/Windows Security",
      "Access Control",
      "IDS/IPS",
    ],
    assignments: [
      { title: "Quizzes", brief: "4 x 4%" },
      { title: "Labs/In-class Exercises", brief: "2 x 7%" },
      { title: "Assignments", brief: "2 x 10%" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Materials provided by professor", href: "" },
    ],
  },

  // Semester 5 — Advanced Mobile (PROG31975), OS Analysis (SYST30102), Enterprise SW Systems (PROG30000), Software Design (SYST30049), Stats for DS (MATH37198)
  PROG31975: {
    code: "PROG31975",
    title: "Advanced Mobile App Development",
    description:
      "Advanced iOS development using Swift and SwiftUI/UIKit: HIG-driven design, MVVM/MVC patterns, persistence and connectivity, multimedia, widgets/app clips, privacy/security, and watchOS/iPadOS.",
    techStack: [
      "Swift",
      "SwiftUI/UIKit",
      "Xcode",
      "MVVM/MVC",
      "MapKit/CoreLocation/WidgetKit/SpriteKit",
      "JSON/REST",
      "Concurrency",
    ],
    assignments: [
      { title: "Assignments", brief: "4 x 5%" },
      { title: "Midterm Exam" },
      { title: "Project" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Learn SwiftUI (Packt)", href: "https://www.packtpub.com" },
      { label: "Apple Developer Documentation", href: "https://developer.apple.com/develop" },
    ],
  },

  SYST30102: {
    code: "SYST30102",
    title: "Operating Systems Analysis and Design",
    description:
      "OS internals and design: concurrency and IPC, scheduling, memory management and paging, I/O and file systems, protection/security, kernel programming, and real-time/mobile OS concerns.",
    techStack: [
      "Processes/Threads",
      "IPC (semaphores/monitors/pipes/shared memory)",
      "Scheduling",
      "Virtual Memory/Paging",
      "Device Drivers/DMA",
      "Kernel Programming",
      "Security/Protection",
    ],
    assignments: [
      { title: "Assignments", brief: "1@5% + 1@10%" },
      { title: "Labs", brief: "2 x 5%" },
      { title: "Research Paper" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Operating System Concepts (10th)", href: "https://www.wiley.com/en-us/Operating+System+Concepts%2C+10th+Edition-p-9781119456339" },
    ],
  },

  PROG30000: {
    code: "PROG30000",
    title: "Enterprise Software Systems",
    description:
      "Enterprise-grade web systems using .NET/C#: multi-tier and service-oriented architectures, ASP.NET MVC/Web API, EF, WCF, security, load balancing and reliability, deployment to Azure.",
    techStack: [
      "C#",
      ".NET",
      "ASP.NET MVC/Web API",
      "Entity Framework",
      "WCF/SOAP/REST",
      "Azure Deployment",
      "Security (AuthN/AuthZ)",
    ],
    assignments: [
      { title: "Assignments", brief: "4 x 5%" },
      { title: "Team Project" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Pro ASP.NET Core MVC (Apress)", href: "https://link.springer.com/book/10.1007/978-1-4842-3149-4" },
      { label: "Patterns of Enterprise Application Architecture", href: "https://www.informit.com/store/patterns-of-enterprise-application-architecture-9780321127426" },
    ],
  },

  SYST30049: {
    code: "SYST30049",
    title: "Software Design",
    description:
      "Designing extensible, maintainable software systems using design methodologies, UML, architecture styles, and design patterns/anti-patterns; refactoring and case-study driven learning.",
    techStack: [
      "UML",
      "Design Patterns",
      "Anti-Patterns",
      "Architecture Styles",
      "Refactoring",
    ],
    assignments: [
      { title: "Assignments", brief: "2 x 10%" },
      { title: "Paper Outline" },
      { title: "Midterm Exam" },
      { title: "Paper Submissions & Presentation" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Design Patterns (GoF)", href: "https://www.pearson.com/en-us/subject-catalog/p/design-patterns-elements-of-reusable-object-oriented-software/P200000003495/9780201633610" },
      { label: "Agile Principles, Patterns and Practices in C#", href: "https://www.pearson.com" },
    ],
  },

  MATH37198: {
    code: "MATH37198",
    title: "Statistics for Data Science",
    description:
      "Statistics foundations for data science: descriptive stats, probability distributions (binomial, Poisson, normal), sampling, discrete random variables, hypothesis basics, and analysis with statistical software.",
    techStack: [
      "Descriptive Statistics",
      "Probability Distributions",
      "Random Variables",
      "Sampling",
      "Statistical Software",
    ],
    assignments: [
      { title: "Assignments" },
      { title: "Quizzes" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [],
  },


  // Semester 6 — Distributed Mobility (PROG34104), Theory of Computation (INFO47546), HCI (INFO31179), Software Engineering (SYST30025)
  PROG34104: {
    code: "PROG34104",
    title: "Distributed Mobility",
    description:
      "Concurrent and distributed programming for collaborative, cloud-connected mobile apps: synchronization mechanisms, IPC, async design patterns, P2P, and cloud data sync with emphasis on security and resource management.",
    techStack: [
      "Concurrency",
      "Synchronization (semaphores/monitors)",
      "IPC (channels, pipes, shared memory)",
      "Async patterns",
      "P2P Architectures",
      "Cloud Services (IaaS/PaaS/SaaS)",
      "Mobile Cloud Offloading",
    ],
    assignments: [
      { title: "Assignments", brief: "3 x 10%" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
      { title: "Team Project" },
    ],
    resources: [
      { label: "Mobile Cloud Computing (CRC)", href: "https://www.routledge.com/Mobile-Cloud-Computing/De/p/book/9781482242836" },
      { label: "Principles of Concurrent and Distributed Programming", href: "https://www.pearson.com/en-us/subject-catalog/p/principles-of-concurrent-and-distributed-programming/P200000003630/9780321312839" },
    ],
  },

  INFO47546: {
    code: "INFO47546",
    title: "Theory of Computation",
    description:
      "Automata, languages, computability, and complexity: regular/CFGs, PDAs, Turing machines, decidability/undecidability, reductions, classes P/NP, NP-completeness.",
    techStack: [
      "Finite Automata",
      "Regular Expressions",
      "CFGs & PDAs",
      "Turing Machines",
      "Decidability/Reducibility",
      "P vs NP",
      "NP-Completeness",
    ],
    assignments: [
      { title: "Assignments", brief: "2 x 10%" },
      { title: "Quizzes", brief: "4 x 5%" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Introduction to the Theory of Computation (Sipser)", href: "https://www.cengage.com/c/introduction-to-the-theory-of-computation-3e-sipser/9781133187790/" },
    ],
  },

  INFO31179: {
    code: "INFO31179",
    title: "Human Computer Interaction",
    description:
      "HCI foundations and mobile-focused UX: human factors, usability, user-centered design, evaluation methods, gesture/wearables, ubiquitous computing and AR/IoT.",
    techStack: [
      "Usability Heuristics",
      "User & Task Analysis",
      "UCD/Ux Design",
      "Fitts' Law / Hick's Law",
      "Gestural Interaction",
      "Wearables",
      "Ubiquitous Computing / AR / IoT",
    ],
    assignments: [
      { title: "Assignments", brief: "3 x 10%" },
      { title: "Research Paper" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Human-Computer Interaction (Dix et al.)", href: "https://www.pearson.com/en-us/subject-catalog/p/human-computer-interaction/P200000004047/9780130461094" },
      { label: "Usability Engineering (Nielsen)", href: "https://www.elsevier.com/books/usability-engineering/nielsen/978-0-08-052029-2" },
    ],
  },

  SYST30025: {
    code: "SYST30025",
    title: "Software Engineering",
    description:
      "Project-based full lifecycle software engineering: requirements and use-cases, architecture and patterns, implementation and verification, agile/DevOps, estimation and management.",
    techStack: [
      "Use Cases & UML",
      "Architecture Styles & Patterns",
      "Refactoring",
      "Agile/Scrum/TDD",
      "CI/CD & DevOps",
      "Estimation & Project Mgmt",
    ],
    assignments: [
      { title: "Project Proposal" },
      { title: "Project Plan" },
      { title: "SE Project Inception Release" },
      { title: "SE Project Elaboration Release" },
      { title: "Agile Project Mgmt (10 x 1%)" },
      { title: "SE Topical Discussions (5 x 2%)" },
      { title: "Tests", brief: "4 x 10%" },
    ],
    resources: [
      { label: "Software Engineering (Sommerville)", href: "https://www.pearson.com/en-us/subject-catalog/p/software-engineering/P200000003873/9780133943030" },
    ],
  },

  // Semester 7 — Cognitive Computing (PROG48031), Artificial Intelligence (INFO40975), Calculus (MATH29599)
  PROG48031: {
    code: "PROG48031",
    title: "Cognitive Computing",
    description:
      "Cognitive services for mobile: NLP, speech, computer vision, bots, and assistants integrated via cloud AI platforms to build intelligent multi-modal apps.",
    techStack: [
      "NLP (NLU/NLG)",
      "Speech (STT/TTS)",
      "Computer Vision",
      "Chatbots & Bot Frameworks",
      "Cognitive Assistants (Siri/Google/Alexa)",
      "Cloud AI APIs (IBM/MS/Google)",
    ],
    assignments: [
      { title: "Assignments", brief: "5 x 10%" },
      { title: "Seminar Presentation" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Course readings via SLATE", href: "" },
    ],
  },

  INFO40975: {
    code: "INFO40975",
    title: "Artificial Intelligence",
    description:
      "Design and analysis of ML/AI algorithms: decision trees, k-NN, SVM, neural networks/deep learning, genetic algorithms, fuzzy systems, Bayesian methods, clustering, regression.",
    techStack: [
      "Decision Trees",
      "k-NN",
      "SVM",
      "ANN/DNN",
      "Genetic Algorithms",
      "Fuzzy Inference",
      "Naïve Bayes/Bayesian Networks",
      "K-Means/Regression/Logistic",
    ],
    assignments: [
      { title: "Assignments", brief: "4 x 5%" },
      { title: "Midterm Exam" },
      { title: "Research Project Paper" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Artificial Intelligence: A Guide to Intelligent Systems (Negnevitsky)", href: "https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-guide-to-intelligent-systems/P200000006558/9781408225745" },
      { label: "Deep Learning (Goodfellow, Bengio, Courville)", href: "https://www.deeplearningbook.org/" },
    ],
  },

  MATH29599: {
    code: "MATH29599",
    title: "Calculus",
    description:
      "Calculus foundations for CS: functions/limits, derivatives, applications of differentiation, integrals and applications, inverse functions, differential equations, partial derivatives.",
    techStack: [
      "Limits",
      "Differentiation",
      "Integration",
      "Optimization",
      "Differential Equations",
      "Partial Derivatives",
      "MATLAB",
    ],
    assignments: [
      { title: "In-Class Assignments", brief: "Best 10 of 12 x 1%" },
      { title: "Quizzes", brief: "5 x 5%" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Calculus (Stewart, Clegg, Watson) 9th", href: "https://www.cengage.ca/c/calculus-9e-stewart/9781337624183/" },
    ],
  },

  // Semester 8 — Business Intelligence & Data Mining (DBAS40551), Ubiquitous Computing (PROG49332), QA & Software Testing (SYST48557)
  DBAS40551: {
    code: "DBAS40551",
    title: "Business Intelligence and Data Mining",
    description:
      "Data warehousing, OLAP, multidimensional models, ETL, advanced SQL/NoSQL, big data (Hadoop/MapReduce), and data mining techniques for deriving BI with security focus.",
    techStack: [
      "Data Warehouse & OLAP",
      "Multidimensional Models",
      "ETL",
      "Advanced SQL/NoSQL",
      "Hadoop/MapReduce",
      "Data Mining (K-Means/Assoc/DT)",
      "Dashboards/Visualization",
      "Security",
    ],
    assignments: [
      { title: "Assignments", brief: "3 x 10%" },
      { title: "Quizzes", brief: "5 x 3%" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Data Mining: A Tutorial-Based Primer (Roiger)", href: "https://www.routledge.com/Data-Mining-A-Tutorial-Based-Primer-Second-Edition/Roiger/p/book/9781498763974" },
    ],
  },

  PROG49332: {
    code: "PROG49332",
    title: "Ubiquitous Computing",
    description:
      "IoT and ubiquitous HCI: context awareness, sensing/tagging, wearables, smart homes/cities, privacy/security, and ML-driven inference for cloud-connected systems.",
    techStack: [
      "IoT",
      "Wearables",
      "Context-Aware Computing",
      "Wireless/Sensor Networks",
      "Smart Home/City",
      "Edge vs Cloud ML",
      "Security & Privacy",
    ],
    assignments: [
      { title: "Assignments", brief: "10 x 5%" },
      { title: "Research Project Paper" },
      { title: "Research Project Presentation" },
      { title: "Topic Presentation" },
      { title: "Quizzes", brief: "5 x 4%" },
      { title: "Labs" },
    ],
    resources: [
      { label: "Professor-provided readings", href: "" },
    ],
  },

  SYST48557: {
    code: "SYST48557",
    title: "Quality Assurance & Software Testing",
    description:
      "Software QA foundations and testing: black-box/white-box, behavioral and structural techniques, automation/tools, test plans and documentation, V&V across SDLC.",
    techStack: [
      "Black-box/White-box Testing",
      "V&V",
      "Unit/Integration/System/Acceptance",
      "Regression Testing",
      "Coverage & Cyclomatic Complexity",
      "Test Automation",
      "Test Planning & Docs",
    ],
    assignments: [
      { title: "Quizzes", brief: "2 x 5%" },
      { title: "Assignments", brief: "4 x 10%" },
      { title: "Midterm Exam" },
      { title: "Final Exam" },
    ],
    resources: [
      { label: "Pragmatic Software Testing (Black)", href: "https://www.wiley.com/en-us/Pragmatic+Software+Testing-p-9780470127902" },
    ],
  },


  // Example from earlier work — keep as sample for now
  PROG20065: {
    code: "PROG20065",
    title: "Data Structures and Algorithms",
    description:
      "Fundamental data structures and algorithm design with emphasis on complexity analysis and practical implementation.",
    techStack: ["TypeScript", "Node.js", "React"],
    assignments: [
      { title: "Pathfinding Visualizer", brief: "Dijkstra and A* with performance comparisons." },
      { title: "Balanced Trees", brief: "AVL/Red-Black insertion and deletion with rotations." },
    ],
    resources: [
      { label: "Syllabus", href: "" },
      { label: "Lecture Notes", href: "" },
    ],
  },
};

