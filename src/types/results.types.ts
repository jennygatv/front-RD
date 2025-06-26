export interface ResultResponse {
  search_term: string;
  date: string;
  categories: ResultContentType[];
}

export interface ResultContentType {
  section: string;
  content: ResultType[];
}

export interface ResultType {
  title: string;
  display: string;
  data: any[];
}
