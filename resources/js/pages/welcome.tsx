import { Head, Link } from '@inertiajs/react';
import { 
    Apple,
    ArrowRight,
    Book,
    BookOpen, 
    CheckCircle2,
    Database,
    FileText,
    Globe2, 
    Languages, 
    Search, 
    Shield,
    Sparkles
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

export default function Welcome({ stats }: Props) {
    return (
        <>
            <Head title="FSA FinTech Lexicon — Financial Services Authority" />
            <div className="min-h-screen bg-slate-50">
                
                {/* Navigation Header */}
                <header className="absolute top-0 z-50 w-full border-b border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <Link href="/" className="group flex items-center gap-3.5">
                                <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-900/40 ring-1 ring-white/20 transition-transform group-hover:scale-105">
                                    <BookOpen className="h-6 w-6 text-white" strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-semibold leading-tight tracking-tight text-white">
                                        FSA FinTech Lexicon
                                    </span>
                                    <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                                        Financial Services
                                    </span>
                                </div>
                            </Link>
                            
                            <nav className="hidden items-center gap-1 md:flex">
                                <Link 
                                    href={explore()} 
                                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    Browse Lexicon
                                </Link>
                                <Link 
                                    href={login()} 
                                    className="ml-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
                                >
                                    Sign In
                                </Link>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-50"></div>
                    
                    <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 lg:py-40">
                        <div className="mx-auto max-w-4xl text-center">
                            
                            {/* Badge */}
                            <div className="mb-8 flex justify-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-200 shadow-lg backdrop-blur-sm">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Authoritative Regulatory Terminology
                                </div>
                            </div>
                            
                            {/* Headline */}
                            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                                Cambodia's Financial Services
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                                    Lexicon Database
                                </span>
                            </h1>
                            
                            <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
                                Comprehensive trilingual terminology for FinTech regulation — standardizing financial language across Cambodia's regulatory ecosystem
                            </p>
                            
                            {/* CTA Buttons */}
                            <div className="mb-20 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link 
                                    href={explore()} 
                                    className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/40"
                                >
                                    Browse Lexicon
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                
                                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/80 px-8 py-3.5 text-base font-medium text-slate-200 backdrop-blur-sm transition-all hover:border-slate-500 hover:bg-slate-700/80 hover:text-white">
                                    <Search className="h-4 w-4" />
                                    Search Terms
                                </button>
                            </div>
                            
                            {/* Inline Stats */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/10">
                                    <div className="mb-2 text-4xl font-bold text-white">
                                        {stats.totalTerms.toLocaleString()}
                                    </div>
                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Terms
                                    </div>
                                </div>
                                
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/10">
                                    <div className="mb-2 text-4xl font-bold text-white">
                                        {stats.totalLanguages}
                                    </div>
                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Languages
                                    </div>
                                </div>
                                
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/10">
                                    <div className="mb-2 text-4xl font-bold text-white">
                                        {stats.totalSectors}
                                    </div>
                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Sectors
                                    </div>
                                </div>
                                
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/10">
                                    <div className="mb-2 text-4xl font-bold text-white">
                                        {stats.totalReferences}
                                    </div>
                                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        References
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* Key Stakeholders Section */}
                <section className="bg-white py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        
                        {/* Section Header */}
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                Access Anywhere, Anytime
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-slate-600">
                                Download our mobile app or access the web version—{stats.totalTerms.toLocaleString()}+ verified terms at your fingertips
                            </p>
                        </div>
                        
                        {/* Mobile App Platform Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {/* iOS App Store Badge */}
                            <a 
                                href="#" 
                                className="inline-flex items-center gap-2.5 rounded-lg border-2 border-slate-900 bg-black px-5 py-2.5 transition-all hover:bg-black/90"
                            >
                                <Apple className="h-7 w-7 text-white" fill="currentColor" />
                                <div className="text-left">
                                    <div className="text-[9px] font-medium leading-tight text-white">Download on the</div>
                                    <div className="text-lg font-semibold leading-tight tracking-tight text-white">App Store</div>
                                </div>
                            </a>
                            
                            {/* Google Play Badge */}
                            <a 
                                href="#" 
                                className="inline-flex items-center gap-2.5 rounded-lg border-2 border-slate-900 bg-black px-5 py-2.5 transition-all hover:bg-black/90"
                            >
                                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 20.5v-17c0-.88.59-1.64 1.42-1.86v0c.17-.05.34-.08.53-.08.58 0 1.14.25 1.53.7L12 10l5.52-7.74c.39-.45.95-.7 1.53-.7.19 0 .36.03.53.08v0c.83.22 1.42.98 1.42 1.86v17c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2z" fill="#EA4335"/>
                                    <path d="M3 3.5c0-.88.59-1.64 1.42-1.86v0c.83.22 1.42.98 1.42 1.86v8.63l5.68-7.97c.39-.45.95-.7 1.53-.7.19 0 .36.03.53.08v0L6.48 11.37 3 7.13V3.5z" fill="#FBBC04"/>
                                    <path d="M12 10L6.48 2.26c.39-.45.95-.7 1.53-.7.19 0 .36.03.53.08v0c.83.22 1.42.98 1.42 1.86v8.63L12 10z" fill="#4285F4"/>
                                    <path d="M21 3.5v17c0 1.1-.9 2-2 2h-7v-8.37l5.52-7.74c.39-.45.95-.7 1.53-.7.19 0 .36.03.53.08v0c.83.22 1.42.98 1.42 1.86v1.63L21 3.5z" fill="#34A853"/>
                                </svg>
                                <div className="text-left">
                                    <div className="text-[9px] font-medium leading-tight text-white">GET IT ON</div>
                                    <div className="text-lg font-semibold leading-tight tracking-tight text-white">Google Play</div>
                                </div>
                            </a>
                            
                            {/* AppGallery Badge */}
                            <a 
                                href="#" 
                                className="inline-flex items-center gap-2.5 rounded-lg border-2 border-slate-900 bg-black px-5 py-2.5 transition-all hover:bg-black/90"
                            >
                                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" fill="#E31E24"/>
                                    <path d="M12 6L13.5 9.5L17 10L14.5 12.5L15 16L12 14L9 16L9.5 12.5L7 10L10.5 9.5L12 6Z" fill="white"/>
                                </svg>
                                <div className="text-left">
                                    <div className="text-[9px] font-medium leading-tight text-white">EXPLORE IT ON</div>
                                    <div className="text-lg font-semibold leading-tight tracking-tight text-white">AppGallery</div>
                                </div>
                            </a>
                            
                            {/* Web App Badge */}
                            <Link 
                                href={explore()} 
                                className="inline-flex items-center gap-2.5 rounded-lg border-2 border-slate-900 bg-white px-5 py-2.5 transition-all hover:bg-slate-50"
                            >
                                <Globe2 className="h-7 w-7 text-slate-900" />
                                <div className="text-left">
                                    <div className="text-[9px] font-medium leading-tight text-slate-700">OPEN IN BROWSER</div>
                                    <div className="text-lg font-semibold leading-tight tracking-tight text-slate-900">Web App</div>
                                </div>
                            </Link>
                        </div>
                        
                    </div>
                </section>

                {/* Multilingual Feature Section */}
                <section className="border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-16 lg:grid-cols-2">
                            
                            <div>
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-sm font-semibold text-blue-900 shadow-sm">
                                    <Languages className="h-4 w-4" />
                                    Trilingual Terminology
                                </div>
                                
                                <h2 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                    Khmer · English · French
                                </h2>
                                
                                <p className="mb-10 text-lg leading-relaxed text-slate-600">
                                    Every term provides comprehensive definitions in all three languages, ensuring clarity for domestic institutions and international partners
                                </p>
                                
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                            <CheckCircle2 className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Native Khmer translations</p>
                                            <p className="text-sm text-slate-600">Developed with linguistic experts</p>
                                       </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                            <CheckCircle2 className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">International standards</p>
                                            <p className="text-sm text-slate-600">Aligned with global financial regulations</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                            <CheckCircle2 className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Cross-language search</p>
                                            <p className="text-sm text-slate-600">Search and find terms in any language</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                                    <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Example Term
                                        </div>
                                        <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                            ✓ Verified
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                                <span className="text-lg">🇰🇭</span>
                                                Khmer
                                            </div>
                                            <p className="text-xl font-semibold text-slate-900">
                                                បច្ចេកវិទ្យាហិរញ្ញវត្ថុ
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                                <span className="text-lg">🇬🇧</span>
                                                English
                                            </div>
                                            <p className="text-xl font-semibold text-slate-900">
                                                Financial Technology (FinTech)
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                                <span className="text-lg">🇫🇷</span>
                                                French
                                            </div>
                                            <p className="text-xl font-semibold text-slate-900">
                                                Technologie Financière
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                                        <p className="text-sm leading-relaxed text-slate-600">
                                            Technology and innovation that aims to compete with traditional financial methods in the delivery of financial services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* Coverage Section */}
                <section className="bg-white py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                Complete Sectoral Coverage
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-slate-600">
                                From digital payments to blockchain—comprehensive terminology for every aspect of financial innovation
                            </p>
                        </div>
                        
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-lg">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                    <Globe2 className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 font-bold text-slate-900">Digital Payments</h3>
                                <p className="text-sm text-slate-600">Mobile money, e-wallets, QR payments</p>
                            </div>
                            
                            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-lg">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                    <Database className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 font-bold text-slate-900">Blockchain & Crypto</h3>
                                <p className="text-sm text-slate-600">DLT, digital assets, smart contracts</p>
                            </div>
                            
                            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-lg">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 font-bold text-slate-900">RegTech & Compliance</h3>
                                <p className="text-sm text-slate-600">KYC, AML, regulatory reporting</p>
                            </div>
                            
                            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-lg">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                    <Book className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-slate-900">Digital Banking</h3>
                                <p className="text-sm text-slate-600">Neobanks, digital lending, BNPL</p>
                            </div>
                        </div>
                        
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-28">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                    
                    <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Access the Complete Lexicon
                        </h2>
                        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-300">
                            {stats.totalTerms.toLocaleString()} verified financial terms — available to regulators, institutions, and researchers
                        </p>
                        
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link 
                                href={explore()} 
                                className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-50"
                            >
                                Browse Public Portal
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            
                            <Link 
                                href={login()} 
                                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/5"
                            >
                                Login to Dashboard
                            </Link>
                        </div>
                    </div>
                </section>
                
                {/* About Section */}
                <section className="bg-slate-50 py-28">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-10 shadow-lg sm:p-16">
                            
                            <div className="mb-10 flex items-center gap-4">
                                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                                    <Shield className="h-7 w-7 text-white" strokeWidth={2.5} />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                    About This Initiative
                                </h2>
                            </div>
                            
                            <div className="space-y-6 text-lg leading-relaxed text-slate-600">
                                <p>
                                    The <strong className="font-semibold text-slate-900">FSA FinTech Lexicon</strong> is developed and maintained by Cambodia's Financial Services Authority to establish unified terminology for financial technology regulation and sector communication.
                                </p>
                                <p>
                                    As Cambodia's financial sector undergoes rapid digital transformation, standardized terminology becomes essential. This lexicon serves as the authoritative reference for regulatory bodies, financial institutions, researchers, and industry stakeholders.
                                </p>
                                <p>
                                    Every term is meticulously researched, translated by linguistic specialists, and verified by financial regulators to ensure accuracy across Khmer, English, and French.
                                </p>
                            </div>
                            
                            <div className="mt-12 grid gap-8 border-t border-slate-100 pt-12 sm:grid-cols-3">
                                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                        <Shield className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <div className="text-base font-semibold text-slate-900">FSA Verified</div>
                                    <div className="text-sm text-slate-600">Regulatory authority approved</div>
                                </div>
                                
                                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                        <Languages className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <div className="text-base font-semibold text-slate-900">Multilingual</div>
                                    <div className="text-sm text-slate-600">Khmer, English, French</div>
                                </div>
                                
                                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                        <Database className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <div className="text-base font-semibold text-slate-900">Comprehensive</div>
                                    <div className="text-sm text-slate-600">{stats.totalTerms}+ verified terms</div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-200 bg-white py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-12">
                            
                            <div className="lg:col-span-5">
                                <Link href="/" className="mb-6 inline-flex items-center gap-3.5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-900/20">
                                        <BookOpen className="h-6 w-6 text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-semibold leading-tight tracking-tight text-slate-900">
                                            FSA FinTech Lexicon
                                        </span>
                                        <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                                            Financial Services
                                        </span>
                                    </div>
                                </Link>
                                <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-600">
                                    Cambodia's authoritative financial technology terminology database for regulatory and financial ecosystems.
                                </p>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span>© 2026 Financial Services Authority</span>
                                </div>
                            </div>
                            
                            <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
                                <div>
                                    <h3 className="mb-4 text-sm font-semibold text-slate-900">Platform</h3>
                                    <ul className="space-y-3 text-sm">
                                        <li>
                                            <Link href={explore()} className="text-slate-600 transition-colors hover:text-blue-600">
                                                Browse Terms
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={explore()} className="text-slate-600 transition-colors hover:text-blue-600">
                                                Search Lexicon
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={login()} className="text-slate-600 transition-colors hover:text-blue-600">
                                                Admin Portal
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="mb-4 text-sm font-semibold text-slate-900">Resources</h3>
                                    <ul className="space-y-3 text-sm">
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-blue-600">
                                                Documentation
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-blue-600">
                                                API Reference
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-blue-600">
                                                Guidelines
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="mb-4 text-sm font-semibold text-slate-900">Legal</h3>
                                    <ul className="space-y-3 text-sm">
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-blue-600">
                                                Privacy Policy
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-blue-600">
                                                Terms of Use
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-blue-600">
                                                Contact
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </footer>
                
            </div>
        </>
    );
}
