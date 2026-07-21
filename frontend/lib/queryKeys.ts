export const todoQueryKeys = {
  all: ["todos"] as const,

  lists: () =>
    [...todoQueryKeys.all, "list"] as const,

  list: (params: object) =>
    [...todoQueryKeys.lists(), params] as const,

  stats: () =>
    [...todoQueryKeys.all, "stats"] as const,

  details: () =>
    [...todoQueryKeys.all, "detail"] as const,

  detail: (todoId: number) =>
    [...todoQueryKeys.details(), todoId] as const,
};