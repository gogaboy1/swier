const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('🌱 Начинаем заполнение базы данных...');
console.log('📍 Путь к БД:', dbPath);

const startups = [
  // RUSSIA - 8 стартапов
  {
    name: 'ФинТех Платформа',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=400&fit=crop',
    shortDescription: 'Современная платформа для управления финансами малого бизнеса. Автоматизация бухгалтерии и платежей.',
    longDescription: 'ФинТех Платформа — это комплексное решение для малого и среднего бизнеса в России. Мы предлагаем автоматизацию бухгалтерского учета, интеграцию с банками, управление платежами и финансовую аналитику в реальном времени.\n\nНаша платформа помогает предпринимателям экономить до 20 часов в неделю на рутинных финансовых операциях. Мы используем AI для автоматической категоризации транзакций и прогнозирования денежных потоков.\n\nУже более 5000 компаний доверяют нам управление своими финансами. Присоединяйтесь к экосистеме современного финансового менеджмента.',
    geo: 'Russia',
    stage: 'seed',
    tags: 'FinTech, SaaS, B2B, Автоматизация',
    telegramUsername: '@fintechplatform',
    email: 'hello@fintechplatform.ru',
    whatsappPhone: '+79123456789',
    website: 'https://fintechplatform.ru',
    status: 'approved',
    isFeatured: 1
  },
  {
    name: 'ОбразовариУМ',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
    shortDescription: 'Онлайн-платформа для изучения IT-профессий с персональным ментором и гарантией трудоустройства.',
    longDescription: 'ОбразовариУМ — это EdTech платформа нового поколения для обучения востребованным IT-специальностям. Мы предлагаем интерактивные курсы по программированию, дизайну, аналитике данных и digital-маркетингу.\n\nКаждому студенту назначается персональный ментор из ведущих IT-компаний. Наша методика основана на практических проектах — вы создаете реальные продукты для портфолио.\n\nМы гарантируем трудоустройство или возвращаем деньги. 87% наших выпускников находят работу в течение 3 месяцев после окончания курса. Средняя зарплата выпускника — 120 000 рублей.',
    geo: 'Russia',
    stage: 'growth',
    tags: 'EdTech, Образование, IT, Онлайн-курсы',
    telegramUsername: '@obrazovarum',
    email: 'info@obrazovarum.ru',
    whatsappPhone: '+79234567890',
    website: 'https://obrazovarum.ru',
    status: 'approved',
    isFeatured: 0
  },
  {
    name: 'МаркетМастер',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop',
    shortDescription: 'Маркетплейс для локальных производителей. Продавайте продукты напрямую покупателям без посредников.',
    longDescription: 'МаркетМастер соединяет локальных производителей продуктов питания с покупателями в вашем городе. Фермеры, пекарни, сыроварни и другие малые производители могут продавать свою продукцию напрямую, минуя крупные сети.\n\nМы обеспечиваем логистику, платежи и маркетинг. Покупатели получают свежие, качественные продукты с доставкой на дом. Производители получают справедливую цену за свой труд.\n\nУже работаем в 15 городах России. Более 500 производителей и 50 000 довольных покупателей. Поддерживаем локальный бизнес и здоровое питание.',
    geo: 'Russia',
    stage: 'seed',
    tags: 'E-commerce, Marketplace, Продукты, Локальный бизнес',
    telegramUsername: '@marketmaster',
    email: 'support@marketmaster.ru',
    whatsappPhone: null,
    website: 'https://marketmaster.ru',
    status: 'pending',
    isFeatured: 0
  },
  {
    name: 'ЗдоровьеПро',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop',
    shortDescription: 'Телемедицина и мониторинг здоровья. Консультации врачей онлайн и AI-анализ симптомов 24/7.',
    longDescription: 'ЗдоровьеПро — это комплексная платформа для управления здоровьем. Получайте консультации лицензированных врачей онлайн в любое время суток. Наш AI-ассистент помогает оценить симптомы и дает рекомендации.\n\nМониторьте показатели здоровья через интеграцию с фитнес-браслетами и умными весами. Ведите дневник приема лекарств, получайте напоминания. Храните всю медицинскую историю в одном месте.\n\nБолее 100 000 пользователей доверяют нам заботу о своем здоровье. Средняя оценка врачей — 4.8/5. Первая консультация бесплатно.',
    geo: 'Russia',
    stage: 'growth',
    tags: 'HealthTech, Телемедицина, AI, Mobile',
    telegramUsername: '@zdorovyepro',
    email: 'care@zdorovyepro.ru',
    whatsappPhone: '+79345678901',
    website: 'https://zdorovyepro.ru',
    status: 'approved',
    isFeatured: 0
  },
  {
    name: 'AI Копирайтер',
    logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop',
    shortDescription: 'Генерация текстов для бизнеса с помощью AI. Создавайте контент для соцсетей, блогов и рекламы за минуты.',
    longDescription: 'AI Копирайтер — это мощный инструмент для создания качественного контента с использованием искусственного интеллекта. Генерируйте посты для соцсетей, статьи для блога, рекламные тексты и email-рассылки.\n\nНаша нейросеть обучена на миллионах успешных текстов и понимает специфику российского рынка. Поддержка разных тонов голоса и стилей. Проверка на уникальность и SEO-оптимизация включены.\n\nЭкономьте до 80% времени на создании контента. Более 10 000 маркетологов и предпринимателей уже используют наш сервис. Попробуйте бесплатно — 10 000 символов в подарок.',
    geo: 'Russia',
    stage: 'pre-seed',
    tags: 'AI, SaaS, Контент, Маркетинг',
    telegramUsername: '@aicopywriter',
    email: 'hello@aicopywriter.ru',
    whatsappPhone: null,
    website: 'https://aicopywriter.ru',
    status: 'approved',
    isFeatured: 1
  },
  {
    name: 'ГеймДев Студия',
    logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop',
    shortDescription: 'Разработка мобильных игр для российского рынка. Казуальные игры с монетизацией и аналитикой.',
    longDescription: 'ГеймДев Студия создает увлекательные мобильные игры для российской аудитории. Мы специализируемся на казуальных играх с простой механикой и глубоким геймплеем.\n\nНаши игры уже скачали более 5 миллионов раз. Средний retention на 7 день — 25%. Мы используем собственную аналитическую платформу для оптимизации монетизации и пользовательского опыта.\n\nСейчас работаем над новой игрой в жанре match-3 с элементами строительства города. Ищем инвестиции для масштабирования команды и маркетинга.',
    geo: 'Russia',
    stage: 'seed',
    tags: 'Gaming, Mobile, Разработка, Развлечения',
    telegramUsername: '@gamedevstudio',
    email: 'team@gamedevstudio.ru',
    whatsappPhone: '+79456789012',
    website: null,
    status: 'pending',
    isFeatured: 0
  },
  {
    name: 'СмартЛогистика',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=400&fit=crop',
    shortDescription: 'SaaS для оптимизации доставки. AI-маршрутизация, трекинг в реальном времени, интеграция с маркетплейсами.',
    longDescription: 'СмартЛогистика — это платформа для автоматизации процессов доставки для интернет-магазинов и курьерских служб. Наш AI оптимизирует маршруты курьеров, учитывая пробки, приоритеты заказов и загрузку.\n\nИнтеграция с Wildberries, Ozon, Яндекс.Маркет и другими площадками. Автоматическое распределение заказов между курьерами. Трекинг в реальном времени для клиентов.\n\nНаши клиенты экономят до 30% на логистике и увеличивают скорость доставки на 40%. Работаем с компаниями от 100 до 10 000 заказов в день.',
    geo: 'Russia',
    stage: 'growth',
    tags: 'SaaS, Логистика, AI, B2B',
    telegramUsername: '@smartlogistics',
    email: 'sales@smartlogistics.ru',
    whatsappPhone: null,
    website: 'https://smartlogistics.ru',
    status: 'approved',
    isFeatured: 0
  },
  {
    name: 'ЭкоДом',
    logo: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=400&fit=crop',
    shortDescription: 'Маркетплейс экологичных товаров для дома. Только проверенные производители и натуральные материалы.',
    longDescription: 'ЭкоДом — это онлайн-магазин экологичных товаров для дома и быта. Мы тщательно отбираем производителей, которые используют натуральные материалы и заботятся об окружающей среде.\n\nВ нашем каталоге: бытовая химия без химии, многоразовые товары, органическая косметика, экологичная посуда и текстиль. Каждый товар имеет сертификаты и подробное описание состава.\n\nМы компенсируем углеродный след от доставки, сажая деревья. Уже посадили более 10 000 деревьев. Присоединяйтесь к движению осознанного потребления.',
    geo: 'Russia',
    stage: 'pre-seed',
    tags: 'E-commerce, Экология, Marketplace, Товары для дома',
    telegramUsername: null,
    email: 'info@ecodom.ru',
    whatsappPhone: '+79567890123',
    website: 'https://ecodom.ru',
    status: 'pending',
    isFeatured: 0
  },
  // WORLDWIDE - 7 стартапов
  {
    name: 'CryptoWallet Pro',
    logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop',
    shortDescription: 'Secure multi-chain crypto wallet with DeFi integration. Manage Bitcoin, Ethereum, and 100+ cryptocurrencies.',
    longDescription: 'CryptoWallet Pro is a next-generation cryptocurrency wallet that supports over 100 blockchains. Store, send, and receive crypto with bank-level security. Built-in hardware wallet support and biometric authentication.\n\nSeamlessly interact with DeFi protocols — stake, swap, and provide liquidity directly from the wallet. Real-time portfolio tracking with profit/loss analytics. NFT gallery included.\n\nTrusted by over 2 million users worldwide. Non-custodial — you own your private keys. Available on iOS, Android, and browser extension.',
    geo: 'Worldwide',
    stage: 'growth',
    tags: 'Crypto, Blockchain, DeFi, FinTech',
    telegramUsername: '@cryptowalletpro',
    email: 'support@cryptowalletpro.io',
    whatsappPhone: null,
    website: 'https://cryptowalletpro.io',
    status: 'approved',
    isFeatured: 0
  },
  {
    name: 'BioTech Labs',
    logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=400&fit=crop',
    shortDescription: 'Personalized medicine through DNA analysis. Get health insights and custom supplement recommendations.',
    longDescription: 'BioTech Labs offers comprehensive DNA testing and analysis for personalized health optimization. Our advanced genomic sequencing reveals your predispositions to diseases, optimal diet, fitness regimen, and medication responses.\n\nReceive a detailed report with actionable insights. Our AI analyzes over 700,000 genetic markers. Get personalized supplement and nutrition recommendations based on your unique genetic profile.\n\nPartner with leading research institutions. HIPAA compliant and privacy-focused. Over 50,000 customers have discovered their genetic blueprint with us.',
    geo: 'Worldwide',
    stage: 'seed',
    tags: 'BioTech, HealthTech, AI, Персонализация',
    telegramUsername: '@biotechlabs',
    email: 'hello@biotechlabs.com',
    whatsappPhone: '+1234567890',
    website: 'https://biotechlabs.com',
    status: 'approved',
    isFeatured: 0
  },
  {
    name: 'AI Code Assistant',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop',
    shortDescription: 'AI-powered coding companion. Write code faster with intelligent autocomplete and bug detection.',
    longDescription: 'AI Code Assistant is an intelligent coding companion that understands your codebase and helps you write better code faster. Our AI provides context-aware code completions, suggests optimizations, and catches bugs before they happen.\n\nSupports 50+ programming languages and frameworks. Integrates with VS Code, IntelliJ, and other popular IDEs. Learn from millions of open-source repositories.\n\nDevelopers using our tool report 40% faster coding speed and 60% fewer bugs. Trusted by teams at Fortune 500 companies. Free for individual developers.',
    geo: 'Worldwide',
    stage: 'pre-seed',
    tags: 'AI, DevTools, SaaS, Productivity',
    telegramUsername: '@aicodeassist',
    email: 'dev@aicodeassist.dev',
    whatsappPhone: null,
    website: 'https://aicodeassist.dev',
    status: 'approved',
    isFeatured: 0
  },
  {
    name: 'EduGlobal',
    logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop',
    shortDescription: 'Learn languages with native speakers. 1-on-1 video lessons and AI pronunciation coach.',
    longDescription: 'EduGlobal connects language learners with native speakers for personalized 1-on-1 video lessons. Choose from over 50 languages and thousands of qualified teachers. Flexible scheduling and affordable pricing.\n\nOur AI pronunciation coach provides real-time feedback during practice sessions. Gamified learning path keeps you motivated. Track your progress with detailed analytics.\n\nJoin 500,000+ learners from 180 countries. Average student reaches conversational fluency in 3 months. First lesson is free — try it today!',
    geo: 'Worldwide',
    stage: 'growth',
    tags: 'EdTech, AI, Языки, E-learning',
    telegramUsername: null,
    email: 'learn@eduglobal.com',
    whatsappPhone: '+1987654321',
    website: 'https://eduglobal.com',
    status: 'approved',
    isFeatured: 0
  },
  {
    name: 'GreenChain',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop',
    shortDescription: 'Blockchain for carbon credits trading. Transparent marketplace for companies to offset emissions.',
    longDescription: 'GreenChain is a blockchain-based platform for transparent carbon credit trading. Companies can purchase verified carbon offsets to achieve net-zero emissions. Every transaction is recorded on the blockchain for full transparency.\n\nWe partner with verified environmental projects worldwide — reforestation, renewable energy, ocean cleanup. Smart contracts ensure funds go directly to projects. Real-time impact tracking.\n\nHelping 1,000+ companies achieve their sustainability goals. Over 10 million tons of CO2 offset through our platform. Join the fight against climate change.',
    geo: 'Worldwide',
    stage: 'seed',
    tags: 'Blockchain, GreenTech, Sustainability, B2B',
    telegramUsername: '@greenchain',
    email: 'impact@greenchain.earth',
    whatsappPhone: null,
    website: 'https://greenchain.earth',
    status: 'approved',
    isFeatured: 0
  },
  {
    name: 'FitAI Coach',
    logo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
    shortDescription: 'Personal AI fitness trainer. Custom workout plans, form correction, and nutrition tracking.',
    longDescription: 'FitAI Coach is your personal AI-powered fitness trainer that creates customized workout plans based on your goals, fitness level, and available equipment. Our computer vision technology analyzes your form in real-time during exercises.\n\nGet instant feedback on your technique to prevent injuries and maximize results. Track nutrition with AI-powered food recognition — just take a photo. Sync with Apple Health and Google Fit.\n\nOver 1 million workouts completed. Users report 3x better results compared to generic fitness apps. 14-day free trial included.',
    geo: 'Worldwide',
    stage: 'growth',
    tags: 'HealthTech, AI, Fitness, Mobile',
    telegramUsername: '@fitaicoach',
    email: 'support@fitaicoach.app',
    whatsappPhone: null,
    website: 'https://fitaicoach.app',
    status: 'approved',
    isFeatured: 0
  },
  {
    name: 'CloudSecure',
    logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop',
    shortDescription: 'Enterprise cloud security platform. Protect your infrastructure with AI-powered threat detection.',
    longDescription: 'CloudSecure provides comprehensive security for cloud infrastructure. Our AI continuously monitors your AWS, Azure, and GCP environments for vulnerabilities, misconfigurations, and threats.\n\nAutomated compliance checks for SOC 2, ISO 27001, GDPR, and more. Real-time alerts and automated remediation. Detailed security posture dashboard for executives.\n\nTrusted by enterprises managing billions in cloud spend. Detect threats 10x faster than traditional tools. Schedule a demo to see how we can protect your cloud.',
    geo: 'Worldwide',
    stage: 'seed',
    tags: 'SaaS, Security, Cloud, B2B',
    telegramUsername: null,
    email: 'enterprise@cloudsecure.io',
    whatsappPhone: '+1122334455',
    website: 'https://cloudsecure.io',
    status: 'approved',
    isFeatured: 0
  }
];

console.log(`📊 Создаем ${startups.length} стартапов...`);

const insert = db.prepare(`
  INSERT INTO Startup (
    id, name, logo, shortDescription, longDescription, geo, stage, tags,
    telegramUsername, email, whatsappPhone, website, status, isFeatured,
    createdAt, updatedAt
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
  )
`);

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let created = 0;
for (const startup of startups) {
  try {
    insert.run(
      generateUUID(),
      startup.name,
      startup.logo,
      startup.shortDescription,
      startup.longDescription,
      startup.geo,
      startup.stage,
      startup.tags,
      startup.telegramUsername,
      startup.email,
      startup.whatsappPhone,
      startup.website,
      startup.status,
      startup.isFeatured
    );
    created++;
    console.log(`✅ Создан: ${startup.name} (${startup.geo}, ${startup.status})`);
  } catch (error) {
    console.error(`❌ Ошибка при создании ${startup.name}:`, error.message);
  }
}

const stats = {
  total: created,
  russia: startups.filter(s => s.geo === 'Russia').length,
  worldwide: startups.filter(s => s.geo === 'Worldwide').length,
  approved: startups.filter(s => s.status === 'approved').length,
  pending: startups.filter(s => s.status === 'pending').length,
  featured: startups.filter(s => s.isFeatured).length
};

console.log('\n📈 Статистика:');
console.log(`   Всего стартапов: ${stats.total}`);
console.log(`   🇷🇺 Russia: ${stats.russia}`);
console.log(`   🌍 Worldwide: ${stats.worldwide}`);
console.log(`   ✅ Approved: ${stats.approved}`);
console.log(`   ⏳ Pending: ${stats.pending}`);
console.log(`   ⭐ Featured: ${stats.featured}`);
console.log('\n🎉 Заполнение базы данных завершено!');

db.close();
