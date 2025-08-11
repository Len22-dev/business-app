import { asc, desc, like, or } from "drizzle-orm"

export const buildSearchCondition = (searchTerm: string, columns: any[]) => {
  if (!searchTerm) return undefined
  return or(...columns.map(col => like(col, `%${searchTerm}%`)))
}

export const buildSortCondition = (sortBy: string, sortOrder: 'asc' | 'desc', table: any) => {
  if (!sortBy || !table[sortBy]) return desc(table.createdAt)
  return sortOrder === 'asc' ? asc(table[sortBy]) : desc(table[sortBy])
}

export const buildPaginationCondition = (page: number, limit: number) => {
  const offset = (page - 1) * limit
  return { limit, offset }
}