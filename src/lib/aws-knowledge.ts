/**
 * AWS Service Knowledge Base - The Anti-Gatekeeping Translation Layer
 *
 * AWS architecture diagrams use proprietary icons and jargon to create
 * an opaque visual language. This knowledge base translates AWS-speak
 * into human-readable terms.
 *
 * THE QUIBBLER for AWS: Expert-level translations that prove you
 * actually understand what these services do (vs. what AWS marketing says).
 */

export interface AWSServiceTranslation {
  awsName: string;
  humanName: string;
  whatItActuallyIs: string;
  icon: string; // description of the AWS icon
  category: 'compute' | 'storage' | 'database' | 'network' | 'security' | 'integration' | 'analytics' | 'ml' | 'management' | 'container';
  commonUseCases: string[];
  alternativeNames: string[]; // what a normal person would call this
}

export const AWS_TRANSLATIONS: Record<string, AWSServiceTranslation> = {
  // === COMPUTE ===
  'ec2': {
    awsName: 'Amazon EC2',
    humanName: 'Virtual Server',
    whatItActuallyIs: 'A virtual computer in the cloud. You rent CPU, RAM, and disk space by the hour.',
    icon: 'Orange box with server rack icon',
    category: 'compute',
    commonUseCases: ['Run a web server', 'Run any software', 'Host an application'],
    alternativeNames: ['VM', 'Virtual Machine', 'Server', 'Instance'],
  },
  'lambda': {
    awsName: 'AWS Lambda',
    humanName: 'Run Code Without a Server',
    whatItActuallyIs: 'Upload a function, it runs when triggered. You pay only when it runs. No server to manage.',
    icon: 'Orange Lambda (λ) symbol',
    category: 'compute',
    commonUseCases: ['Process uploads', 'Handle API requests', 'Run scheduled tasks', 'React to events'],
    alternativeNames: ['Function', 'Serverless function', 'Cloud function'],
  },
  'ecs': {
    awsName: 'Amazon ECS',
    humanName: 'Run Docker Containers',
    whatItActuallyIs: 'Runs your Docker containers. AWS manages the underlying servers.',
    icon: 'Orange hexagon with container boxes',
    category: 'container',
    commonUseCases: ['Run containerized apps', 'Microservices'],
    alternativeNames: ['Container service', 'Docker host'],
  },
  'eks': {
    awsName: 'Amazon EKS',
    humanName: 'Managed Kubernetes',
    whatItActuallyIs: 'Kubernetes cluster managed by AWS. For teams already using Kubernetes.',
    icon: 'Orange wheel/helm icon',
    category: 'container',
    commonUseCases: ['Run Kubernetes workloads', 'Complex container orchestration'],
    alternativeNames: ['K8s', 'Kubernetes'],
  },
  'fargate': {
    awsName: 'AWS Fargate',
    humanName: 'Serverless Containers',
    whatItActuallyIs: 'Run containers without managing servers. Like Lambda but for containers.',
    icon: 'Orange curved container icon',
    category: 'container',
    commonUseCases: ['Run containers without EC2', 'Serverless container workloads'],
    alternativeNames: ['Serverless containers'],
  },
  'elastic-beanstalk': {
    awsName: 'AWS Elastic Beanstalk',
    humanName: 'Easy App Deployment',
    whatItActuallyIs: 'Upload your code, AWS figures out the servers. Like Heroku on AWS.',
    icon: 'Green plant/leaf icon',
    category: 'compute',
    commonUseCases: ['Deploy web apps quickly', 'Avoid infrastructure decisions'],
    alternativeNames: ['PaaS', 'Heroku-like'],
  },
  'lightsail': {
    awsName: 'Amazon Lightsail',
    humanName: 'Simple VPS',
    whatItActuallyIs: 'A simple virtual server with predictable pricing. Like DigitalOcean.',
    icon: 'Orange sail/boat icon',
    category: 'compute',
    commonUseCases: ['Simple websites', 'Small apps', 'Learning AWS'],
    alternativeNames: ['VPS', 'Simple server'],
  },

  // === STORAGE ===
  's3': {
    awsName: 'Amazon S3',
    humanName: 'File Storage',
    whatItActuallyIs: 'Store any file. Infinitely scalable. Pay per GB stored and downloaded.',
    icon: 'Green bucket icon',
    category: 'storage',
    commonUseCases: ['Store images', 'Backups', 'Static website hosting', 'Data lake'],
    alternativeNames: ['Bucket', 'Object storage', 'File storage', 'Blob storage'],
  },
  'ebs': {
    awsName: 'Amazon EBS',
    humanName: 'Server Hard Drive',
    whatItActuallyIs: 'A virtual hard drive that attaches to EC2. Like plugging in an external SSD.',
    icon: 'Green cube/volume icon',
    category: 'storage',
    commonUseCases: ['EC2 storage', 'Database storage', 'Boot volumes'],
    alternativeNames: ['Disk', 'Volume', 'Block storage'],
  },
  'efs': {
    awsName: 'Amazon EFS',
    humanName: 'Shared Network Drive',
    whatItActuallyIs: 'A network file system multiple servers can access. Like a shared network drive.',
    icon: 'Green file system icon',
    category: 'storage',
    commonUseCases: ['Shared storage between servers', 'Content management'],
    alternativeNames: ['NFS', 'Network drive', 'Shared storage'],
  },
  'glacier': {
    awsName: 'Amazon S3 Glacier',
    humanName: 'Cold Archive Storage',
    whatItActuallyIs: 'Super cheap storage for files you rarely access. Retrieval takes hours.',
    icon: 'Blue glacier/ice icon',
    category: 'storage',
    commonUseCases: ['Long-term backups', 'Compliance archives', 'Old data'],
    alternativeNames: ['Archive', 'Cold storage', 'Tape backup replacement'],
  },

  // === DATABASE ===
  'rds': {
    awsName: 'Amazon RDS',
    humanName: 'Managed Database',
    whatItActuallyIs: 'A database AWS manages for you. MySQL, PostgreSQL, etc. with backups handled.',
    icon: 'Blue cylinder with gear',
    category: 'database',
    commonUseCases: ['Production databases', 'SQL databases'],
    alternativeNames: ['Database', 'SQL', 'Relational database'],
  },
  'aurora': {
    awsName: 'Amazon Aurora',
    humanName: 'High-Performance Database',
    whatItActuallyIs: 'AWS\'s custom database. MySQL/PostgreSQL compatible but faster and pricier.',
    icon: 'Blue ring/aurora icon',
    category: 'database',
    commonUseCases: ['High-traffic applications', 'Enterprise databases'],
    alternativeNames: ['Database', 'High-perf SQL'],
  },
  'dynamodb': {
    awsName: 'Amazon DynamoDB',
    humanName: 'NoSQL Database',
    whatItActuallyIs: 'A key-value database that scales infinitely. Fast but requires different thinking.',
    icon: 'Blue tables icon',
    category: 'database',
    commonUseCases: ['Session storage', 'Gaming leaderboards', 'IoT data', 'High-scale apps'],
    alternativeNames: ['NoSQL', 'Key-value store', 'Document database'],
  },
  'elasticache': {
    awsName: 'Amazon ElastiCache',
    humanName: 'In-Memory Cache',
    whatItActuallyIs: 'Redis or Memcached managed by AWS. Stores frequently accessed data in RAM.',
    icon: 'Blue cache icon',
    category: 'database',
    commonUseCases: ['Session storage', 'Database caching', 'Real-time leaderboards'],
    alternativeNames: ['Redis', 'Cache', 'Memcached'],
  },
  'redshift': {
    awsName: 'Amazon Redshift',
    humanName: 'Data Warehouse',
    whatItActuallyIs: 'A database optimized for analytics queries on massive datasets.',
    icon: 'Blue/purple data warehouse icon',
    category: 'analytics',
    commonUseCases: ['Business intelligence', 'Analytics', 'Reporting'],
    alternativeNames: ['Data warehouse', 'Analytics database', 'OLAP'],
  },
  'documentdb': {
    awsName: 'Amazon DocumentDB',
    humanName: 'MongoDB Clone',
    whatItActuallyIs: 'AWS\'s MongoDB-compatible database. Use if you want MongoDB but managed.',
    icon: 'Blue document icon',
    category: 'database',
    commonUseCases: ['MongoDB workloads', 'Document storage'],
    alternativeNames: ['MongoDB', 'Document database'],
  },

  // === NETWORKING ===
  'vpc': {
    awsName: 'Amazon VPC',
    humanName: 'Private Network',
    whatItActuallyIs: 'Your own isolated network in AWS. Like having your own data center network.',
    icon: 'Purple cloud with network',
    category: 'network',
    commonUseCases: ['Network isolation', 'Security boundaries', 'All AWS apps need one'],
    alternativeNames: ['Network', 'Virtual network', 'Private cloud'],
  },
  'cloudfront': {
    awsName: 'Amazon CloudFront',
    humanName: 'CDN',
    whatItActuallyIs: 'Caches your content at edge locations worldwide. Makes websites faster globally.',
    icon: 'Purple globe with nodes',
    category: 'network',
    commonUseCases: ['Fast website delivery', 'Video streaming', 'API acceleration'],
    alternativeNames: ['CDN', 'Content delivery', 'Edge cache'],
  },
  'route53': {
    awsName: 'Amazon Route 53',
    humanName: 'DNS',
    whatItActuallyIs: 'Translates domain names (example.com) to IP addresses. Also handles routing.',
    icon: 'Purple 53 with globe',
    category: 'network',
    commonUseCases: ['Domain management', 'DNS routing', 'Health checks'],
    alternativeNames: ['DNS', 'Domain service'],
  },
  'elb': {
    awsName: 'Elastic Load Balancing',
    humanName: 'Traffic Distributor',
    whatItActuallyIs: 'Spreads incoming traffic across multiple servers. Includes ALB, NLB, etc.',
    icon: 'Purple load balancer icon',
    category: 'network',
    commonUseCases: ['Distribute traffic', 'High availability', 'SSL termination'],
    alternativeNames: ['Load balancer', 'ALB', 'NLB'],
  },
  'api-gateway': {
    awsName: 'Amazon API Gateway',
    humanName: 'API Front Door',
    whatItActuallyIs: 'A managed entry point for your APIs. Handles auth, throttling, routing.',
    icon: 'Purple gateway icon',
    category: 'network',
    commonUseCases: ['REST APIs', 'WebSocket APIs', 'Lambda triggers'],
    alternativeNames: ['API endpoint', 'API manager'],
  },
  'direct-connect': {
    awsName: 'AWS Direct Connect',
    humanName: 'Dedicated Line to AWS',
    whatItActuallyIs: 'A physical fiber connection from your office to AWS. Bypasses the internet.',
    icon: 'Purple direct connection icon',
    category: 'network',
    commonUseCases: ['Enterprise connectivity', 'Hybrid cloud', 'Low latency needs'],
    alternativeNames: ['Dedicated connection', 'Private link'],
  },

  // === SECURITY ===
  'iam': {
    awsName: 'AWS IAM',
    humanName: 'User & Permission Manager',
    whatItActuallyIs: 'Controls who can do what in your AWS account. Users, roles, permissions.',
    icon: 'Red key/person icon',
    category: 'security',
    commonUseCases: ['User management', 'Access control', 'Service permissions'],
    alternativeNames: ['Permissions', 'Access control', 'Identity management'],
  },
  'cognito': {
    awsName: 'Amazon Cognito',
    humanName: 'User Login Service',
    whatItActuallyIs: 'Handles user sign-up, sign-in, and access control for your apps.',
    icon: 'Red brain/person icon',
    category: 'security',
    commonUseCases: ['User authentication', 'Social login', 'Mobile app auth'],
    alternativeNames: ['Auth', 'Login service', 'Auth0 alternative'],
  },
  'kms': {
    awsName: 'AWS KMS',
    humanName: 'Encryption Key Manager',
    whatItActuallyIs: 'Manages encryption keys. Everything encrypted in AWS typically uses KMS.',
    icon: 'Red key icon',
    category: 'security',
    commonUseCases: ['Encryption', 'Key management', 'Secrets'],
    alternativeNames: ['Key management', 'Encryption'],
  },
  'secrets-manager': {
    awsName: 'AWS Secrets Manager',
    humanName: 'Password Vault',
    whatItActuallyIs: 'Securely stores API keys, passwords, and secrets. Rotates them automatically.',
    icon: 'Red lock icon',
    category: 'security',
    commonUseCases: ['Store API keys', 'Database passwords', 'Automatic rotation'],
    alternativeNames: ['Secrets', 'Vault', 'Password manager'],
  },
  'waf': {
    awsName: 'AWS WAF',
    humanName: 'Web Firewall',
    whatItActuallyIs: 'Filters malicious web traffic. Blocks SQL injection, XSS, bots.',
    icon: 'Red shield icon',
    category: 'security',
    commonUseCases: ['Block attacks', 'Rate limiting', 'Bot protection'],
    alternativeNames: ['Firewall', 'Web application firewall'],
  },
  'shield': {
    awsName: 'AWS Shield',
    humanName: 'DDoS Protection',
    whatItActuallyIs: 'Protects against distributed denial of service attacks.',
    icon: 'Red shield icon',
    category: 'security',
    commonUseCases: ['DDoS protection', 'Attack mitigation'],
    alternativeNames: ['DDoS protection'],
  },

  // === MESSAGING & EMAIL ===
  'ses': {
    awsName: 'Amazon SES',
    humanName: 'Email Service',
    whatItActuallyIs: 'Send and receive emails at scale. Transactional emails, marketing, notifications.',
    icon: 'Pink envelope icon',
    category: 'integration',
    commonUseCases: ['Transactional emails', 'Marketing emails', 'Email receiving'],
    alternativeNames: ['Email', 'SMTP', 'SendGrid alternative'],
  },

  // === INTEGRATION ===
  'sqs': {
    awsName: 'Amazon SQS',
    humanName: 'Message Queue',
    whatItActuallyIs: 'A queue for messages between services. Send a message, process it later.',
    icon: 'Pink queue icon',
    category: 'integration',
    commonUseCases: ['Async processing', 'Decoupling services', 'Job queues'],
    alternativeNames: ['Queue', 'Message queue'],
  },
  'sns': {
    awsName: 'Amazon SNS',
    humanName: 'Notification Service',
    whatItActuallyIs: 'Sends notifications to many subscribers at once. Pub/sub messaging.',
    icon: 'Pink bell/notification icon',
    category: 'integration',
    commonUseCases: ['Push notifications', 'Email/SMS alerts', 'Fan-out messages'],
    alternativeNames: ['Notifications', 'Pub/sub', 'Alerts'],
  },
  'eventbridge': {
    awsName: 'Amazon EventBridge',
    humanName: 'Event Router',
    whatItActuallyIs: 'Routes events between AWS services and your apps. Event-driven glue.',
    icon: 'Pink bus/event icon',
    category: 'integration',
    commonUseCases: ['Event-driven architecture', 'Scheduled events', 'Cross-service triggers'],
    alternativeNames: ['Event bus', 'Event router'],
  },
  'step-functions': {
    awsName: 'AWS Step Functions',
    humanName: 'Workflow Orchestrator',
    whatItActuallyIs: 'Chains multiple Lambda functions or services into a workflow with visual designer.',
    icon: 'Pink step/workflow icon',
    category: 'integration',
    commonUseCases: ['Multi-step processes', 'Order processing', 'Data pipelines'],
    alternativeNames: ['Workflow', 'State machine', 'Orchestration'],
  },
  'appsync': {
    awsName: 'AWS AppSync',
    humanName: 'GraphQL API',
    whatItActuallyIs: 'Managed GraphQL service. Connects to databases and APIs with real-time updates.',
    icon: 'Pink sync icon',
    category: 'integration',
    commonUseCases: ['GraphQL APIs', 'Real-time apps', 'Mobile backends'],
    alternativeNames: ['GraphQL', 'Real-time API'],
  },

  // === ANALYTICS ===
  'kinesis': {
    awsName: 'Amazon Kinesis',
    humanName: 'Real-time Data Stream',
    whatItActuallyIs: 'Processes streaming data in real-time. For logs, clicks, IoT data.',
    icon: 'Blue stream icon',
    category: 'analytics',
    commonUseCases: ['Log processing', 'Real-time analytics', 'IoT data'],
    alternativeNames: ['Stream processing', 'Real-time data'],
  },
  'athena': {
    awsName: 'Amazon Athena',
    humanName: 'Query Files with SQL',
    whatItActuallyIs: 'Run SQL queries directly on files in S3. No database needed.',
    icon: 'Purple athena icon',
    category: 'analytics',
    commonUseCases: ['Ad-hoc queries', 'Log analysis', 'Data exploration'],
    alternativeNames: ['SQL on files', 'Serverless SQL'],
  },
  'quicksight': {
    awsName: 'Amazon QuickSight',
    humanName: 'Business Dashboards',
    whatItActuallyIs: 'Create charts and dashboards from your data. Like Tableau but AWS.',
    icon: 'Teal chart icon',
    category: 'analytics',
    commonUseCases: ['Dashboards', 'Reporting', 'Business intelligence'],
    alternativeNames: ['BI tool', 'Dashboards', 'Charts'],
  },
  'glue': {
    awsName: 'AWS Glue',
    humanName: 'ETL Service',
    whatItActuallyIs: 'Extracts, transforms, and loads data between sources. Data pipeline tool.',
    icon: 'Purple glue bottle icon',
    category: 'analytics',
    commonUseCases: ['Data pipelines', 'Data catalogs', 'ETL jobs'],
    alternativeNames: ['ETL', 'Data pipeline'],
  },
  'emr': {
    awsName: 'Amazon EMR',
    humanName: 'Big Data Processing',
    whatItActuallyIs: 'Runs Spark, Hadoop for processing massive datasets.',
    icon: 'Purple cluster icon',
    category: 'analytics',
    commonUseCases: ['Big data', 'Spark jobs', 'Data processing'],
    alternativeNames: ['Spark', 'Hadoop', 'Big data cluster'],
  },

  // === ML/AI ===
  'sagemaker': {
    awsName: 'Amazon SageMaker',
    humanName: 'ML Platform',
    whatItActuallyIs: 'Build, train, and deploy machine learning models.',
    icon: 'Green ML icon',
    category: 'ml',
    commonUseCases: ['Train ML models', 'Deploy models', 'Notebooks'],
    alternativeNames: ['ML', 'Machine learning'],
  },
  'rekognition': {
    awsName: 'Amazon Rekognition',
    humanName: 'Image Recognition',
    whatItActuallyIs: 'Identifies objects, faces, and text in images and videos.',
    icon: 'Green eye icon',
    category: 'ml',
    commonUseCases: ['Face detection', 'Image moderation', 'Object detection'],
    alternativeNames: ['Image AI', 'Computer vision'],
  },
  'comprehend': {
    awsName: 'Amazon Comprehend',
    humanName: 'Text Analysis',
    whatItActuallyIs: 'Extracts sentiment, entities, and meaning from text.',
    icon: 'Green brain icon',
    category: 'ml',
    commonUseCases: ['Sentiment analysis', 'Entity extraction', 'Text classification'],
    alternativeNames: ['NLP', 'Text AI'],
  },
  'polly': {
    awsName: 'Amazon Polly',
    humanName: 'Text to Speech',
    whatItActuallyIs: 'Converts text into lifelike speech.',
    icon: 'Green speaker icon',
    category: 'ml',
    commonUseCases: ['Voice apps', 'Accessibility', 'Audio content'],
    alternativeNames: ['TTS', 'Voice synthesis'],
  },
  'transcribe': {
    awsName: 'Amazon Transcribe',
    humanName: 'Speech to Text',
    whatItActuallyIs: 'Converts audio to text. Transcription service.',
    icon: 'Green waveform icon',
    category: 'ml',
    commonUseCases: ['Transcription', 'Subtitles', 'Voice commands'],
    alternativeNames: ['STT', 'Transcription'],
  },
  'lex': {
    awsName: 'Amazon Lex',
    humanName: 'Chatbot Builder',
    whatItActuallyIs: 'Build conversational chatbots. Same tech as Alexa.',
    icon: 'Green chat icon',
    category: 'ml',
    commonUseCases: ['Chatbots', 'Voice assistants', 'IVR'],
    alternativeNames: ['Chatbot', 'Conversational AI'],
  },
  'bedrock': {
    awsName: 'Amazon Bedrock',
    humanName: 'Foundation Models API',
    whatItActuallyIs: 'Access to Claude, Llama, and other LLMs via API.',
    icon: 'Green AI icon',
    category: 'ml',
    commonUseCases: ['LLM apps', 'Text generation', 'AI assistants'],
    alternativeNames: ['LLM', 'Generative AI', 'Foundation models'],
  },

  // === MEDIA & VIDEO ===
  'mediaconvert': {
    awsName: 'AWS Elemental MediaConvert',
    humanName: 'Video Transcoder',
    whatItActuallyIs: 'Converts video files to different formats and resolutions. Creates HLS/DASH streams.',
    icon: 'Orange film/video icon',
    category: 'integration',
    commonUseCases: ['Video encoding', 'Format conversion', 'Creating streaming formats'],
    alternativeNames: ['Video encoder', 'Transcoder', 'Video converter'],
  },
  'medialive': {
    awsName: 'AWS Elemental MediaLive',
    humanName: 'Live Video Encoder',
    whatItActuallyIs: 'Encodes live video streams in real-time for broadcast and streaming.',
    icon: 'Orange broadcast icon',
    category: 'integration',
    commonUseCases: ['Live streaming', 'Broadcast encoding', 'Live events'],
    alternativeNames: ['Live encoder', 'Live streaming'],
  },
  'mediapackage': {
    awsName: 'AWS Elemental MediaPackage',
    humanName: 'Video Packager & DRM',
    whatItActuallyIs: 'Packages video for delivery with DRM protection and multi-format output.',
    icon: 'Orange package icon',
    category: 'integration',
    commonUseCases: ['DRM packaging', 'Video origin', 'Multi-format delivery'],
    alternativeNames: ['Video packager', 'DRM', 'Video origin'],
  },
  'ivs': {
    awsName: 'Amazon IVS',
    humanName: 'Twitch-style Live Streaming',
    whatItActuallyIs: 'Managed live streaming with <5 second latency. Same tech as Twitch.',
    icon: 'Purple play icon',
    category: 'integration',
    commonUseCases: ['Interactive live streams', 'Low-latency streaming', 'User-generated live content'],
    alternativeNames: ['Live streaming', 'Interactive video', 'Twitch clone'],
  },

  // === MANAGEMENT ===
  'cloudwatch': {
    awsName: 'Amazon CloudWatch',
    humanName: 'Monitoring & Logs',
    whatItActuallyIs: 'Collects logs, metrics, and alarms for all AWS services.',
    icon: 'Pink eye/cloud icon',
    category: 'management',
    commonUseCases: ['Logging', 'Monitoring', 'Alerts'],
    alternativeNames: ['Monitoring', 'Logs', 'Metrics'],
  },
  'cloudformation': {
    awsName: 'AWS CloudFormation',
    humanName: 'Infrastructure as Code',
    whatItActuallyIs: 'Define your entire infrastructure in a template file. Create/destroy with one click.',
    icon: 'Pink stack icon',
    category: 'management',
    commonUseCases: ['Infrastructure automation', 'Reproducible environments'],
    alternativeNames: ['IaC', 'Templates', 'Stacks'],
  },
  'cloudtrail': {
    awsName: 'AWS CloudTrail',
    humanName: 'Activity Log',
    whatItActuallyIs: 'Records every API call made in your AWS account. Audit trail.',
    icon: 'Pink trail/footprint icon',
    category: 'management',
    commonUseCases: ['Audit logs', 'Security monitoring', 'Compliance'],
    alternativeNames: ['Audit log', 'API history'],
  },
  'systems-manager': {
    awsName: 'AWS Systems Manager',
    humanName: 'Server Management',
    whatItActuallyIs: 'Manage EC2 instances at scale. Run commands, patch, configure.',
    icon: 'Pink gear icon',
    category: 'management',
    commonUseCases: ['Server management', 'Patching', 'Configuration'],
    alternativeNames: ['SSM', 'Server management'],
  },
  'config': {
    awsName: 'AWS Config',
    humanName: 'Resource Tracker',
    whatItActuallyIs: 'Tracks changes to your AWS resources over time. Compliance checking.',
    icon: 'Pink config icon',
    category: 'management',
    commonUseCases: ['Change tracking', 'Compliance', 'Resource inventory'],
    alternativeNames: ['Resource history', 'Compliance'],
  },
};

/**
 * AWS ARCHITECTURE PATTERNS
 * Proven architectures by domain - what actually works in production
 */
export type AWSDomain =
  | 'video-streaming'
  | 'web-app'
  | 'api-backend'
  | 'data-pipeline'
  | 'iot'
  | 'ml-inference'
  | 'static-site'
  | 'mobile-backend'
  | 'ecommerce'
  | 'saas-multi-tenant';

export interface AWSPattern {
  name: string;
  description: string;
  services: string[];  // keys from AWS_TRANSLATIONS
  flow: string;  // visual flow description
  whenToUse: string[];
  whenNotToUse: string[];
}

export const AWS_PATTERNS: Record<AWSDomain, AWSPattern[]> = {
  'video-streaming': [
    {
      name: 'VOD Simple',
      description: 'Basic video-on-demand without DRM. Good for internal video, courses, non-premium content.',
      services: ['s3', 'mediaconvert', 'cloudfront', 'cognito', 'dynamodb'],
      flow: 'Upload → S3 (originals) → MediaConvert → S3 (HLS/DASH) → CloudFront (signed URLs) → Player',
      whenToUse: ['Internal training videos', 'Course platforms', 'User-generated content', 'Budget-conscious projects'],
      whenNotToUse: ['Premium content requiring DRM', 'Live streaming', 'Broadcast-quality requirements'],
    },
    {
      name: 'VOD Premium (DRM)',
      description: 'Full DRM-protected video delivery. Netflix/Disney+ level protection.',
      services: ['s3', 'mediaconvert', 'mediapackage', 'cloudfront', 'cognito', 'dynamodb', 'waf'],
      flow: 'Upload → S3 → MediaConvert → MediaPackage (DRM encryption) → CloudFront → Licensed Player',
      whenToUse: ['Premium content', 'Movies/TV shows', 'Content licensing requirements', 'Piracy concerns'],
      whenNotToUse: ['Budget projects (DRM licensing costs)', 'Internal-only video', 'Short-form content'],
    },
    {
      name: 'Live Streaming (Easy)',
      description: 'Twitch-style live streaming with IVS. Sub-5-second latency, managed everything.',
      services: ['ivs', 'cloudfront', 'cognito', 'dynamodb', 'lambda'],
      flow: 'Broadcaster (RTMP) → IVS → CloudFront → Player (IVS SDK)',
      whenToUse: ['Interactive live streams', 'Gaming', 'Creator platforms', 'Fast time-to-market'],
      whenNotToUse: ['Broadcast TV requirements', 'Need full control', '24/7 linear channels'],
    },
    {
      name: 'Live Streaming (Enterprise)',
      description: 'Broadcast-grade live streaming. Full control, multiple outputs, redundancy.',
      services: ['medialive', 'mediapackage', 'cloudfront', 's3', 'cloudwatch'],
      flow: 'Encoder → MediaLive (redundant) → MediaPackage → CloudFront → Players',
      whenToUse: ['Broadcast TV', 'Sports events', '24/7 channels', 'Regulatory requirements'],
      whenNotToUse: ['Simple use cases (use IVS)', 'Budget constraints', 'Small audiences'],
    },
  ],

  'web-app': [
    {
      name: 'Serverless Web App',
      description: 'Classic serverless stack. Scales to zero, pay-per-use.',
      services: ['cloudfront', 's3', 'api-gateway', 'lambda', 'dynamodb', 'cognito'],
      flow: 'User → CloudFront → S3 (static) + API Gateway → Lambda → DynamoDB',
      whenToUse: ['Variable traffic', 'Startups', 'MVPs', 'Cost-sensitive projects'],
      whenNotToUse: ['Predictable high traffic (containers cheaper)', 'Long-running requests', 'WebSocket-heavy'],
    },
    {
      name: 'Container Web App',
      description: 'Fargate-based web app. Predictable performance, easier debugging.',
      services: ['cloudfront', 'elb', 'fargate', 'rds', 'elasticache', 'cognito'],
      flow: 'User → CloudFront → ALB → Fargate → RDS + ElastiCache',
      whenToUse: ['Steady traffic', 'Complex applications', 'Existing containerized apps', 'Need SSH/debugging'],
      whenNotToUse: ['Highly variable traffic (pay for idle)', 'Simple CRUD apps'],
    },
  ],

  'api-backend': [
    {
      name: 'REST API (Serverless)',
      description: 'API Gateway + Lambda. Auto-scaling, pay-per-request.',
      services: ['api-gateway', 'lambda', 'dynamodb', 'cognito', 'cloudwatch'],
      flow: 'Client → API Gateway (auth) → Lambda → DynamoDB',
      whenToUse: ['Public APIs', 'Mobile backends', 'Microservices', 'Variable load'],
      whenNotToUse: ['Requests >30 seconds', 'High sustained load', 'Complex state'],
    },
    {
      name: 'GraphQL API',
      description: 'AppSync for real-time GraphQL with subscriptions.',
      services: ['appsync', 'dynamodb', 'lambda', 'cognito'],
      flow: 'Client → AppSync (GraphQL) → Resolvers → DynamoDB/Lambda',
      whenToUse: ['Mobile apps', 'Real-time features', 'Complex data relationships', 'Offline-first'],
      whenNotToUse: ['Simple REST is enough', 'Team unfamiliar with GraphQL'],
    },
  ],

  'data-pipeline': [
    {
      name: 'Batch ETL',
      description: 'Scheduled data processing with Glue.',
      services: ['s3', 'glue', 'athena', 'quicksight'],
      flow: 'Data sources → S3 (raw) → Glue ETL → S3 (processed) → Athena → QuickSight',
      whenToUse: ['Daily/hourly batch processing', 'Data warehousing', 'BI reporting'],
      whenNotToUse: ['Real-time requirements', 'Sub-minute latency needs'],
    },
    {
      name: 'Real-time Streaming',
      description: 'Kinesis for real-time data ingestion and processing.',
      services: ['kinesis', 'lambda', 'dynamodb', 's3', 'cloudwatch'],
      flow: 'Events → Kinesis Data Streams → Lambda → DynamoDB + S3',
      whenToUse: ['Real-time analytics', 'IoT data', 'Clickstream', 'Log processing'],
      whenNotToUse: ['Batch is acceptable', 'Low volume (Lambda direct is cheaper)'],
    },
  ],

  'iot': [
    {
      name: 'IoT Core',
      description: 'Standard IoT pattern with device shadows and rules.',
      services: ['iot-core', 'lambda', 'dynamodb', 'kinesis', 's3'],
      flow: 'Devices (MQTT) → IoT Core → Rules Engine → Lambda/Kinesis → DynamoDB',
      whenToUse: ['Connected devices', 'Sensor data', 'Device management', 'OTA updates'],
      whenNotToUse: ['Web/mobile only (overkill)', 'Simple webhooks sufficient'],
    },
  ],

  'ml-inference': [
    {
      name: 'Real-time Inference',
      description: 'SageMaker endpoints for low-latency predictions.',
      services: ['api-gateway', 'lambda', 'sagemaker', 's3'],
      flow: 'Request → API Gateway → Lambda → SageMaker Endpoint → Response',
      whenToUse: ['Real-time predictions', 'User-facing ML', 'Low latency required'],
      whenNotToUse: ['Batch predictions (use Batch Transform)', 'Simple models (Lambda-only)'],
    },
    {
      name: 'Serverless Inference',
      description: 'Bedrock for foundation models without infrastructure.',
      services: ['api-gateway', 'lambda', 'bedrock'],
      flow: 'Request → API Gateway → Lambda → Bedrock → Response',
      whenToUse: ['LLM applications', 'Text generation', 'No model training needed'],
      whenNotToUse: ['Custom models required', 'Specific fine-tuning needs'],
    },
  ],

  'static-site': [
    {
      name: 'Static Site + API',
      description: 'Jamstack pattern. Static frontend, serverless API.',
      services: ['s3', 'cloudfront', 'lambda', 'api-gateway', 'dynamodb'],
      flow: 'User → CloudFront → S3 (HTML/JS) + API Gateway → Lambda',
      whenToUse: ['Marketing sites', 'Blogs', 'Documentation', 'Landing pages'],
      whenNotToUse: ['Complex web apps', 'Heavy server-side rendering'],
    },
  ],

  'mobile-backend': [
    {
      name: 'Amplify Stack',
      description: 'Full mobile backend with auth, API, storage.',
      services: ['cognito', 'appsync', 'dynamodb', 's3', 'lambda'],
      flow: 'Mobile App → Cognito (auth) → AppSync (data) + S3 (files)',
      whenToUse: ['React Native/Flutter', 'Offline-first', 'Real-time sync', 'Fast development'],
      whenNotToUse: ['Need full backend control', 'Complex business logic'],
    },
  ],

  'ecommerce': [
    {
      name: 'Serverless Commerce',
      description: 'Scalable e-commerce with event-driven order processing.',
      services: ['cloudfront', 'api-gateway', 'lambda', 'dynamodb', 'sqs', 'ses', 'step-functions'],
      flow: 'Storefront → API → Lambda → DynamoDB + SQS → Step Functions (order flow) → SES',
      whenToUse: ['Variable traffic (sales events)', 'Startups', 'Headless commerce'],
      whenNotToUse: ['Legacy monolith migration', 'Team unfamiliar with serverless'],
    },
  ],

  'saas-multi-tenant': [
    {
      name: 'Pooled Multi-tenant',
      description: 'Shared resources with tenant isolation via partition keys.',
      services: ['cognito', 'api-gateway', 'lambda', 'dynamodb', 'cloudwatch'],
      flow: 'Tenant → Cognito (tenant ID in JWT) → API → Lambda (tenant context) → DynamoDB (tenant partition)',
      whenToUse: ['Many small tenants', 'Cost efficiency', 'Simple isolation needs'],
      whenNotToUse: ['Enterprise tenants needing full isolation', 'Compliance requirements'],
    },
    {
      name: 'Siloed Multi-tenant',
      description: 'Dedicated resources per tenant. Full isolation.',
      services: ['cognito', 'api-gateway', 'lambda', 'rds', 'vpc'],
      flow: 'Tenant → Cognito → Tenant-specific resources (own DB, own Lambda)',
      whenToUse: ['Enterprise customers', 'Compliance/regulatory', 'Performance guarantees'],
      whenNotToUse: ['Many small tenants (cost prohibitive)', 'Simple use cases'],
    },
  ],
};

/**
 * AWS DOMAIN-SPECIFIC GOTCHAS
 * The stuff that will bite you if you don't know
 */
export interface AWSGotcha {
  domain: AWSDomain | 'general';
  severity: 'critical' | 'important' | 'nice-to-know';
  gotcha: string;
  why: string;
  fix: string;
}

export const AWS_GOTCHAS: AWSGotcha[] = [
  // === VIDEO STREAMING ===
  {
    domain: 'video-streaming',
    severity: 'critical',
    gotcha: 'CloudFront egress is your #1 cost for video',
    why: 'Video files are large. $0.085/GB egress adds up to thousands/month with any real viewership.',
    fix: 'Use CloudFront price class (limit regions), enable compression, optimize bitrates, consider CloudFront committed pricing.',
  },
  {
    domain: 'video-streaming',
    severity: 'critical',
    gotcha: 'MediaConvert charges per minute of OUTPUT, not input',
    why: 'If you output 5 renditions (1080p, 720p, 480p, etc.), you pay 5x the minutes.',
    fix: 'Only create renditions you need. Skip 4K unless customers demand it. Use ABR packaging efficiently.',
  },
  {
    domain: 'video-streaming',
    severity: 'important',
    gotcha: 'S3 storage costs are sneaky for video',
    why: 'Original + multiple transcoded versions = 3-5x the original size stored.',
    fix: 'Lifecycle policies: move originals to Glacier after processing, delete unused renditions.',
  },
  {
    domain: 'video-streaming',
    severity: 'important',
    gotcha: 'MediaPackage DRM requires license server agreements',
    why: 'Widevine/FairPlay/PlayReady each need separate license agreements with Google/Apple/Microsoft.',
    fix: 'Use a DRM provider (BuyDRM, PallyCon, EZDRM) who handles licensing, or go with a simpler signed-URL approach.',
  },
  {
    domain: 'video-streaming',
    severity: 'important',
    gotcha: 'HLS vs DASH: pick based on your audience',
    why: 'Apple devices need HLS. Some Android/browsers prefer DASH. Supporting both doubles storage.',
    fix: 'HLS covers 95% of devices. Only add DASH if you have specific requirements.',
  },
  {
    domain: 'video-streaming',
    severity: 'nice-to-know',
    gotcha: 'IVS has a 12-hour stream limit',
    why: 'Designed for interactive streams, not 24/7 channels.',
    fix: 'For 24/7 linear, use MediaLive + MediaPackage instead.',
  },

  // === WEB APP ===
  {
    domain: 'web-app',
    severity: 'critical',
    gotcha: 'Lambda cold starts hurt user experience',
    why: 'First request after idle can add 100ms-3s depending on runtime and VPC config.',
    fix: 'Provisioned Concurrency for critical paths, or use Fargate for consistent latency.',
  },
  {
    domain: 'web-app',
    severity: 'important',
    gotcha: 'API Gateway has a hard 30-second timeout',
    why: 'Cannot be extended. Long operations will fail.',
    fix: 'Return immediately with a job ID, poll for results. Or use Step Functions for long workflows.',
  },
  {
    domain: 'web-app',
    severity: 'important',
    gotcha: 'DynamoDB requires knowing access patterns upfront',
    why: 'No ad-hoc queries like SQL. Wrong key design = table scan = expensive and slow.',
    fix: 'Design keys for your queries first. Use GSIs sparingly. Consider RDS if patterns are unpredictable.',
  },

  // === API BACKEND ===
  {
    domain: 'api-backend',
    severity: 'critical',
    gotcha: 'API Gateway pricing flips at scale',
    why: '$3.50 per million requests seems cheap until you hit 100M requests/month.',
    fix: 'At high scale, ALB + Fargate is cheaper. Crossover is roughly 50-100M requests/month.',
  },
  {
    domain: 'api-backend',
    severity: 'important',
    gotcha: 'Lambda in VPC adds latency and complexity',
    why: 'ENI creation used to add 10-30s cold start (now ~1s with Hyperplane, but still slower).',
    fix: 'Only put Lambda in VPC if it needs to access VPC resources. Most don\'t.',
  },

  // === DATA PIPELINE ===
  {
    domain: 'data-pipeline',
    severity: 'critical',
    gotcha: 'Glue jobs have minimum billing of 10 minutes',
    why: 'Short jobs that run in 30 seconds still pay for 10 minutes of DPUs.',
    fix: 'Batch small jobs together, or use Lambda for quick transforms.',
  },
  {
    domain: 'data-pipeline',
    severity: 'important',
    gotcha: 'Athena scans ALL data unless you partition',
    why: 'Query on 1TB = pay for 1TB scanned. Every time.',
    fix: 'Partition by date/region/common filters. Use columnar formats (Parquet).',
  },

  // === GENERAL ===
  {
    domain: 'general',
    severity: 'critical',
    gotcha: 'NAT Gateway is the silent budget killer',
    why: '$33/month base + $0.045/GB. A busy app can hit $500+/month in NAT alone.',
    fix: 'VPC endpoints for S3/DynamoDB (free). NAT instance for dev. Question if you need NAT at all.',
  },
  {
    domain: 'general',
    severity: 'critical',
    gotcha: 'CloudWatch Logs never delete by default',
    why: 'Retention is set to "Never expire". Logs from 3 years ago are still costing you.',
    fix: 'Set retention policies on ALL log groups. 7-30 days is usually enough.',
  },
  {
    domain: 'general',
    severity: 'important',
    gotcha: 'Cross-AZ data transfer costs money',
    why: '$0.01/GB each direction. High-traffic apps can see $100s/month.',
    fix: 'Keep related services in same AZ when possible. Use AZ-aware load balancing.',
  },
  {
    domain: 'general',
    severity: 'important',
    gotcha: 'RDS runs 24/7 even with zero traffic',
    why: 'Unlike Lambda, you pay for the instance whether it\'s used or not.',
    fix: 'Aurora Serverless v2 for variable workloads. Stop dev instances when not in use.',
  },
  {
    domain: 'general',
    severity: 'nice-to-know',
    gotcha: 'Fargate costs 20-30% more than EC2',
    why: 'Convenience tax. You\'re paying AWS to manage the underlying instances.',
    fix: 'Accept the premium for simplicity, or use EC2 with ECS if cost-sensitive.',
  },
];

/**
 * AWS COST MODELS BY DOMAIN
 * How costs scale for different use cases
 */
export interface AWSCostModel {
  domain: AWSDomain;
  primaryCostDrivers: string[];
  costFormula: string;
  lowTraffic: { description: string; estimate: string };
  mediumTraffic: { description: string; estimate: string };
  highTraffic: { description: string; estimate: string };
  optimizationTips: string[];
}

export const AWS_COST_MODELS: Record<AWSDomain, AWSCostModel> = {
  'video-streaming': {
    primaryCostDrivers: ['CloudFront egress (60-70%)', 'S3 storage (15-20%)', 'MediaConvert (10-15%)', 'Compute (<5%)'],
    costFormula: '(GB delivered × $0.085) + (GB stored × $0.023) + (minutes encoded × $0.015)',
    lowTraffic: { description: '1,000 viewers, 10 videos', estimate: '$50-150/month' },
    mediumTraffic: { description: '50,000 viewers, 100 videos', estimate: '$500-2,000/month' },
    highTraffic: { description: '1M+ viewers, 1000+ videos', estimate: '$10,000-50,000/month' },
    optimizationTips: [
      'CloudFront price class to limit expensive regions',
      'Compress aggressively - viewers won\'t notice on mobile',
      'Glacier for original files after processing',
      'Only create renditions viewers actually use',
    ],
  },
  'web-app': {
    primaryCostDrivers: ['Compute (40-50%)', 'Database (30-40%)', 'Data transfer (10-20%)'],
    costFormula: '(Lambda invocations × $0.0000002) + (DynamoDB RCU/WCU) + (data transfer)',
    lowTraffic: { description: '<10K users/month', estimate: '$10-50/month' },
    mediumTraffic: { description: '10K-100K users/month', estimate: '$100-500/month' },
    highTraffic: { description: '1M+ users/month', estimate: '$2,000-10,000/month' },
    optimizationTips: [
      'DynamoDB on-demand for unpredictable, provisioned for steady',
      'CloudFront for static assets reduces Lambda calls',
      'Lambda ARM (Graviton) is 20% cheaper',
      'Reserved capacity for predictable workloads',
    ],
  },
  'api-backend': {
    primaryCostDrivers: ['API Gateway (40-60%)', 'Lambda (20-30%)', 'Database (20-30%)'],
    costFormula: '(requests × $3.50/million) + (Lambda GB-seconds × $0.0000166667)',
    lowTraffic: { description: '<1M requests/month', estimate: '$5-20/month' },
    mediumTraffic: { description: '1M-50M requests/month', estimate: '$50-300/month' },
    highTraffic: { description: '100M+ requests/month', estimate: '$1,000-5,000/month' },
    optimizationTips: [
      'HTTP APIs are 70% cheaper than REST APIs',
      'Cache responses at API Gateway level',
      'At 50M+ requests, consider ALB + Fargate',
      'Lambda response streaming for large payloads',
    ],
  },
  'data-pipeline': {
    primaryCostDrivers: ['Glue DPUs (50-60%)', 'S3 storage (20-30%)', 'Athena queries (10-20%)'],
    costFormula: '(DPU-hours × $0.44) + (S3 GB × $0.023) + (Athena TB scanned × $5)',
    lowTraffic: { description: 'Daily jobs, <100GB', estimate: '$50-100/month' },
    mediumTraffic: { description: 'Hourly jobs, 1TB', estimate: '$300-800/month' },
    highTraffic: { description: 'Real-time, 10TB+', estimate: '$2,000-10,000/month' },
    optimizationTips: [
      'Partition data to reduce Athena scan costs',
      'Use Parquet/ORC (columnar) for analytics',
      'Glue job bookmarks for incremental processing',
      'Spot instances for non-time-critical jobs',
    ],
  },
  'iot': {
    primaryCostDrivers: ['IoT Core messages (50-60%)', 'Data storage (20-30%)', 'Compute (15-20%)'],
    costFormula: '(messages × $1/million) + (rules triggered × $0.15/million) + storage/compute',
    lowTraffic: { description: '100 devices, 1msg/min', estimate: '$20-50/month' },
    mediumTraffic: { description: '10K devices, 1msg/min', estimate: '$200-500/month' },
    highTraffic: { description: '1M devices', estimate: '$5,000-20,000/month' },
    optimizationTips: [
      'Batch device messages where possible',
      'Use Basic Ingest to skip IoT Core for high-volume data',
      'Timestream for time-series (cheaper than DynamoDB at scale)',
      'Device shadows only for stateful devices',
    ],
  },
  'ml-inference': {
    primaryCostDrivers: ['SageMaker endpoints (70-80%)', 'Data storage (10-15%)', 'API layer (5-10%)'],
    costFormula: '(instance-hours × instance price) + (requests via Bedrock × token pricing)',
    lowTraffic: { description: '<1K inferences/day', estimate: '$50-200/month' },
    mediumTraffic: { description: '10K-100K/day', estimate: '$300-1,500/month' },
    highTraffic: { description: '1M+ inferences/day', estimate: '$3,000-20,000/month' },
    optimizationTips: [
      'Serverless inference for variable/low traffic',
      'Multi-model endpoints to share resources',
      'Bedrock is simpler but can be pricier at scale',
      'Spot instances for batch inference',
    ],
  },
  'static-site': {
    primaryCostDrivers: ['CloudFront (60-70%)', 'S3 (20-30%)', 'Lambda@Edge if used (10%)'],
    costFormula: '(GB delivered × $0.085) + (S3 storage × $0.023) + (requests × $0.0075/10K)',
    lowTraffic: { description: '<100K views/month', estimate: '$1-5/month' },
    mediumTraffic: { description: '1M views/month', estimate: '$20-50/month' },
    highTraffic: { description: '100M views/month', estimate: '$500-2,000/month' },
    optimizationTips: [
      'Enable CloudFront compression',
      'Set long cache TTLs for static assets',
      'Use S3 website hosting for simple cases',
      'CloudFront Functions instead of Lambda@Edge when possible',
    ],
  },
  'mobile-backend': {
    primaryCostDrivers: ['AppSync (40-50%)', 'Cognito (20-30%)', 'DynamoDB (20-30%)'],
    costFormula: '(queries/mutations × $4/million) + (Cognito MAU × $0.0055) + DynamoDB',
    lowTraffic: { description: '<10K MAU', estimate: '$20-100/month' },
    mediumTraffic: { description: '10K-100K MAU', estimate: '$200-1,000/month' },
    highTraffic: { description: '1M+ MAU', estimate: '$5,000-20,000/month' },
    optimizationTips: [
      'Cognito gets cheaper at scale (tiered pricing)',
      'AppSync caching for repeated queries',
      'DynamoDB DAX for read-heavy patterns',
      'S3 Transfer Acceleration for large uploads',
    ],
  },
  'ecommerce': {
    primaryCostDrivers: ['Compute (30-40%)', 'Database (30-40%)', 'CDN/Data transfer (20-30%)'],
    costFormula: 'Highly variable - depends on catalog size, traffic patterns, media',
    lowTraffic: { description: '<1K orders/month', estimate: '$50-200/month' },
    mediumTraffic: { description: '1K-50K orders/month', estimate: '$500-2,000/month' },
    highTraffic: { description: '100K+ orders/month', estimate: '$5,000-30,000/month' },
    optimizationTips: [
      'Cache product pages aggressively',
      'Separate read/write databases',
      'Queue non-critical operations (email, analytics)',
      'Consider RDS Reserved Instances for steady baseline',
    ],
  },
  'saas-multi-tenant': {
    primaryCostDrivers: ['Compute per tenant (40-50%)', 'Shared infrastructure (30-40%)', 'Data isolation overhead (10-20%)'],
    costFormula: 'Base infrastructure + (per-tenant resources if siloed) + data storage per tenant',
    lowTraffic: { description: '10-50 tenants (small)', estimate: '$200-500/month' },
    mediumTraffic: { description: '50-500 tenants', estimate: '$1,000-5,000/month' },
    highTraffic: { description: '1000+ tenants or enterprise', estimate: '$10,000-100,000/month' },
    optimizationTips: [
      'Pooled resources for small tenants, siloed for enterprise',
      'Tenant-aware autoscaling',
      'Charge noisy tenants more',
      'Use tenant ID partitioning in DynamoDB',
    ],
  },
};

/**
 * DOMAIN DETECTION
 * Detect what the user is building from their prompt
 */
export function detectDomain(prompt: string): AWSDomain | null {
  const lowerPrompt = prompt.toLowerCase();

  const domainKeywords: Record<AWSDomain, string[]> = {
    'video-streaming': ['video', 'streaming', 'vod', 'live stream', 'media', 'broadcast', 'hls', 'dash', 'drm', 'netflix', 'youtube', 'twitch'],
    'web-app': ['web app', 'website', 'web application', 'dashboard', 'portal', 'spa', 'single page'],
    'api-backend': ['api', 'backend', 'rest', 'graphql', 'microservice', 'endpoint'],
    'data-pipeline': ['etl', 'data pipeline', 'analytics', 'data warehouse', 'batch processing', 'data lake'],
    'iot': ['iot', 'internet of things', 'sensor', 'device', 'mqtt', 'connected device', 'telemetry'],
    'ml-inference': ['machine learning', 'ml', 'ai', 'inference', 'model', 'prediction', 'llm', 'chatbot'],
    'static-site': ['static site', 'blog', 'landing page', 'marketing site', 'documentation', 'jamstack'],
    'mobile-backend': ['mobile app', 'ios', 'android', 'react native', 'flutter', 'mobile backend'],
    'ecommerce': ['ecommerce', 'e-commerce', 'shop', 'store', 'cart', 'checkout', 'orders', 'products'],
    'saas-multi-tenant': ['saas', 'multi-tenant', 'b2b', 'subscription', 'tenant'],
  };

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        return domain as AWSDomain;
      }
    }
  }

  // Default to web-app if no match
  if (lowerPrompt.includes('app') || lowerPrompt.includes('application')) {
    return 'web-app';
  }

  return null;
}

/**
 * BUILD DOMAIN CONTEXT
 * Get all relevant knowledge for a detected domain
 */
export function buildDomainContext(domain: AWSDomain): string {
  const patterns = AWS_PATTERNS[domain] || [];
  const gotchas = AWS_GOTCHAS.filter(g => g.domain === domain || g.domain === 'general');
  const costModel = AWS_COST_MODELS[domain];

  let context = `\n## DOMAIN: ${domain.toUpperCase()}\n\n`;

  // Patterns
  context += `### PROVEN ARCHITECTURE PATTERNS:\n`;
  for (const pattern of patterns) {
    context += `\n**${pattern.name}**\n`;
    context += `${pattern.description}\n`;
    context += `Services: ${pattern.services.join(' → ')}\n`;
    context += `Flow: ${pattern.flow}\n`;
    context += `Use when: ${pattern.whenToUse.join(', ')}\n`;
    context += `Avoid when: ${pattern.whenNotToUse.join(', ')}\n`;
  }

  // Gotchas
  context += `\n### CRITICAL GOTCHAS (things that will bite you):\n`;
  for (const gotcha of gotchas.filter(g => g.severity === 'critical')) {
    context += `\n⚠️ **${gotcha.gotcha}**\n`;
    context += `Why: ${gotcha.why}\n`;
    context += `Fix: ${gotcha.fix}\n`;
  }

  context += `\n### IMPORTANT GOTCHAS:\n`;
  for (const gotcha of gotchas.filter(g => g.severity === 'important')) {
    context += `• ${gotcha.gotcha} - ${gotcha.fix}\n`;
  }

  // Cost model
  if (costModel) {
    context += `\n### COST MODEL:\n`;
    context += `Primary cost drivers: ${costModel.primaryCostDrivers.join(', ')}\n`;
    context += `Formula: ${costModel.costFormula}\n\n`;
    context += `**Cost estimates:**\n`;
    context += `• Low (${costModel.lowTraffic.description}): ${costModel.lowTraffic.estimate}\n`;
    context += `• Medium (${costModel.mediumTraffic.description}): ${costModel.mediumTraffic.estimate}\n`;
    context += `• High (${costModel.highTraffic.description}): ${costModel.highTraffic.estimate}\n\n`;
    context += `**Optimization tips:**\n`;
    for (const tip of costModel.optimizationTips) {
      context += `• ${tip}\n`;
    }
  }

  return context;
}

// Keep the old AWS_QUIBBLES for backward compatibility, but it's now superseded by AWS_GOTCHAS
export const AWS_QUIBBLES: string[] = AWS_GOTCHAS
  .filter(g => g.severity === 'critical' || g.severity === 'important')
  .map(g => `${g.gotcha}. ${g.fix}`);

/**
 * Build AWS translation context for prompt injection
 */
export function buildAWSContext(detectedServices: string[]): string {
  const translations: string[] = [];

  for (const service of detectedServices) {
    const key = service.toLowerCase().replace(/\s+/g, '-').replace('amazon-', '').replace('aws-', '');
    const translation = AWS_TRANSLATIONS[key];
    if (translation) {
      translations.push(`
**${translation.awsName}** → **${translation.humanName}**
What it actually is: ${translation.whatItActuallyIs}
In plain terms: ${translation.alternativeNames.join(' / ')}`);
    }
  }

  // Add 2-3 relevant quibbles
  const randomQuibbles = AWS_QUIBBLES
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return `
AWS SERVICE TRANSLATIONS:
${translations.join('\n')}

THE QUIBBLER - Things AWS diagrams hide:
${randomQuibbles.map(q => `• ${q}`).join('\n')}
`;
}

/**
 * Detect AWS services from text or image description
 */
export function detectAWSServices(text: string): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase();

  for (const [key, service] of Object.entries(AWS_TRANSLATIONS)) {
    const searchTerms = [
      service.awsName.toLowerCase(),
      key,
      ...service.alternativeNames.map(n => n.toLowerCase())
    ];

    for (const term of searchTerms) {
      if (lowerText.includes(term)) {
        found.push(service.awsName);
        break;
      }
    }
  }

  return [...new Set(found)];
}
