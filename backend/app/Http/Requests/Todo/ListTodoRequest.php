<?php

namespace App\Http\Requests\Todo;

use App\Enums\TodoStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListTodoRequest extends FormRequest
{
    /**
     * Determine whether the user may list todos.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Validate the search, filter, sorting and pagination parameters.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'nullable',
                Rule::enum(TodoStatus::class),
            ],

            'sort_by' => [
                'nullable',
                Rule::in([
                    'created_at',
                    'updated_at',
                    'due_date',
                    'title',
                    'status',
                ]),
            ],

            'sort_direction' => [
                'nullable',
                Rule::in([
                    'asc',
                    'desc',
                ]),
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
        ];
    }
}
