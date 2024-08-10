type PaginationTable = {
  count: number;
  pageSize: number;
  pageIndex: number;
  pageCount: number;
  canPreviousPage?: boolean;
  canNextPage?: boolean;
};

export default PaginationTable;
