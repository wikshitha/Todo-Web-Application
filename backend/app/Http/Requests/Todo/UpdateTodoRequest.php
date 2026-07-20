<?php

namespace App\Http\Requests\Todo;

use App\Enums\TodoStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTodoRequest extends FormRequest
{
    /**
     * Determine whether the user may submit this request.
     *
     * Ownership authorization will be handled by a Todo policy.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules for updating a todo.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'sometimes',
                'nullable',
                'string',
                'max:5000',
            ],

            'status' => [
                'sometimes',
                Rule::enum(TodoStatus::class),
            ],

            'due_date' => [
                'sometimes',
                'nullable',
                'date',
            ],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The todo title cannot be empty.',
            'title.max' => 'The todo title may not be greater than 255 characters.',
            'description.max' => 'The description may not be greater than 5000 characters.',
            'due_date.date' => 'The due date must be a valid date.',
        ];
    }
}
