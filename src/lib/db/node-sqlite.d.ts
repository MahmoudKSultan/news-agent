declare module "node:sqlite" {
  class DatabaseSync {
    constructor(path: string, options?: { open?: boolean })
    exec(sql: string): void
    prepare(sql: string): StatementSync
    close(): void
  }

  interface StatementSync {
    run(params?: Record<string, unknown>): { changes: number; lastInsertRowid: number | bigint }
    get<T>(params?: Record<string, unknown>): T | undefined
    all<T>(params?: Record<string, unknown>): T[]
  }

  export { DatabaseSync }
}
