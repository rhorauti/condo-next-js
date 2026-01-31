'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CircleArrowLeft,
  CircleArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaginationLinkItem } from './pagination-link';

type PaginationProps = {
  dataLength: number;
  qtyPerPage: number;
};

export function PaginationComponent({
  dataLength,
  qtyPerPage,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageQueryParams = searchParams.get('page');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setTotalPages(Math.ceil(dataLength / qtyPerPage));
  }, [dataLength, qtyPerPage]);

  useEffect(() => {
    const pageFromQuery = Number(pageQueryParams);
    setCurrentPage(!pageFromQuery || pageFromQuery < 1 ? 1 : pageFromQuery);
  }, [pageQueryParams]);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  const pagesArray = useMemo(() => {
    if (totalPages < 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (totalPages > 7 && currentPage < 5) {
      return [1, 2, 3, 4, 5, 'start-ellipsis', totalPages - 1, totalPages];
    } else if (totalPages > 7 && currentPage < totalPages - 3) {
      return [
        1,
        2,
        'start-ellipsis',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        'end-ellipsis',
        totalPages - 1,
        totalPages,
      ];
    } else {
      return [
        1,
        2,
        'end-ellipsis',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
  }, [currentPage, totalPages]);

  return (
    <Pagination>
      <PaginationContent className={cn('text-sm')}>
        {currentPage == 1 ? (
          <div className="flex gap-2 p-1 items-center font-semibold text-gray-400 dark:text-gray-500">
            <CircleArrowLeft className="h-4 w-4" />
            <span className="hidden md:inline">Anterior</span>
          </div>
        ) : (
          <PaginationItem>
            <PaginationLinkItem
              href={createPageUrl(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={cn('flex items-center font-medium p-1 gap-2')}
            >
              <CircleArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">Anterior</span>
            </PaginationLinkItem>
          </PaginationItem>
        )}

        <div className="hidden md:flex items-center">
          {pagesArray.map((page, index) => {
            {
              if (page == 'start-ellipsis' || page == 'end-ellipsis') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              } else {
                if (typeof page == 'number') {
                  return (
                    <PaginationItem key={`number-${index}`}>
                      <PaginationLinkItem
                        href={createPageUrl(page)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLinkItem>
                    </PaginationItem>
                  );
                }
              }
            }
          })}
        </div>

        <div className="md:hidden">
          {currentPage} de {totalPages}
        </div>

        {currentPage === totalPages ? (
          <div className="flex gap-2 p-1 items-center font-semibold text-gray-400 dark:text-gray-500">
            {' '}
            <span className="hidden md:inline">Próximo</span>
            <CircleArrowRight className="h-4 w-4" />
          </div>
        ) : (
          <PaginationItem>
            <PaginationLinkItem
              href={createPageUrl(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={cn('flex items-center font-medium p-1 gap-2')}
            >
              <span className="hidden md:inline">Próximo</span>
              <CircleArrowRight className="h-4 w-4" />
            </PaginationLinkItem>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
