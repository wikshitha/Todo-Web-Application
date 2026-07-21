import type { TodoListParams } from "@/types/todo";

export const todoQueryKeys = {
  all: ["todos"] as const,

  lists: () =>
    [...todoQueryKeys.all, "list"] as const,

  list: (params: TodoListParams) =>
    [...todoQueryKeys.lists(), params] as const,

  stats: () =>
    [...todoQueryKeys.all, "stats"] as const,

};