import { Head, router } from '@inertiajs/react';
import TermForm from '@/components/lexicon/term-form';
import AppLayout from '@/layouts/app-layout';
import { edit as editRoute, update as updateRoute } from '@/actions/App/Http/Controllers/Lexicon/TermController';
import { index as termsIndex } from '@/actions/App/Http/Controllers/Lexicon/TermController';
import type { BreadcrumbItem } from '@/types';
import type { OptionItem, ReferenceOption, TermFormData } from '@/components/lexicon/term-form';

interface Reference {
    id: number;
    title: string;
    code: string | null;
    pivot: {
        language: string;
    };
}

interface TermDefinition {
    id: number;
    language: string;
    definition: string;
    note: string | null;
    reference_id: number | null;
}

interface Sector {
    id: number;
}

interface TermGroup {
    id: number;
}

interface Term {
    id: number;
    term_kh: string;
    term_en: string | null;
    term_fr: string | null;
    is_approved: boolean;
    was_sent_to_telegram: boolean;
    term_definitions: TermDefinition[];
    sectors: Sector[];
    term_groups: TermGroup[];
    references: Reference[];
}

interface Props {
    term: Term;
    sectors: OptionItem[];
    termGroups: OptionItem[];
    references: ReferenceOption[];
}

export default function TermEdit({ term, sectors, termGroups, references }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Terms', href: termsIndex() },
        { title: 'Edit Term', href: editRoute(term.id) },
    ];

    const initialData: Partial<TermFormData> = {
        term_kh: term.term_kh,
        term_en: term.term_en ?? '',
        term_fr: term.term_fr ?? '',
        reference_ids: {
            khmer: term.references.find((r) => r.pivot.language === 'khmer')?.id ?? null,
            english: term.references.find((r) => r.pivot.language === 'english')?.id ?? null,
            french: term.references.find((r) => r.pivot.language === 'french')?.id ?? null,
        },
        is_approved: term.is_approved,
        was_sent_to_telegram: term.was_sent_to_telegram,
        sector_ids: term.sectors.map((s) => s.id),
        term_group_ids: term.term_groups.map((g) => g.id),
        definitions: term.term_definitions.map((d) => ({
            language: d.language,
            reference_id: d.reference_id ?? null,
            definition: d.definition,
        })),
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit — ${term.term_en ?? term.term_kh}`} />
            <TermForm
                initialData={initialData}
                sectors={sectors}
                termGroups={termGroups}
                references={references}
                submitUrl={updateRoute(term.id).url}
                submitMethod="put"
                submitLabel="Update Term"
                onCancel={() => router.visit(termsIndex())}
            />
        </AppLayout>
    );
}
