import BaseApi from "./base";
import { ApiFilter } from "./interfaces";
import { serializeApiFilters } from "./utils";

export interface RequestParams {
  filters?: string;
  pageSize?: number;
}

export default abstract class BaseCrudApi<T> extends BaseApi {
  protected abstract baseRoute: string;

  getAll(filters?: ApiFilter[], pageSize?: number) {
    const requestParams = {
      filters: filters ? serializeApiFilters(filters) : null,
      pageSize: pageSize,
    } as RequestParams;

    return this._get<T[]>(this.baseRoute, { params: requestParams });
  }

  get(id: number) {
    return this._get<T>(`${this.baseRoute}/${id}`);
  }

  post(payload: T) {
    return this._post<T>(this.baseRoute, payload);
  }

  put(payload: T) {
    return this._put<T>(this.baseRoute, payload);
  }

  delete(id: number) {
    return this._delete<any>(`${this.baseRoute}/${id}`);
  }
}
