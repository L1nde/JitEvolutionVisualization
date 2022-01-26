import BaseCrudApi from "@/api/baseCrud";
import { PasswordLoginDto, ProjectDto, UserDto, UserTokenDto } from "@/models";

export default class UserApi extends BaseCrudApi<UserDto> {
  protected baseRoute = "user";

  login(loginDto: PasswordLoginDto) {
    return this._post<UserTokenDto>("authentication/login", loginDto);
  }

  projects(userId: string) {
    return this._get<ProjectDto[]>(`${this.baseRoute}/${userId}/project`);
  }
}
