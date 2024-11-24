import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Meta } from "@/types/api";
import { Dispatch, SetStateAction } from "react";

export const TablePagination: React.FC<{
  data?: Meta | null;
  onChange: Dispatch<SetStateAction<Meta>>;
}> = ({ data, onChange }) => {
  if (!data) {
    return;
  }

  const { hasNextPage, hasPreviousPage, page, pageCount } = data;

  const handleSelect = (number: number) => {
    if (number === page) {
      return;
    }

    onChange((prevMeta) => {
      return {
        ...prevMeta,
        page: number,
      };
    });
  };

  const handleSelectPrev = () => {
    onChange((prevMeta) => {
      return {
        ...prevMeta,
        page: page - 1,
      };
    });
  };

  const handleSelectNext = () => {
    onChange((prevMeta) => {
      return {
        ...prevMeta,
        page: page + 1,
      };
    });
  };

  return (
    <div className="ml-auto">
      <Pagination>
        <PaginationContent>
          {hasPreviousPage && (
            <PaginationItem onClick={handleSelectPrev}>
              <PaginationPrevious />
            </PaginationItem>
          )}
          {Array.from({ length: pageCount }, (_, index) => (
            <PaginationItem key={index} onClick={() => handleSelect(index + 1)}>
              <PaginationLink isActive={index + 1 === page}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {/* {pageCount > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )} */}
          {hasNextPage && (
            <PaginationItem onClick={handleSelectNext}>
              <PaginationNext />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
