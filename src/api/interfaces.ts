export interface ApiFilter {
  field: string;
  value?: () => string;
  op?: string;
}
