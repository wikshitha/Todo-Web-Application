import api from "@/lib/api";

import type {
  PaginatedTodoResponse,
  Todo,
  TodoFormData,
  TodoListParams,
  TodoResponse,
  TodoStats,
  TodoStatsResponse,
} from "@/types/todo";

export const getTodos = async (
  params: TodoListParams = {}
): Promise<PaginatedTodoResponse> => {
  const response = await api.get<PaginatedTodoResponse>(
    "/api/todos",
    {
      params,
    }
  );

  return response.data;
};

export const getTodoStats = async (): Promise<TodoStats> => {
  const response = await api.get<TodoStatsResponse>(
    "/api/todos/stats"
  );

  return response.data.data;
};

export const getTodo = async (
  todoId: number
): Promise<Todo> => {
  const response = await api.get<TodoResponse>(
    `/api/todos/${todoId}`
  );

  return response.data.data;
};

export const createTodo = async (
  data: TodoFormData
): Promise<Todo> => {
  const response = await api.post<TodoResponse>(
    "/api/todos",
    data
  );

  return response.data.data;
};

export const updateTodo = async (
  todoId: number,
  data: Partial<TodoFormData>
): Promise<Todo> => {
  const response = await api.patch<TodoResponse>(
    `/api/todos/${todoId}`,
    data
  );

  return response.data.data;
};

export const deleteTodo = async (
  todoId: number
): Promise<void> => {
  await api.delete(`/api/todos/${todoId}`);
};