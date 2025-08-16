import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { LayoutGroup, motion } from "framer-motion"

interface AppPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AppPagination({ page, totalPages, onPageChange }: AppPaginationProps) {
  const pagesToShow = 5
  let start = Math.max(1, page - Math.floor(pagesToShow / 2))
  let end = Math.min(totalPages, start + pagesToShow - 1)

  if (end - start + 1 < pagesToShow) {
    start = Math.max(1, end - pagesToShow + 1)
  }

  return (
    <LayoutGroup id="pagination">
      <Pagination>
        <PaginationContent>
          {/* Prev */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) onPageChange(page - 1)
              }}
            />
          </PaginationItem>

          {/* First Page Ellipsis */}
          {start > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(1)
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {/* Page Numbers */}
          {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
            <PaginationItem key={p} className="relative">
              {p === page && (
                <motion.div
                  layoutId="activePageHighlight"
                  className="absolute inset-0 rounded-md bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <PaginationLink
                className={`relative z-10 px-3 py-1 rounded-md ${
                  p === page ? "text-white font-semibold hover:bg-transparent" : "hover:bg-transparent"
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(p)
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Last Page Ellipsis */}
          {end < totalPages && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(totalPages)
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) onPageChange(page + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </LayoutGroup>
  )
}
