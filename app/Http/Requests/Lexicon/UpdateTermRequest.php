<?php

declare(strict_types=1);

namespace App\Http\Requests\Lexicon;

use App\Enums\Lexicon\Language;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateTermRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'term_kh' => ['required', 'string'],
            'term_en' => ['nullable', 'string'],
            'term_fr' => ['nullable', 'string'],
            'is_approved' => ['boolean'],
            'was_sent_to_telegram' => ['boolean'],
            'sector_ids' => ['array'],
            'sector_ids.*' => ['integer', 'exists:sectors,id'],
            'term_group_ids' => ['array'],
            'term_group_ids.*' => ['integer', 'exists:term_groups,id'],
            'definitions' => ['array'],
            'definitions.*.language' => ['required', Rule::enum(Language::class)],
            'definitions.*.reference_id' => ['nullable', 'integer', 'exists:references,id'],
            'definitions.*.definition' => ['required', 'string'],
            'reference_ids' => ['array'],
            'reference_ids.khmer' => ['nullable', 'integer', 'exists:references,id'],
            'reference_ids.english' => ['nullable', 'integer', 'exists:references,id'],
            'reference_ids.french' => ['nullable', 'integer', 'exists:references,id'],
        ];
    }
}
