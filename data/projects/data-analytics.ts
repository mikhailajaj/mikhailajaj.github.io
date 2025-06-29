import { Project, Technology } from '@/data/schemas/project';

// Data Analytics Technologies
const technologies: Record<string, Technology> = {
  // Programming Languages
  python: {
    name: 'Python',
    category: 'programming',
    proficiency: 'expert',
    icon: '🐍'
  },
  r: {
    name: 'R',
    category: 'programming',
    proficiency: 'advanced',
    icon: '📊'
  },
  sql: {
    name: 'SQL',
    category: 'programming',
    proficiency: 'expert',
    icon: '🗃️'
  },
  
  // Machine Learning & AI
  tensorflow: {
    name: 'TensorFlow',
    category: 'ml',
    proficiency: 'advanced',
    icon: '🧠'
  },
  pytorch: {
    name: 'PyTorch',
    category: 'ml',
    proficiency: 'intermediate',
    icon: '🔥'
  },
  scikitlearn: {
    name: 'Scikit-learn',
    category: 'ml',
    proficiency: 'expert',
    icon: '🤖'
  },
  pandas: {
    name: 'Pandas',
    category: 'ml',
    proficiency: 'expert',
    icon: '🐼'
  },
  numpy: {
    name: 'NumPy',
    category: 'ml',
    proficiency: 'expert',
    icon: '🔢'
  },
  
  // Visualization
  matplotlib: {
    name: 'Matplotlib',
    category: 'visualization',
    proficiency: 'advanced',
    icon: '📈'
  },
  seaborn: {
    name: 'Seaborn',
    category: 'visualization',
    proficiency: 'advanced',
    icon: '🎨'
  },
  plotly: {
    name: 'Plotly',
    category: 'visualization',
    proficiency: 'advanced',
    icon: '📊'
  },
  tableau: {
    name: 'Tableau',
    category: 'visualization',
    proficiency: 'intermediate',
    icon: '📋'
  },
  powerbi: {
    name: 'Power BI',
    category: 'visualization',
    proficiency: 'intermediate',
    icon: '⚡'
  },
  
  // Big Data & Cloud
  spark: {
    name: 'Apache Spark',
    category: 'bigdata',
    proficiency: 'intermediate',
    icon: '⚡'
  },
  hadoop: {
    name: 'Hadoop',
    category: 'bigdata',
    proficiency: 'intermediate',
    icon: '🐘'
  },
  snowflake: {
    name: 'Snowflake',
    category: 'cloud',
    proficiency: 'intermediate',
    icon: '❄️'
  },
  redshift: {
    name: 'AWS Redshift',
    category: 'cloud',
    proficiency: 'intermediate',
    icon: '🔴'
  }
};

export const dataAnalyticsProjects: Project[] = [
  {
    id: 'customer-behavior-analytics-platform',
    title: 'Customer Behavior Analytics Platform',
    domain: 'data-analytics',
    description: 'Built a comprehensive customer behavior analytics platform using Python, machine learning, and real-time data processing to predict customer churn and optimize marketing campaigns.',
    problem: 'An e-commerce company was losing customers at an alarming rate and needed insights into customer behavior patterns to improve retention and optimize marketing spend.',
    solution: 'Developed a machine learning pipeline using Python, Scikit-learn, and Apache Spark to analyze customer data, predict churn probability, and segment customers for targeted marketing. Implemented real-time dashboards using Plotly and deployed on AWS.',
    impact: {
      metrics: [
        '35% reduction in customer churn rate',
        '250% increase in marketing campaign ROI',
        '60% improvement in customer lifetime value',
        '90% accuracy in churn prediction model'
      ],
      businessValue: 'Saved $1.2M annually in customer acquisition costs and increased revenue by $3.5M through improved retention strategies.',
      testimonial: {
        quote: 'The analytics platform transformed how we understand our customers. The churn prediction model alone saved us millions in retention costs.',
        author: 'Sarah Chen',
        position: 'VP of Marketing',
        company: 'RetailMax Inc.'
      }
    },
    technologies: ['python', 'scikitlearn', 'pandas', 'spark', 'plotly', 'sql'],
    featured: true,
    status: 'completed',
    duration: '4 months',
    teamSize: 3,
    role: 'Lead Data Scientist',
    challenges: [
      'Processing 10TB+ of historical customer data',
      'Real-time model inference at scale',
      'Integrating multiple data sources',
      'Building interpretable ML models for business stakeholders'
    ],
    solutions: [
      'Implemented distributed computing with Apache Spark',
      'Built streaming ML pipeline with Apache Kafka',
      'Created unified data lake architecture',
      'Developed SHAP-based model explainability dashboard'
    ],
    results: [
      'Deployed production ML models serving 1M+ predictions daily',
      'Reduced model training time from 8 hours to 45 minutes',
      'Achieved 90% model accuracy with 95% precision',
      'Created automated reporting system saving 20 hours/week'
    ],
    tags: ['Machine Learning', 'Customer Analytics', 'Churn Prediction', 'Real-time Processing'],
    images: [
      '/images/projects/customer-analytics-dashboard.jpg',
      '/images/projects/customer-analytics-pipeline.jpg'
    ],
    liveUrl: 'https://analytics-demo.mikhailajaj.com',
    githubUrl: 'https://github.com/mikhailajaj/customer-analytics-platform',
    caseStudyUrl: '/case-studies/customer-behavior-analytics'
  },
  {
    id: 'financial-fraud-detection-system',
    title: 'Real-time Financial Fraud Detection',
    domain: 'data-analytics',
    description: 'Developed an advanced fraud detection system using deep learning and anomaly detection algorithms to identify suspicious transactions in real-time for a fintech company.',
    problem: 'A fintech startup was experiencing significant losses due to fraudulent transactions and needed an automated system to detect and prevent fraud in real-time without impacting legitimate users.',
    solution: 'Built a multi-layered fraud detection system using ensemble machine learning models, deep neural networks, and graph analytics. Implemented real-time scoring using Apache Kafka and deployed on AWS with auto-scaling capabilities.',
    impact: {
      metrics: [
        '95% fraud detection accuracy',
        '0.1% false positive rate',
        '<100ms transaction processing time',
        '$2.8M prevented fraud losses annually'
      ],
      businessValue: 'Reduced fraud losses by 85% while maintaining seamless user experience, saving $2.8M annually and improving customer trust.',
      testimonial: {
        quote: 'The fraud detection system is incredibly accurate and fast. It has dramatically reduced our losses while keeping our legitimate customers happy.',
        author: 'Michael Rodriguez',
        position: 'CTO',
        company: 'SecureFinance'
      }
    },
    technologies: ['python', 'tensorflow', 'pandas', 'sql', 'spark'],
    featured: true,
    status: 'completed',
    duration: '6 months',
    teamSize: 4,
    role: 'Senior Data Scientist',
    challenges: [
      'Handling highly imbalanced fraud datasets',
      'Real-time model inference under 100ms',
      'Minimizing false positives for user experience',
      'Adapting to evolving fraud patterns'
    ],
    solutions: [
      'Applied SMOTE and ensemble methods for imbalanced data',
      'Optimized model architecture for low-latency inference',
      'Implemented multi-stage validation pipeline',
      'Built continuous learning system with feedback loops'
    ],
    results: [
      'Achieved 95% precision and 92% recall on fraud detection',
      'Reduced transaction processing time to 85ms average',
      'Decreased false positive rate from 2.5% to 0.1%',
      'Implemented automated model retraining pipeline'
    ],
    tags: ['Deep Learning', 'Fraud Detection', 'Real-time Analytics', 'Anomaly Detection'],
    images: [
      '/images/projects/fraud-detection-dashboard.jpg',
      '/images/projects/fraud-detection-architecture.jpg'
    ],
    liveUrl: 'https://fraud-demo.mikhailajaj.com',
    githubUrl: 'https://github.com/mikhailajaj/fraud-detection-system',
    caseStudyUrl: '/case-studies/financial-fraud-detection'
  },
  {
    id: 'supply-chain-optimization-analytics',
    title: 'Supply Chain Optimization Analytics',
    domain: 'data-analytics',
    description: 'Created a comprehensive supply chain analytics solution using predictive modeling and optimization algorithms to reduce costs and improve delivery times for a logistics company.',
    problem: 'A logistics company was struggling with inefficient supply chain operations, leading to high costs, delayed deliveries, and poor inventory management across multiple warehouses.',
    solution: 'Developed predictive models for demand forecasting, route optimization algorithms, and inventory management systems using Python, OR-Tools, and machine learning. Built interactive dashboards for real-time monitoring and decision support.',
    impact: {
      metrics: [
        '25% reduction in logistics costs',
        '40% improvement in delivery times',
        '30% decrease in inventory holding costs',
        '98% demand forecast accuracy'
      ],
      businessValue: 'Optimized supply chain operations resulting in $5.2M annual cost savings and significantly improved customer satisfaction scores.',
      testimonial: {
        quote: 'The analytics platform revolutionized our supply chain operations. We now have complete visibility and control over our logistics network.',
        author: 'Jennifer Park',
        position: 'Operations Director',
        company: 'GlobalLogistics Corp'
      }
    },
    technologies: ['python', 'scikitlearn', 'pandas', 'plotly', 'sql'],
    featured: false,
    status: 'completed',
    duration: '5 months',
    teamSize: 3,
    role: 'Lead Data Scientist',
    challenges: [
      'Integrating data from multiple legacy systems',
      'Handling complex multi-objective optimization',
      'Real-time route optimization at scale',
      'Balancing cost reduction with service quality'
    ],
    solutions: [
      'Built ETL pipelines for data integration',
      'Implemented genetic algorithms for optimization',
      'Created microservices architecture for scalability',
      'Developed multi-criteria decision analysis framework'
    ],
    results: [
      'Optimized routes for 500+ delivery vehicles daily',
      'Reduced average delivery time from 3.2 to 1.9 days',
      'Achieved 98% accuracy in demand forecasting',
      'Implemented automated inventory replenishment system'
    ],
    tags: ['Supply Chain', 'Optimization', 'Predictive Analytics', 'Operations Research'],
    images: [
      '/images/projects/supply-chain-dashboard.jpg',
      '/images/projects/supply-chain-optimization.jpg'
    ],
    githubUrl: 'https://github.com/mikhailajaj/supply-chain-analytics',
    caseStudyUrl: '/case-studies/supply-chain-optimization'
  },
  {
    id: 'healthcare-patient-outcomes-prediction',
    title: 'Healthcare Patient Outcomes Prediction',
    domain: 'data-analytics',
    description: 'Developed machine learning models to predict patient outcomes and optimize treatment plans for a healthcare network, improving patient care and reducing costs.',
    problem: 'A healthcare network needed to improve patient outcomes while reducing costs by predicting which patients were at risk of complications and optimizing treatment protocols.',
    solution: 'Built predictive models using electronic health records, implemented risk stratification algorithms, and created clinical decision support tools. Used ensemble methods and deep learning for outcome prediction.',
    impact: {
      metrics: [
        '20% reduction in readmission rates',
        '15% improvement in patient outcomes',
        '$3.1M reduction in treatment costs',
        '88% accuracy in risk prediction'
      ],
      businessValue: 'Improved patient care quality while reducing healthcare costs, leading to better outcomes for 50,000+ patients annually.',
      testimonial: {
        quote: 'The predictive models have transformed our approach to patient care. We can now identify at-risk patients early and provide targeted interventions.',
        author: 'Dr. Amanda Foster',
        position: 'Chief Medical Officer',
        company: 'Regional Health Network'
      }
    },
    technologies: ['python', 'tensorflow', 'scikitlearn', 'pandas', 'sql'],
    featured: false,
    status: 'completed',
    duration: '8 months',
    teamSize: 5,
    role: 'Senior Data Scientist',
    challenges: [
      'Handling sensitive patient data with HIPAA compliance',
      'Working with incomplete and noisy medical records',
      'Ensuring model interpretability for clinicians',
      'Integrating with existing hospital systems'
    ],
    solutions: [
      'Implemented privacy-preserving ML techniques',
      'Applied advanced imputation and cleaning methods',
      'Built LIME-based model explanation system',
      'Created secure API integration layer'
    ],
    results: [
      'Deployed models across 12 hospital locations',
      'Reduced patient readmission rates by 20%',
      'Achieved 88% accuracy in 30-day outcome prediction',
      'Created automated clinical alert system'
    ],
    tags: ['Healthcare Analytics', 'Predictive Modeling', 'Clinical Decision Support', 'Risk Stratification'],
    images: [
      '/images/projects/healthcare-analytics-dashboard.jpg',
      '/images/projects/patient-outcomes-model.jpg'
    ],
    githubUrl: 'https://github.com/mikhailajaj/healthcare-analytics',
    caseStudyUrl: '/case-studies/healthcare-patient-outcomes'
  }
];

export const getFeaturedDataAnalyticsProjects = () => 
  dataAnalyticsProjects.filter(project => project.featured);

export const getDataAnalyticsProjectsByTag = (tag: string) =>
  dataAnalyticsProjects.filter(project => project.tags.includes(tag));

export const getDataAnalyticsProjectById = (id: string) =>
  dataAnalyticsProjects.find(project => project.id === id);

export const getDataAnalyticsTechnologies = () => Object.values(technologies);

export const getDataAnalyticsStats = () => ({
  totalProjects: dataAnalyticsProjects.length,
  featuredProjects: getFeaturedDataAnalyticsProjects().length,
  technologies: Object.keys(technologies).length,
  domains: ['Machine Learning', 'Business Intelligence', 'Predictive Analytics', 'Data Visualization']
});