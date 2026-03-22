import { Head, router } from '@inertiajs/react';
import TermForm from '@/components/lexicon/term-form';
import AppLayout from '@/layouts/app-layout';
import { create as createRoute, store as storeRoute } from '@/actions/App/Http/Controllers/Lexicon/TermController';
import { index as termsIndex } from '@/actions/App/Http/Controllers/Lexicon/TermController';
import type { BreadcrumbItem } from '@/types';
import type { OptionItem, ReferenceOption } from '@/components/lexicon/term-form';

interface Props {
    sectors: OptionItem[];
    termGroups: OptionItem[];
    references: ReferenceOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Terms', href: termsIndex() },
    { title: 'Add New Term', href: createRoute() },
];

export default function TermCreate({ sectors, termGroups, references }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Term" />
            <TermForm
                sectors={sectors}
                termGroups={termGroups}
                references={references}
                submitUrl={storeRoute().url}
                submitMethod="post"
                submitLabel="Save Term"
                onCancel={() => router.visit(termsIndex())}
            />
        </AppLayout>
    );
}
