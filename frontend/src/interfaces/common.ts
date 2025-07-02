export interface OptionItem {
  label: string;
  value: string;
  [propName: string]: any;
}

export interface PageQuery {
  pageNum?: number;
  pageSize?: number;
}
