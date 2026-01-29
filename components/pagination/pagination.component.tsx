'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PaginationProps {
  totalQtyUsers?: number;
}

export function PaginationComponent({ totalQtyUsers }: PaginationProps) {
  const [pageArray, setPageArray] = useState<unknown[]>([]);
  useEffect(() => {}, [pageArray]);

  const calculatePageArray = (): unknown[] => {
    return [];
  };

  return (
    <Pagination>
      <PaginationContent
        className={cn(
          'flex flex-col md:flex-row md:items-center w-full',
          totalQtyUsers ? 'md:justify-between' : 'md:justify-end'
        )}
      >
        {totalQtyUsers && (
          <p>
            Total de <span>{totalQtyUsers} usuários</span>
          </p>
        )}
        <div className="flex gap-1">
          <PaginationItem className={cn('hover:rounded-lg flex items-center')}>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem
            className={cn('hover:rounded-full px-2 flex items-center')}
          >
            <Link href="#">1</Link>
          </PaginationItem>
          <PaginationItem
            className={cn('hover:rounded-full px-2 flex items-center')}
          >
            <Link href="#">2</Link>
          </PaginationItem>
          <PaginationItem
            className={cn('hover:rounded-full px-2 flex items-center')}
          >
            <Link href="#">3</Link>
          </PaginationItem>
          <PaginationItem
            className={cn('hover:rounded-full px-2 flex items-center')}
          >
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem className={cn('hover:rounded-lg flex items-center')}>
            <PaginationNext href="#" />
          </PaginationItem>
        </div>
      </PaginationContent>
    </Pagination>
  );
}
