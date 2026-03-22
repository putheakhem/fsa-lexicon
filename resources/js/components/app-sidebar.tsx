import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, Globe, LayoutGrid, LibraryBig, SendHorizonal, Shapes, Tag } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { index as referencesIndex } from '@/actions/App/Http/Controllers/Lexicon/ReferenceController';
import { index as termsIndex } from '@/actions/App/Http/Controllers/Lexicon/TermController';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Terms',
        href: termsIndex(),
        icon: Tag,
    },
    {
        title: 'References',
        href: referencesIndex(),
        icon: LibraryBig,
    },
    {
        title: 'Sectors',
        href: '#',
        icon: Shapes,
    },
    {
        title: 'Groups',
        href: '#',
        icon: Globe,
    },
    {
        title: 'Telegram',
        href: '#',
        icon: SendHorizonal,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
