export type TodoStatus =
  | "TODO"
  | "PENDING"
  | "COMPLETED";

export type TodoSortBy =
  | "created_at"
  | "updated_at"
  | "due_date"
  | "title"
  | "status";

export type SortDirection = "asc" | "desc";

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: TodoStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoFormData {
  title: string;
  description?: string | null;
  status?: TodoStatus;
  due_date?: string | null;
}

export interface TodoListParams {
  search?: string;
  status?: TodoStatus | "";
  sort_by?: TodoSortBy;
  sort_direction?: SortDirection;
  per_page?: number;
  page?: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedTodoResponse {
  data: Todo[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface TodoResponse {
  data: Todo;
}

export interface TodoStats {
  total: number;
  todo: number;
  pending: number;
  completed: number;
  overdue: number;
}

export interface TodoStatsResponse {
  data: TodoStats;
}