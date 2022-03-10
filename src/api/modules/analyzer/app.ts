import BaseApi from "@/api/base";
import { AppDetailDto, AppDto } from "@/models";

export default class AppApi extends BaseApi {
  protected baseRoute = "app";

  getAll() {
    return this._get<AppDto[]>(this.baseRoute);
  }

  getProjectVersions(projectId: string) {
    return this._get<number[]>(`${this.baseRoute}/version-number`, {
      params: { projectId: projectId },
    });
  }

  get(id: string, versionNumber: number | null) {
    return this._get<AppDetailDto>(`${this.baseRoute}`, {
      params: { projectId: id, versionNumber: versionNumber },
    });
  }
}
