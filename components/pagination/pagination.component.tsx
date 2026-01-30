'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [middlePages, setMiddlePages] = useState<number[]>([]);

  useEffect(() => {
    setTotalPages(Math.ceil(dataLength / qtyPerPage));
  }, [dataLength]);

  useEffect(() => {
    const page = searchParams.get('page');
    setCurrentPage(Number(page) ?? 1);
  }, [searchParams]);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  // const getPages = () => {
  //   const pages: (number | 'start-ellipsis' | 'end-ellipsis')[] = [];

  //   if (totalPages <= 7) {
  //     for (let i = 1; i <= totalPages; i++) pages.push(i);
  //     return pages;
  //   }

  //   const firstPage = 1;
  //   const secondPage = 2;
  //   const lastPage = totalPages;
  //   const secondLastPage = totalPages - 1;

  //   const hasLeftGap = currentPage > 2;
  //   const hasRightGap = currentPage < totalPages - 3;

  //   pages.push(firstPage, secondPage);

  //   if (hasLeftGap) {
  //     pages.push('start-ellipsis');
  //   }
  //   const middlePages: number[] = [];

  //   for (let p = currentPage - 1; p <= currentPage + 1; p++) {
  //     if (p > 2 && p < totalPages - 1) {
  //       middlePages.push(p);
  //     }
  //   }

  //   middlePages.forEach((p) => {
  //     if (!pages.includes(p)) pages.push(p);
  //   });

  //   if (hasRightGap) {
  //     pages.push('end-ellipsis');
  //   }

  //   if (!pages.includes(secondLastPage)) pages.push(secondLastPage);
  //   if (!pages.includes(lastPage)) pages.push(lastPage);

  //   return pages;
  // };

  // const logicalPages = getPages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLinkItem
            href={createPageUrl(currentPage - 1)}
            aria-disabled={currentPage === 1}
            className={cn('flex items-center font-medium p-1 gap-1')}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden md:inline">Anterior</span>
          </PaginationLinkItem>
        </PaginationItem>

        {Array.from({ length: 2 }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href={createPageUrl(index + 1)}
              isActive={index + 1 === currentPage}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > 7 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {middlePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={createPageUrl(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > 7 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {[totalPages - 1, totalPages].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={createPageUrl(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLinkItem
            href={createPageUrl(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            className={cn('flex items-center font-medium p-1 gap-1')}
          >
            <span className="hidden md:inline">Próximo</span>
            <ChevronRight className="h-4 w-4" />
          </PaginationLinkItem>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
