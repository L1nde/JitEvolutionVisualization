import BaseApi from "@/api/base";
import { AppDetailDto, AppDto } from "@/models";

export default class AppApi extends BaseApi {
  protected baseRoute = "app";

  getAll() {
    return this._get<AppDto[]>(this.baseRoute);
  }

  get(id: string) {
    return this._get<AppDetailDto>(`${this.baseRoute}`, {
      params: { projectId: id },
    });
  }
}
