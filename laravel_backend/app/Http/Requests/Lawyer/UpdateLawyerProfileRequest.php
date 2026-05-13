<?php
namespace App\Http\Requests\Lawyer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLawyerProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $lawyerId = auth()->id();

        return [
            'address' => ['required', 'string', 'max:200'],
            'yearExp' => ['nullable', 'integer', 'min:0', 'max:80'],
            'cardNumber' => [
                'required',
                'string',
                'max:20',
                Rule::unique('lawyersfiles', 'cardNumber')->ignore($lawyerId, 'lawyer_id'),
            ],
            'city' => ['required', 'exists:cities,id'],
            'licenseNumber' => [
                'required',
                'string',
                'max:50',
                Rule::unique('lawyersfiles', 'licenseNumber')->ignore($lawyerId, 'lawyer_id'),
            ],
            'documentImage' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
        ];
    }
}