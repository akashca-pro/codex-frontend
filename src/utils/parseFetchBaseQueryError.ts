import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"

export function extractApiErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === "object" && "data" in error) {
    const err = error as FetchBaseQueryError & { data?: { message?: string } }
    return err.data?.message
  }
  return undefined
}