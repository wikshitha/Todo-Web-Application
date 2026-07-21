"use client";

import axios from "axios";
import {
  type SyntheticEvent,
  useState,
} from "react";

import type {
  LaravelValidationError,
  ValidationErrors,
} from "@/types/api";

import type {
  TodoFormData,
  TodoStatus,
} from "@/types/todo";

interface TodoFormProps {
  initialData?: TodoFormData;
  submitLabel?: string;
  submittingLabel?: string;
  onSubmit: (data: TodoFormData) => Promise<void>;
  onCancel: () => void;
}

const statusOptions: Array<{
  value: TodoStatus;
  label: string;
}> = [
  {
    value: "TODO",
    label: "To do",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
];

export default function TodoForm({
  initialData,
  submitLabel = "Create todo",
  submittingLabel = "Saving...",
  onSubmit,
  onCancel,
}: TodoFormProps) {
  const [title, setTitle] = useState(
    initialData?.title ?? ""
  );

  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [status, setStatus] = useState<TodoStatus>(
    initialData?.status ?? "TODO"
  );

  const [dueDate, setDueDate] = useState(
    initialData?.due_date
      ? initialData.due_date.slice(0, 16)
      : ""
  );

  const [error, setError] = useState("");

  const [
    validationErrors,
    setValidationErrors,
  ] = useState<ValidationErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setValidationErrors({});

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationErrors({
        title: ["The title field is required."],
      });

      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() || null,
        status,
        due_date: dueDate || null,
      });
    } catch (error: unknown) {
      if (
        axios.isAxiosError<LaravelValidationError>(
          error
        )
      ) {
        if (error.response?.status === 422) {
          setValidationErrors(
            error.response.data.errors ?? {}
          );

          return;
        }

        setError(
          error.response?.data?.message ??
            "Unable to save the todo."
        );

        return;
      }

      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="todo-title"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Title
        </label>

        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          maxLength={255}
          autoFocus
          placeholder="Enter a todo title"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />

        {validationErrors.title?.[0] && (
          <p className="mt-1.5 text-sm text-red-600">
            {validationErrors.title[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="todo-description"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Description
        </label>

        <textarea
          id="todo-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={4}
          placeholder="Add more details about this todo"
          className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />

        {validationErrors.description?.[0] && (
          <p className="mt-1.5 text-sm text-red-600">
            {validationErrors.description[0]}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="todo-status"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Status
          </label>

          <select
            id="todo-status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as TodoStatus
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          {validationErrors.status?.[0] && (
            <p className="mt-1.5 text-sm text-red-600">
              {validationErrors.status[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="todo-due-date"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Due date
          </label>

          <input
            id="todo-due-date"
            type="datetime-local"
            value={dueDate}
            onChange={(event) =>
              setDueDate(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />

          {validationErrors.due_date?.[0] && (
            <p className="mt-1.5 text-sm text-red-600">
              {validationErrors.due_date[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? submittingLabel
            : submitLabel}
        </button>
      </div>
    </form>
  );
}