<?php

declare(strict_types=1);

namespace App\Http\Requests\Lexicon;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateReferenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:500'],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('references', 'code')->ignore($this->route('reference'))],
            'file' => ['nullable', 'file', 'max:51200', 'mimes:pdf,doc,docx,xls,xlsx,txt,png,jpg,jpeg'],
        ];
    }
}
