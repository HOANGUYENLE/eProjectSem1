<?php

namespace App\Http\Requests\Lawyer;

use Illuminate\Foundation\Http\FormRequest;

class SyncLawyerSpecializationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'specialization_ids' => ['required', 'array', 'min:1'],
            'specialization_ids.*' => ['integer', 'distinct', 'exists:specializations,id'],
        ];
    }
}