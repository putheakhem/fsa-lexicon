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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 antialiased">
                
                {/* Navigation Header */}
                <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-xl">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between lg:h-20">
                            <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(44.8%_0.119_151.328)] to-[oklch(38%_0.11_151.328)] shadow-lg shadow-[oklch(44.8%_0.119_151.328)]/30 ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105 lg:h-11 lg:w-11">
                                    <BookOpen className="h-5 w-5 text-white lg:h-6 lg:w-6" strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold leading-tight tracking-tight text-white lg:text-base">
                                        FSA FinTech Lexicon
                                    </span>
                                    <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400 lg:text-[11px]">
                                        Financial Services
                                    </span>
                                </div>
                            </Link>
                            
                            <nav className="flex items-center gap-2">
                                <Link 
                                    href={explore()} 
                                    className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:inline-flex lg:px-4"
                                >
                                    Browse Lexicon
                                </Link>
                                <Link 
                                    href={login()} 
                                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition-all hover:bg-slate-100 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-95 lg:px-5"
                                >
                                    Sign In
                                </Link>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[oklch(15%_0.08_151.328)] to-slate-950 pt-16 lg:pt-20">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(44.8%_0.119_151.328)_1px,transparent_1px),linear-gradient(to_bottom,oklch(44.8%_0.119_151.328)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.04]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-white"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(44.8%_0.119_151.328)_0%,transparent_60%)] opacity-15"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(79.5%_0.184_86.047)_0%,transparent_50%)] opacity-5"></div>
                    
                    <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
                        <div className="mx-auto max-w-4xl text-center">
                            
                            {/* Badge */}
                            <div className="mb-6 flex justify-center animate-in fade-in slide-in-from-top-4 duration-700 delay-75 sm:mb-8">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(44.8%_0.119_151.328)]/30 bg-[oklch(44.8%_0.119_151.328)]/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[oklch(44.8%_0.119_151.328)] shadow-lg backdrop-blur-sm sm:px-4 sm:text-xs">
                                    <Sparkles className="h-3 w-3 animate-pulse sm:h-3.5 sm:w-3.5" />
                                    Authoritative Regulatory Terminology
                                </div>
                            </div>
                            
                            {/* Headline */}
                            <h1 className="mb-4 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:mb-6 sm:text-5xl lg:text-6xl xl:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both delay-150">
                                Cambodia's Financial Services
                                <br />
                                <span className="bg-gradient-to-r from-[oklch(44.8%_0.119_151.328)] via-[oklch(55%_0.15_151.328)] to-[oklch(44.8%_0.119_151.328)] bg-clip-text text-transparent">
                                    Lexicon Database
                                </span>
                            </h1>
                            
                            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:mb-12 sm:text-lg lg:text-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both delay-300">
                                Comprehensive trilingual terminology for FinTech regulation — standardizing financial language across Cambodia's regulatory ecosystem
                            </p>
                            
                            {/* CTA Buttons */}
                            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 animate-in fade-in zoom-in-95 duration-1000 fill-mode-both delay-450">
                                <Link 
                                    href={explore()} 
                                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[oklch(44.8%_0.119_151.328)] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[oklch(44.8%_0.119_151.328)]/40 transition-all hover:shadow-xl hover:shadow-[oklch(44.8%_0.119_151.328)]/50 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-95 sm:w-auto sm:px-8 sm:py-4"
                                >
                                    Browse Lexicon
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                
                                <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[oklch(79.5%_0.184_86.047)]/40 bg-[oklch(79.5%_0.184_86.047)]/20 px-6 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all hover:border-[oklch(79.5%_0.184_86.047)]/60 hover:bg-[oklch(79.5%_0.184_86.047)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-95 sm:w-auto sm:px-8">
                                    <Search className="h-4 w-4" />
                                    Search Terms
                                </button>
                            </div>
                            
                            {/* Inline Stats */}
                            <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-4 sm:gap-4 lg:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
                                <div className="group rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-[oklch(44.8%_0.119_151.328)]/40 hover:scale-[1.02] sm:rounded-2xl sm:p-6">
                                    <div className="mb-1.5 text-3xl font-bold text-white sm:mb-2 sm:text-4xl">
                                        {stats.totalTerms.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                                        Terms
                                    </div>
                                </div>
                                
                                <div className="group rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-[oklch(44.8%_0.119_151.328)]/40 hover:scale-[1.02] sm:rounded-2xl sm:p-6">
                                    <div className="mb-1.5 text-3xl font-bold text-white sm:mb-2 sm:text-4xl">
                                        {stats.totalLanguages}
                                    </div>
                                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                                        Languages
                                    </div>
                                </div>
                                
                                <div className="group rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-[oklch(44.8%_0.119_151.328)]/40 hover:scale-[1.02] sm:rounded-2xl sm:p-6">
                                    <div className="mb-1.5 text-3xl font-bold text-white sm:mb-2 sm:text-4xl">
                                        {stats.totalSectors}
                                    </div>
                                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                                        Sectors
                                    </div>
                                </div>
                                
                                <div className="group rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-[oklch(44.8%_0.119_151.328)]/40 hover:scale-[1.02] sm:rounded-2xl sm:p-6">
                                    <div className="mb-1.5 text-3xl font-bold text-white sm:mb-2 sm:text-4xl">
                                        {stats.totalReferences}
                                    </div>
                                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                                        References
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* Key Stakeholders Section */}
                <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-white py-16 overflow-hidden sm:py-20 lg:py-28">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(44.8%_0.119_151.328)_0%,transparent_70%)] opacity-[0.02]"></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        
                        {/* Section Header */}
                        <div className="mb-12 text-center sm:mb-16">
                            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:mb-4 sm:text-4xl lg:text-5xl">
                                Access Anywhere, Anytime
                            </h2>
                            <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
                                Download our mobile app or access the web version—{stats.totalTerms.toLocaleString()}+ verified terms at your fingertips
                            </p>
                        </div>
                        
                        {/* Mobile App Platform Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                            {/* iOS App Store Badge */}
                            <a 
                                href="#" 
                                className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-slate-900 bg-black px-5 py-3 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-95 animate-in fade-in zoom-in-95 duration-500 delay-100 sm:px-6"
                            >
                                <Apple className="h-6 w-6 text-white sm:h-7 sm:w-7" fill="currentColor" />
                                <div className="text-left">
                                    <div className="text-[9px] font-medium uppercase leading-tight tracking-wide text-white/80">Download on the</div>
                                    <div className="text-base font-semibold leading-tight text-white sm:text-lg">App Store</div>
                                </div>
                            </a>
                            
                            {/* Google Play Badge */}
                            <a 
                                href="#" 
                                className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-slate-900 bg-black px-5 py-3 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-95 animate-in fade-in zoom-in-95 duration-500 delay-200 sm:px-6"
                            >
                                <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 20.5v-17c0-.88.59-1.64 1.42-1.86v0c.17-.05.34-.08.53-.08.58 0 1.14.25 1.53.7L12 10l5.52-7.74c.39-.45.95-.7 1.53-.7.19 0 .36.03.53.08v0c.83.22 1.42.98 1.42 1.86v17c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2z" fill="#EA4335"/>
                                    <path d="M3 3.5c0-.88.59-1.64 1.42-1.86v0c.83.22 1.42.98 1.42 1.86v8.63l5.68-7.97c.39-.45.95-.7 1.53-.7.19 0 .36.03.53.08v0L6.48 11.37 3 7.13V3.5z" fill="#FBBC04"/>
                                    <path d="M12 10L6.48 2.26c.39-.45.95-.7 1.53-.7.19 0 .36.03.53.08v0c.83.22 1.42.98 1.42 1.86v8.63L12 10z" fill="#4285F4"/>
                                    <path d="M21 3.5v17c0 1.1-.9 2-2 2h-7v-8.37l5.52-7.74c.39-.45.95-.7 1.53-.7.19 0 .36.03.53.08v0c.83.22 1.42.98 1.42 1.86v1.63L21 3.5z" fill="#34A853"/>
                                </svg>
                                <div className="text-left">
                                    <div className="text-[9px] font-medium uppercase leading-tight tracking-wide text-white/80">GET IT ON</div>
                                    <div className="text-base font-semibold leading-tight text-white sm:text-lg">Google Play</div>
                                </div>
                            </a>
                            
                            {/* AppGallery Badge */}
                            <a 
                                href="#" 
                                className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-slate-900 bg-black px-5 py-3 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-95 animate-in fade-in zoom-in-95 duration-500 delay-300 sm:px-6"
                            >
                                <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" fill="#E31E24"/>
                                    <path d="M12 6L13.5 9.5L17 10L14.5 12.5L15 16L12 14L9 16L9.5 12.5L7 10L10.5 9.5L12 6Z" fill="white"/>
                                </svg>
                                <div className="text-left">
                                    <div className="text-[9px] font-medium uppercase leading-tight tracking-wide text-white/80">EXPLORE IT ON</div>
                                    <div className="text-base font-semibold leading-tight text-white sm:text-lg">AppGallery</div>
                                </div>
                            </a>
                            
                            {/* Web App Badge */}
                            <Link 
                                href={explore()} 
                                className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-slate-900 bg-white px-5 py-3 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-95 animate-in fade-in zoom-in-95 duration-500 delay-400 sm:px-6"
                            >
                                <Globe2 className="h-6 w-6 text-slate-900 sm:h-7 sm:w-7" />
                                <div className="text-left">
                                    <div className="text-[9px] font-medium uppercase leading-tight tracking-wide text-slate-600">OPEN IN BROWSER</div>
                                    <div className="text-base font-semibold leading-tight text-slate-900 sm:text-lg">Web App</div>
                                </div>
                            </Link>
                        </div>
                        
                    </div>
                </section>

                {/* Multilingual Feature Section */}
                <section className="relative border-y border-slate-200/60 bg-gradient-to-br from-slate-50 via-white to-[oklch(97%_0.005_151.328)] py-16 sm:py-20 lg:py-28">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(44.8%_0.119_151.328)_0%,transparent_60%)] opacity-[0.025]"></div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                            
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[oklch(44.8%_0.119_151.328)]/20 bg-[oklch(44.8%_0.119_151.328)]/5 px-3.5 py-1.5 text-xs font-semibold text-[oklch(35%_0.12_151.328)] sm:mb-6 sm:px-4 sm:text-sm">
                                    <Languages className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    Trilingual Terminology
                                </div>
                                
                                <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-4xl lg:text-5xl">
                                    Khmer · English · French
                                </h2>
                                
                                <p className="mb-8 text-base leading-relaxed text-slate-600 sm:mb-10 sm:text-lg">
                                    Every term provides comprehensive definitions in all three languages, ensuring clarity for domestic institutions and international partners
                                </p>
                                
                                <div className="space-y-4 sm:space-y-5">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[oklch(44.8%_0.119_151.328)]/10 sm:h-10 sm:w-10">
                                            <CheckCircle2 className="h-4.5 w-4.5 text-[oklch(44.8%_0.119_151.328)] sm:h-5 sm:w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 sm:text-base">Native Khmer translations</p>
                                            <p className="text-xs text-slate-600 sm:text-sm">Developed with linguistic experts</p>
                                       </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[oklch(44.8%_0.119_151.328)]/10 sm:h-10 sm:w-10">
                                            <CheckCircle2 className="h-4.5 w-4.5 text-[oklch(44.8%_0.119_151.328)] sm:h-5 sm:w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 sm:text-base">International standards</p>
                                            <p className="text-xs text-slate-600 sm:text-sm">Aligned with global financial regulations</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[oklch(44.8%_0.119_151.328)]/10 sm:h-10 sm:w-10">
                                            <CheckCircle2 className="h-4.5 w-4.5 text-[oklch(44.8%_0.119_151.328)] sm:h-5 sm:w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 sm:text-base">Cross-language search</p>
                                            <p className="text-xs text-slate-600 sm:text-sm">Search and find terms in any language</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:rounded-2xl sm:p-8">
                                    <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3.5 sm:mb-6 sm:pb-4">
                                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                                            Example Term
                                        </div>
                                        <div className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-medium text-green-700 sm:px-3 sm:py-1 sm:text-xs">
                                            ✓ Verified
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-5 sm:space-y-6">
                                        <div>
                                            <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 sm:mb-2 sm:text-sm">
                                                <span className="text-base sm:text-lg">🇰🇭</span>
                                                Khmer
                                            </div>
                                            <p className="text-lg font-semibold text-slate-900 sm:text-xl">
                                                បច្ចេកវិទ្យាហិរញ្ញវត្ថុ
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 sm:mb-2 sm:text-sm">
                                                <span className="text-base sm:text-lg">🇬🇧</span>
                                                English
                                            </div>
                                            <p className="text-lg font-semibold text-slate-900 sm:text-xl">
                                                Financial Technology (FinTech)
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 sm:mb-2 sm:text-sm">
                                                <span className="text-base sm:text-lg">🇫🇷</span>
                                                French
                                            </div>
                                            <p className="text-lg font-semibold text-slate-900 sm:text-xl">
                                                Technologie Financière
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 rounded-xl bg-slate-50 p-4 sm:mt-8 sm:rounded-2xl sm:p-5">
                                        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                                            Technology and innovation that aims to compete with traditional financial methods in the delivery of financial services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* Coverage Section */}
                <section className="relative bg-gradient-to-b from-white via-slate-50/30 to-white py-16 sm:py-20 lg:py-28">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,oklch(79.5%_0.184_86.047)_0%,transparent_60%)] opacity-[0.015]"></div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        
                        <div className="mb-12 text-center sm:mb-16">
                            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:mb-4 sm:text-4xl lg:text-5xl">
                                Complete Sectoral Coverage
                            </h2>
                            <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
                                From digital payments to blockchain—comprehensive terminology for every aspect of financial innovation
                            </p>
                        </div>
                        
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[oklch(44.8%_0.119_151.328)]/30 hover:shadow-md hover:scale-[1.02] sm:rounded-2xl sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-600 delay-100">
                                <div className="mb-3.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(44.8%_0.119_151.328)] text-white shadow-sm sm:mb-4 sm:h-12 sm:w-12">
                                    <Globe2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h3 className="mb-1.5 text-base font-bold text-slate-900 sm:mb-2 sm:text-lg">Digital Payments</h3>
                                <p className="text-xs text-slate-600 sm:text-sm">Mobile money, e-wallets, QR payments</p>
                            </div>
                            
                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[oklch(44.8%_0.119_151.328)]/30 hover:shadow-md hover:scale-[1.02] sm:rounded-2xl sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-600 delay-200">
                                <div className="mb-3.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(44.8%_0.119_151.328)] text-white shadow-sm sm:mb-4 sm:h-12 sm:w-12">
                                    <Database className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h3 className="mb-1.5 text-base font-bold text-slate-900 sm:mb-2 sm:text-lg">Blockchain & Crypto</h3>
                                <p className="text-xs text-slate-600 sm:text-sm">DLT, digital assets, smart contracts</p>
                            </div>
                            
                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[oklch(44.8%_0.119_151.328)]/30 hover:shadow-md hover:scale-[1.02] sm:rounded-2xl sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-600 delay-300">
                                <div className="mb-3.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(44.8%_0.119_151.328)] text-white shadow-sm sm:mb-4 sm:h-12 sm:w-12">
                                    <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h3 className="mb-1.5 text-base font-bold text-slate-900 sm:mb-2 sm:text-lg">RegTech & Compliance</h3>
                                <p className="text-xs text-slate-600 sm:text-sm">KYC, AML, regulatory reporting</p>
                            </div>
                            
                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[oklch(44.8%_0.119_151.328)]/30 hover:shadow-md hover:scale-[1.02] sm:rounded-2xl sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-600 delay-400">
                                <div className="mb-3.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(44.8%_0.119_151.328)] text-white shadow-sm sm:mb-4 sm:h-12 sm:w-12">
                                    <Book className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h3 className="mb-1.5 text-base font-bold text-slate-900 sm:mb-2 sm:text-lg">Digital Banking</h3>
                                <p className="text-xs text-slate-600 sm:text-sm">Neobanks, digital lending, BNPL</p>
                            </div>
                        </div>
                        
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[oklch(18%_0.09_151.328)] to-slate-950 py-16 sm:py-20 lg:py-28">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(44.8%_0.119_151.328)_1px,transparent_1px),linear-gradient(to_bottom,oklch(44.8%_0.119_151.328)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.04]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(44.8%_0.119_151.328)_0%,transparent_60%)] opacity-15"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(79.5%_0.184_86.047)_0%,transparent_50%)] opacity-[0.08]"></div>
                    
                    <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:mb-6 sm:text-4xl lg:text-5xl">
                            Access the Complete Lexicon
                        </h2>
                        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:mb-12 sm:text-lg">
                            {stats.totalTerms.toLocaleString()} verified financial terms — available to regulators, institutions, and researchers
                        </p>
                        
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <Link 
                                href={explore()} 
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[oklch(44.8%_0.119_151.328)] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[oklch(44.8%_0.119_151.328)]/40 transition-all hover:shadow-xl hover:shadow-[oklch(44.8%_0.119_151.328)]/50 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-95 sm:w-auto sm:px-8 sm:py-4"
                            >
                                Browse Public Portal
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            
                            <Link 
                                href={login()} 
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/20 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:scale-95 sm:w-auto sm:px-8 sm:py-4"
                            >
                                Login to Dashboard
                            </Link>
                        </div>
                    </div>
                </section>
                
                {/* About Section */}
                <section className="relative bg-gradient-to-br from-slate-50 via-slate-50/50 to-white py-16 sm:py-20 lg:py-28">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(44.8%_0.119_151.328)_0%,transparent_70%)] opacity-[0.02]"></div>
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm sm:rounded-2xl sm:p-12 lg:p-16 transition-shadow duration-300 hover:shadow-md">
                            
                            <div className="mb-8 flex items-center gap-3.5 sm:mb-10 sm:gap-4">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(44.8%_0.119_151.328)] shadow-sm sm:h-14 sm:w-14">
                                    <Shield className="h-6 w-6 text-white sm:h-7 sm:w-7" strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                                    About This Initiative
                                </h2>
                            </div>
                            
                            <div className="space-y-4 text-base leading-relaxed text-slate-600 sm:space-y-6 sm:text-lg">
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
                            
                            <div className="mt-10 grid gap-6 border-t border-slate-100 pt-10 sm:mt-12 sm:grid-cols-3 sm:gap-8 sm:pt-12">
                                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                                    <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(44.8%_0.119_151.328)]/10 sm:mb-3 sm:h-12 sm:w-12">
                                        <Shield className="h-5 w-5 text-[oklch(44.8%_0.119_151.328)] sm:h-6 sm:w-6" />
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900 sm:text-base">FSA Verified</div>
                                    <div className="text-xs text-slate-600 sm:text-sm">Regulatory authority approved</div>
                                </div>
                                
                                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                                    <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(44.8%_0.119_151.328)]/10 sm:mb-3 sm:h-12 sm:w-12">
                                        <Languages className="h-5 w-5 text-[oklch(44.8%_0.119_151.328)] sm:h-6 sm:w-6" />
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900 sm:text-base">Multilingual</div>
                                    <div className="text-xs text-slate-600 sm:text-sm">Khmer, English, French</div>
                                </div>
                                
                                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                                    <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(44.8%_0.119_151.328)]/10 sm:mb-3 sm:h-12 sm:w-12">
                                        <Database className="h-5 w-5 text-[oklch(44.8%_0.119_151.328)] sm:h-6 sm:w-6" />
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900 sm:text-base">Comprehensive</div>
                                    <div className="text-xs text-slate-600 sm:text-sm">{stats.totalTerms}+ verified terms</div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative border-t border-slate-200/60 bg-gradient-to-b from-white to-slate-50/40 py-12 sm:py-16">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(44.8%_0.119_151.328)_0%,transparent_60%)] opacity-[0.015]"></div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 sm:gap-12 lg:grid-cols-12">
                            
                            <div className="lg:col-span-5">
                                <Link href="/" className="mb-5 inline-flex items-center gap-3 transition-opacity hover:opacity-80 sm:mb-6 sm:gap-3.5">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(44.8%_0.119_151.328)] to-[oklch(38%_0.11_151.328)] shadow-sm sm:h-12 sm:w-12">
                                        <BookOpen className="h-5.5 w-5.5 text-white sm:h-6 sm:w-6" strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold leading-tight tracking-tight text-slate-900 sm:text-base">
                                            FSA FinTech Lexicon
                                        </span>
                                        <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500 sm:text-[11px]">
                                            Financial Services
                                        </span>
                                    </div>
                                </Link>
                                <p className="mb-5 max-w-sm text-xs leading-relaxed text-slate-600 sm:mb-6 sm:text-sm">
                                    Cambodia's authoritative financial technology terminology database for regulatory and financial ecosystems.
                                </p>
                                <div className="flex items-center gap-3 text-[10px] text-slate-500 sm:text-xs">
                                    <span>© 2026 Financial Services Authority</span>
                                </div>
                            </div>
                            
                            <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
                                <div>
                                    <h3 className="mb-3 text-xs font-semibold text-slate-900 sm:mb-4 sm:text-sm">Platform</h3>
                                    <ul className="space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
                                        <li>
                                            <Link href={explore()} className="text-slate-600 transition-colors hover:text-[oklch(44.8%_0.119_151.328)] focus-visible:outline-none focus-visible:text-[oklch(44.8%_0.119_151.328)]">
                                                Browse Terms
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={explore()} className="text-slate-600 transition-colors hover:text-[oklch(44.8%_0.119_151.328)] focus-visible:outline-none focus-visible:text-[oklch(44.8%_0.119_151.328)]">
                                                Search Lexicon
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href={login()} className="text-slate-600 transition-colors hover:text-[oklch(44.8%_0.119_151.328)] focus-visible:outline-none focus-visible:text-[oklch(44.8%_0.119_151.328)]">
                                                Admin Portal
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="mb-3 text-xs font-semibold text-slate-900 sm:mb-4 sm:text-sm">Resources</h3>
                                    <ul className="space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-[oklch(44.8%_0.119_151.328)] focus-visible:outline-none focus-visible:text-[oklch(44.8%_0.119_151.328)]">
                                                Documentation
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-[oklch(44.8%_0.119_151.328)] focus-visible:outline-none focus-visible:text-[oklch(44.8%_0.119_151.328)]">
                                                API Reference
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-[oklch(44.8%_0.119_151.328)] focus-visible:outline-none focus-visible:text-[oklch(44.8%_0.119_151.328)]">
                                                Guidelines
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="mb-3 text-xs font-semibold text-slate-900 sm:mb-4 sm:text-sm">Legal</h3>
                                    <ul className="space-y-2.5 text-xs sm:space-y-3 sm:text-sm">
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-[oklch(44.8%_0.119_151.328)] focus-visible:outline-none focus-visible:text-[oklch(44.8%_0.119_151.328)]">
                                                Privacy Policy
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-[oklch(44.8%_0.119_151.328)] focus-visible:outline-none focus-visible:text-[oklch(44.8%_0.119_151.328)]">
                                                Terms of Use
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-slate-600 transition-colors hover:text-[oklch(44.8%_0.119_151.328)] focus-visible:outline-none focus-visible:text-[oklch(44.8%_0.119_151.328)]">
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
