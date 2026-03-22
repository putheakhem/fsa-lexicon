import { Head, Link } from '@inertiajs/react';
import { 
    ArrowRight,
    Book,
    BookOpen, 
    CheckCircle, 
    ChevronRight,
    Database,
    Globe, 
    Languages, 
    Lock,
    Search, 
    Shield,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';

import { explore, login } from '@/routes';

interface Stats {
    totalTerms: number;
    totalLanguages: number;
    totalSectors: number;
    totalReferences: number;
}

interface Props {
    stats: Stats;
}

const FEATURES = [
    {
        icon: Search,
        title: 'Semantic Search',
        description: 'Advanced AI-powered search to find terms by meaning, not just keywords'
    },
    {
        icon: Languages,
        title: 'Multilingual Support',
        description: 'Complete definitions in Khmer, English, and French for comprehensive understanding'
    },
    {
        icon: Shield,
        title: 'Regulatory Compliance',
        description: 'Authoritative terminology approved by financial authorities and regulators'
    },
    {
        icon: Database,
        title: 'Comprehensive Database',
        description: 'Extensive collection covering FinTech, banking, and financial services'
    },
    {
        icon: Zap,
        title: 'Real-time Updates',
        description: 'Stay current with the latest terminology and regulatory changes'
    },
    {
        icon: Lock,
        title: 'Secure & Reliable',
        description: 'Enterprise-grade security for managing sensitive regulatory content'
    }
];

const SECTORS = [
    'Digital Payment',
    'Blockchain',
    'Lending',
    'InsurTech',
    'RegTech',
    'Cybersecurity',
    'Digital Banking',
    'Investment'
];

export default function Welcome({ stats }: Props) {
    return (
        <>
            <Head title="FSA FinTech Lexicon — Financial Services Authority" />
            <div className="min-h-screen bg-white">
                
                {/* Navigation Header */}
                <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-md">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold leading-none text-neutral-900">
                                        FSA FinTech Lexicon
                                    </span>
                                    <span className="text-xs font-medium text-neutral-500">
                                        Financial Services Authority
                                    </span>
                                </div>
                            </div>
                            
                            <nav className="hidden items-center space-x-8 md:flex">
                                <a href="#features" className="text-sm font-medium text-neutral-600 transition-colors hover:text-blue-600">
                                    Features
                                </a>
                                <a href="#sectors" className="text-sm font-medium text-neutral-600 transition-colors hover:text-blue-600">
                                    Sectors
                                </a>
                                <a href="#about" className="text-sm font-medium text-neutral-600 transition-colors hover:text-blue-600">
                                    About
                                </a>
                                <Link 
                                    href={login()} 
                                    className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:border-blue-300 hover:text-blue-600"
                                >
                                    Admin Login
                                </Link>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
                    <div className="absolute inset-0 -z-10 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                    
                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            
                            {/* Left Content */}
                            <div className="text-center lg:text-left">
                                <div className="mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
                                    <Zap className="mr-2 h-4 w-4" />
                                    Powered by AI-Driven Semantic Search
                                </div>
                                
                                <h1 className="mb-6 text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                                    <span className="text-blue-600">FinTech</span> Terminology Database
                                </h1>
                                        
                                <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl lg:mx-0">
                                    A comprehensive, multilingual lexicon for financial technology and regulatory terminology. Built for regulators, researchers, and industry professionals.
                                </p>
                                
                                <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                                    <Link 
                                        href={explore()} 
                                        className="group inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                                    >
                                        Explore Terms
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    
                                    <a 
                                        href="#features" 
                                        className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-8 py-4 text-base font-semibold text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50"
                                    >
                                        Learn More
                                    </a>
                                </div>
                                
                                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-neutral-500 lg:justify-start">
                                    <div className="flex items-center">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        Official Document
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        {stats.totalLanguages} Languages
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        {stats.totalTerms.toLocaleString()}+ Terms
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Visual */}
                            <div className="relative hidden lg:block">
                                <div className="relative min-h-[400px]">
                                    {/* Featured Term Card - Top Right */}
                                    <div className="absolute right-0 top-0 w-72 rotate-3 rounded-2xl border border-neutral-100 bg-white p-6 shadow-2xl transition-transform hover:rotate-0">
                                        <div className="mb-4 flex items-center">
                                            <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                                <BookOpen className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-neutral-500">Featured Term</div>
                                                <div className="text-sm font-bold text-neutral-900">FinTech</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex items-center text-neutral-600">
                                                <span className="mr-2">🇰🇭</span>
                                                <span>បច្ចេកវិទ្យាហិរញ្ញវត្ថុ</span>
                                            </div>
                                            <div className="flex items-center text-neutral-600">
                                                <span className="mr-2">🇬🇧</span>
                                                <span>Financial Technology</span>
                                            </div>
                                            <div className="flex items-center text-neutral-600">
                                                <span className="mr-2">🇫🇷</span>
                                                <span>Technologie Financière</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Search Card - Center Left */}
                                    <div className="absolute left-0 top-32 w-64 -rotate-2 rounded-xl border border-neutral-100 bg-white p-5 shadow-xl transition-transform hover:rotate-0">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-xs font-semibold uppercase text-neutral-500">Search</span>
                                            <Search className="h-4 w-4 text-neutral-400" />
                                        </div>
                                        <div className="mb-2 h-2 rounded-full bg-neutral-100"></div>
                                        <div className="h-2 w-3/4 rounded-full bg-neutral-100"></div>
                                    </div>
                                    
                                    {/* Stats Card - Bottom Right */}
                                    <div className="absolute right-12 top-56 w-56 rotate-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-xl transition-transform hover:rotate-0">
                                        <div className="mb-1 text-3xl font-bold">{stats.totalTerms.toLocaleString()}</div>
                                        <div className="text-sm opacity-90">Terms Available</div>
                                        <div className="mt-3 flex items-center text-xs opacity-80">
                                            <TrendingUp className="mr-1 h-4 w-4" />
                                            +{Math.floor(stats.totalTerms / 10)} this month
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="border-y border-neutral-100 bg-white py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            <div className="text-center">
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <div className="mb-1 text-3xl font-bold text-neutral-900">{stats.totalTerms.toLocaleString()}</div>
                                <div className="text-sm font-medium text-neutral-500">Total Terms</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <Languages className="h-6 w-6" />
                                </div>
                                <div className="mb-1 text-3xl font-bold text-neutral-900">{stats.totalLanguages}</div>
                                <div className="text-sm font-medium text-neutral-500">Languages</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <Database className="h-6 w-6" />
                                </div>
                                <div className="mb-1 text-3xl font-bold text-neutral-900">{stats.totalSectors}</div>
                                <div className="text-sm font-medium text-neutral-500">Sectors</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <Book className="h-6 w-6" />
                                </div>
                                <div className="mb-1 text-3xl font-bold text-neutral-900">{stats.totalReferences}</div>
                                <div className="text-sm font-medium text-neutral-500">References</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-neutral-50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
                                Why Choose FSA FinTech Lexicon?
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
                                A powerful platform designed for financial professionals, regulators, and researchers
                            </p>
                        </div>
                        
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {FEATURES.map((feature, idx) => (
                                <div 
                                    key={idx}
                                    className="group rounded-2xl border border-neutral-200 bg-white p-8 transition-all hover:border-blue-300 hover:shadow-lg"
                                >
                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-600">
                                        <feature.icon className="h-7 w-7 text-blue-600 transition-colors group-hover:text-white" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-neutral-900">{feature.title}</h3>
                                    <p className="leading-relaxed text-neutral-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Sectors Section */}
                <section id="sectors" className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
                                Comprehensive Coverage Across Sectors
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-neutral-600">
                                Specialized terminology for every area of financial technology
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-3">
                            {SECTORS.map((sector, idx) => (
                                <div 
                                    key={idx}
                                    className="cursor-default rounded-full border border-neutral-200 bg-neutral-50 px-6 py-3 text-sm font-semibold text-neutral-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    {sector}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 py-20">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                            <Globe className="h-8 w-8 text-white" />
                        </div>
                        
                        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                            Ready to Explore the Lexicon?
                        </h2>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                            Access thousands of verified financial technology terms in multiple languages
                        </p>
                        
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link 
                                href={explore()} 
                                className="group inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
                            >
                                Browse Public Portal
                                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            
                            <Link 
                                href={login()} 
                                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                            >
                                Admin Dashboard
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="bg-neutral-50 py-20">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-12">
                            <div className="mb-6 flex items-center">
                                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                                    About FSA FinTech Lexicon
                                </h2>
                            </div>
                            
                            <div className="space-y-4 leading-relaxed text-neutral-600">
                                <p>
                                    The <strong className="text-neutral-900">FSA FinTech Lexicon</strong> is a comprehensive terminology management system developed by the Financial Services Authority to standardize financial technology terminology across regulatory bodies, financial institutions, and research organizations.
                                </p>
                                <p>
                                    Our mission is to promote clarity and consistency in financial communication by providing authoritative, multilingual definitions for key terms in the rapidly evolving FinTech sector.
                                </p>
                                <p>
                                    With contributions from regulatory experts, linguists, and industry professionals, the lexicon serves as the definitive reference for Khmer, English, and French financial terminology.
                                </p>
                            </div>
                            
                            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-neutral-100 pt-8">
                                <div className="flex items-center text-sm text-neutral-600">
                                    <Users className="mr-2 h-5 w-5 text-neutral-400" />
                                    <span>For Regulators, Researchers & Professionals</span>
                                </div>
                                <div className="flex items-center text-sm text-neutral-600">
                                    <Globe className="mr-2 h-5 w-5 text-neutral-400" />
                                    <span>Multilingual Support</span>
                                </div>
                                <div className="flex items-center text-sm text-neutral-600">
                                    <Shield className="mr-2 h-5 w-5 text-neutral-400" />
                                    <span>Verified & Authoritative</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-900 py-12 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 grid gap-8 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <div className="mb-4 flex items-center space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                        <BookOpen className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold leading-none">FSA FinTech Lexicon</span>
                                        <span className="text-xs text-neutral-400">Financial Services Authority</span>
                                    </div>
                                </div>
                                <p className="max-w-md text-sm leading-relaxed text-neutral-400">
                                    The definitive source for financial technology terminology. Empowering regulators, researchers, and professionals with standardized multilingual definitions.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="mb-4 font-semibold">Quick Links</h3>
                                <ul className="space-y-2 text-sm text-neutral-400">
                                    <li><Link href={explore()} className="transition-colors hover:text-white">Browse Terms</Link></li>
                                    <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
                                    <li><a href="#sectors" className="transition-colors hover:text-white">Sectors</a></li>
                                    <li><a href="#about" className="transition-colors hover:text-white">About Us</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="mb-4 font-semibold">Resources</h3>
                                <ul className="space-y-2 text-sm text-neutral-400">
                                    <li><a href="#" className="transition-colors hover:text-white">Documentation</a></li>
                                    <li><a href="#" className="transition-colors hover:text-white">API Access</a></li>
                                    <li><a href="#" className="transition-colors hover:text-white">Privacy Policy</a></li>
                                    <li><a href="#" className="transition-colors hover:text-white">Terms of Use</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center justify-between border-t border-neutral-800 pt-8 text-sm text-neutral-400 sm:flex-row">
                            <p>© 2026 Financial Services Authority. All rights reserved.</p>
                            <p className="mt-2 sm:mt-0">Built with precision for regulatory excellence</p>
                        </div>
                    </div>
                </footer>
                
            </div>
        </>
    );
}
