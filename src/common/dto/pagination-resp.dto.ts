export class PaginationRespDto<T> {
  page: number;
  limit: number;
  records: T[];
  total: number;
}
