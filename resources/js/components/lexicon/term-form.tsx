import { useForm, router } from '@inertiajs/react';
import { BookOpen, Globe2, Plus, Trash2, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface OptionItem {
    id: number;
    title_en: string;
    title_kh: string;
}

export interface ReferenceOption {
    id: number;
    title: string;
    code: string | null;
}

export interface DefinitionRow {
    language: string;
    reference_id: number | null;
    definition: string;
}

export interface TermFormData {
    term_kh: string;
    term_en: string;
    term_fr: string;
    reference_ids: {
        khmer: number | null;
        english: number | null;
        french: number | null;
    };
    is_approved: boolean;
    was_sent_to_telegram: boolean;
    sector_ids: number[];
    term_group_ids: number[];
    definitions: DefinitionRow[];
}

interface Props {
    initialData?: Partial<TermFormData>;
    sectors: OptionItem[];
    termGroups: OptionItem[];
    references: ReferenceOption[];
    submitUrl: string;
    submitMethod: 'post' | 'put';
    submitLabel: string;
    onCancel: () => void;
}

const LANGUAGE_OPTIONS = [
    { value: 'khmer', label: 'Khmer' },
    { value: 'english', label: 'English' },
    { value: 'french', label: 'French' },
];

const STATUS_OPTIONS = [
    { value: 'false', label: 'Draft' },
    { value: 'true', label: 'Approved' },
];

function emptyDefinition(): DefinitionRow {
    return { language: 'khmer', reference_id: null, definition: '' };
}

function ReferenceCombobox({
    id,
    references,
    value,
    onChange,
    placeholder = 'Search reference...',
}: {
    id: string;
    references: ReferenceOption[];
    value: number | null;
    onChange: (id: number | null) => void;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = references.find((r) => r.id === value) ?? null;
    const selectedLabel = selected
        ? `${selected.code ? `[${selected.code}] ` : ''}${selected.title}`
        : '';

    const filtered = references.filter(
        (r) =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            (r.code ?? '').toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <Input
                    id={id}
                    value={open ? search : selectedLabel}
                    placeholder={placeholder}
                    onFocus={() => {
                        setSearch('');
                        setOpen(true);
                    }}
                    onBlur={() => setTimeout(() => setOpen(false), 150)}
                    onChange={(e) => setSearch(e.target.value)}
                    autoComplete="off"
                    className={cn(value !== null && !open && 'pr-8')}
                />
                {value !== null && !open && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onChange(null);
                        }}
                        aria-label="Clear reference"
                    >
                        <X className="size-3.5" />
                    </button>
                )}
            </div>
            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-52 overflow-y-auto">
                    <button
                        type="button"
                        onMouseDown={() => {
                            onChange(null);
                            setOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/60 italic"
                    >
                        — No reference
                    </button>
                    {filtered.map((ref) => (
                        <button
                            key={ref.id}
                            type="button"
                            onMouseDown={() => {
                                onChange(ref.id);
                                setOpen(false);
                            }}
                            className={cn(
                                'w-full px-3 py-2 text-left text-sm hover:bg-muted/60 transition-colors',
                                value === ref.id && 'bg-primary/10 text-primary font-medium',
                            )}
                        >
                            {ref.code && (
                                <span className="mr-1.5 text-xs text-muted-foreground">[{ref.code}]</span>
                            )}
                            {ref.title}
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <p className="px-3 py-2 text-sm text-muted-foreground">No results found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function TermForm({
    initialData,
    sectors,
    termGroups,
    references,
    submitUrl,
    submitMethod,
    submitLabel,
    onCancel,
}: Props) {
    const defaultData: TermFormData = {
        term_kh: initialData?.term_kh ?? '',
        term_en: initialData?.term_en ?? '',
        term_fr: initialData?.term_fr ?? '',
        reference_ids: initialData?.reference_ids ?? { khmer: null, english: null, french: null },
        is_approved: initialData?.is_approved ?? false,
        was_sent_to_telegram: initialData?.was_sent_to_telegram ?? false,
        sector_ids: initialData?.sector_ids ?? [],
        term_group_ids: initialData?.term_group_ids ?? [],
        definitions: initialData?.definitions ?? [],
    };

    const { data, setData, post, put, processing, errors } = useForm<TermFormData>(defaultData);

    const allErrors = errors as Record<string, string | undefined>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (submitMethod === 'put') {
            put(submitUrl);
        } else {
            post(submitUrl);
        }
    };

    const addDefinition = () => {
        setData('definitions', [...data.definitions, emptyDefinition()]);
    };

    const removeDefinition = (index: number) => {
        setData(
            'definitions',
            data.definitions.filter((_, i) => i !== index),
        );
    };

    const updateDefinition = (index: number, field: 'language' | 'definition', value: string) => {
        const updated = data.definitions.map((def, i) =>
            i === index ? { ...def, [field]: value } : def,
        );
        setData('definitions', updated);
    };

    const setDefinitionRef = (index: number, value: number | null) => {
        const updated = data.definitions.map((def, i) =>
            i === index ? { ...def, reference_id: value } : def,
        );
        setData('definitions', updated);
    };

    const toggleMultiSelect = useCallback(
        (field: 'sector_ids' | 'term_group_ids', id: number) => {
            const current = data[field];
            const updated = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
            setData(field, updated);
        },
        [data, setData],
    );

    return (
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 p-6">
            {/* Toolbar */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{submitLabel === 'Save Term' ? 'Add New Term' : 'Edit Term'}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {submitLabel === 'Save Term' ? 'Create a new lexicon entry and its translations.' : 'Update the lexicon entry and its translations.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
                        <X className="size-4" />
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing} className="gap-2">
                        <BookOpen className="size-4" />
                        {submitLabel}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
                {/* Left column */}
                <div className="flex flex-col gap-6">
                    {/* Terminology */}
                    <section className="rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center gap-2 border-b px-6 py-4">
                            <Globe2 className="size-4 text-muted-foreground" />
                            <h2 className="font-semibold">Terminology</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-6 py-5 sm:grid-cols-2">
                            {/* Khmer row */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="term_kh">
                                    Khmer Term <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="term_kh"
                                    placeholder="e.g. បច្ចេកវិទ្យាហិរញ្ញវត្ថុ"
                                    value={data.term_kh}
                                    onChange={(e) => setData('term_kh', e.target.value)}
                                    aria-invalid={!!allErrors.term_kh}
                                />
                                <InputError message={allErrors.term_kh} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="ref_kh">Khmer Reference</Label>
                                <ReferenceCombobox
                                    id="ref_kh"
                                    references={references}
                                    value={data.reference_ids.khmer}
                                    onChange={(id) =>
                                        setData('reference_ids', { ...data.reference_ids, khmer: id })
                                    }
                                />
                            </div>

                            {/* English row */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="term_en">
                                    English Term <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="term_en"
                                    placeholder="e.g. Financial Technology"
                                    value={data.term_en}
                                    onChange={(e) => setData('term_en', e.target.value)}
                                    aria-invalid={!!allErrors.term_en}
                                />
                                <InputError message={allErrors.term_en} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="ref_en">English Reference</Label>
                                <ReferenceCombobox
                                    id="ref_en"
                                    references={references}
                                    value={data.reference_ids.english}
                                    onChange={(id) =>
                                        setData('reference_ids', { ...data.reference_ids, english: id })
                                    }
                                />
                            </div>

                            {/* French row */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="term_fr">French Term</Label>
                                <Input
                                    id="term_fr"
                                    placeholder="e.g. Technologie Financière"
                                    value={data.term_fr}
                                    onChange={(e) => setData('term_fr', e.target.value)}
                                    aria-invalid={!!allErrors.term_fr}
                                />
                                <InputError message={allErrors.term_fr} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="ref_fr">French Reference</Label>
                                <ReferenceCombobox
                                    id="ref_fr"
                                    references={references}
                                    value={data.reference_ids.french}
                                    onChange={(id) =>
                                        setData('reference_ids', { ...data.reference_ids, french: id })
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* Definitions */}
                    <section className="rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div className="flex items-center gap-2">
                                <BookOpen className="size-4 text-muted-foreground" />
                                <h2 className="font-semibold">Definitions</h2>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={addDefinition} className="gap-1.5 text-primary hover:text-primary">
                                <Plus className="size-4" />
                                Add Definition
                            </Button>
                        </div>

                        <div className="flex flex-col divide-y">
                            {data.definitions.length === 0 && (
                                <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                                    <BookOpen className="size-8 text-muted-foreground/40" />
                                    <p className="text-sm text-muted-foreground">No definitions yet.</p>
                                    <Button type="button" variant="outline" size="sm" onClick={addDefinition} className="gap-1.5">
                                        <Plus className="size-4" />
                                        Add Definition
                                    </Button>
                                </div>
                            )}
                            {data.definitions.map((def, index) => (
                                <div key={index} className="px-6 py-5">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col gap-1.5">
                                            <Label>Language</Label>
                                            <Select
                                                value={def.language}
                                                onValueChange={(v) => updateDefinition(index, 'language', v)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {LANGUAGE_OPTIONS.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label>Reference</Label>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDefinition(index)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                    aria-label="Remove definition"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                            <ReferenceCombobox
                                                id={`def_ref_${index}`}
                                                references={references}
                                                value={def.reference_id}
                                                onChange={(id) => setDefinitionRef(index, id)}
                                                placeholder="Link to a reference..."
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-col gap-1.5">
                                        <Label>
                                            Definition Text{' '}
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <textarea
                                            rows={4}
                                            placeholder="Enter the detailed definition here..."
                                            value={def.definition}
                                            onChange={(e) => updateDefinition(index, 'definition', e.target.value)}
                                            className={cn(
                                                'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                                                allErrors[`definitions.${index}.definition`]
                                                    ? 'border-destructive'
                                                    : '',
                                            )}
                                            aria-invalid={!!allErrors[`definitions.${index}.definition`]}
                                        />
                                        <InputError message={allErrors[`definitions.${index}.definition`]} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right sidebar */}
                <div className="flex flex-col gap-4">
                    {/* Publishing */}
                    <section className="rounded-xl border bg-card shadow-sm">
                        <div className="px-5 py-4">
                            <h2 className="font-semibold">Publishing</h2>
                        </div>
                        <Separator />
                        <div className="flex flex-col gap-4 px-5 py-4">
                            <div className="flex flex-col gap-1.5">
                                <Label>Approval Status</Label>
                                <Select
                                    value={String(data.is_approved)}
                                    onValueChange={(v) => setData('is_approved', v === 'true')}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="was_sent_to_telegram"
                                    checked={data.was_sent_to_telegram}
                                    onCheckedChange={(checked) =>
                                        setData('was_sent_to_telegram', checked === true)
                                    }
                                />
                                <Label htmlFor="was_sent_to_telegram" className="cursor-pointer font-normal">
                                    Generate Telegram Image Card
                                </Label>
                            </div>
                        </div>
                    </section>

                    {/* Classification */}
                    <section className="rounded-xl border bg-card shadow-sm">
                        <div className="px-5 py-4">
                            <h2 className="font-semibold">Classification</h2>
                        </div>
                        <Separator />
                        <div className="flex flex-col gap-5 px-5 py-4">
                            {/* Sectors */}
                            <div className="flex flex-col gap-2">
                                <Label className="flex items-center gap-1.5">
                                    <span className="i-lucide-tag size-3.5" />
                                    Sectors
                                </Label>
                                <div className="rounded-md border overflow-hidden">
                                    <div className="max-h-40 overflow-y-auto divide-y">
                                        {sectors.map((sector) => {
                                            const selected = data.sector_ids.includes(sector.id);
                                            return (
                                                <button
                                                    key={sector.id}
                                                    type="button"
                                                    onClick={() => toggleMultiSelect('sector_ids', sector.id)}
                                                    className={cn(
                                                        'w-full px-3 py-2 text-left text-sm transition-colors',
                                                        selected
                                                            ? 'bg-primary/10 text-primary font-medium'
                                                            : 'hover:bg-muted/50',
                                                    )}
                                                >
                                                    {sector.title_en}
                                                </button>
                                            );
                                        })}
                                        {sectors.length === 0 && (
                                            <p className="px-3 py-2 text-sm text-muted-foreground">No sectors available.</p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Hold Cmd/Ctrl to select multiple</p>
                                {data.sector_ids.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {data.sector_ids.map((id) => {
                                            const s = sectors.find((x) => x.id === id);
                                            return s ? (
                                                <Badge key={id} variant="secondary" className="gap-1 text-xs">
                                                    {s.title_en}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleMultiSelect('sector_ids', id)}
                                                        className="hover:text-destructive"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </Badge>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Term Groups */}
                            <div className="flex flex-col gap-2">
                                <Label className="flex items-center gap-1.5">
                                    Term Groups
                                </Label>
                                <div className="rounded-md border overflow-hidden">
                                    <div className="max-h-40 overflow-y-auto divide-y">
                                        {termGroups.map((group) => {
                                            const selected = data.term_group_ids.includes(group.id);
                                            return (
                                                <button
                                                    key={group.id}
                                                    type="button"
                                                    onClick={() => toggleMultiSelect('term_group_ids', group.id)}
                                                    className={cn(
                                                        'w-full px-3 py-2 text-left text-sm transition-colors',
                                                        selected
                                                            ? 'bg-primary/10 text-primary font-medium'
                                                            : 'hover:bg-muted/50',
                                                    )}
                                                >
                                                    {group.title_en}
                                                </button>
                                            );
                                        })}
                                        {termGroups.length === 0 && (
                                            <p className="px-3 py-2 text-sm text-muted-foreground">No groups available.</p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Hold Cmd/Ctrl to select multiple</p>
                                {data.term_group_ids.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {data.term_group_ids.map((id) => {
                                            const g = termGroups.find((x) => x.id === id);
                                            return g ? (
                                                <Badge key={id} variant="secondary" className="gap-1 text-xs">
                                                    {g.title_en}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleMultiSelect('term_group_ids', id)}
                                                        className="hover:text-destructive"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </Badge>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </form>
    );
}
