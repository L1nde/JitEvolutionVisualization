import { AxiosInstance, AxiosRequestConfig } from "axios";

export default abstract class BaseApi {
  protected instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  protected async _get<T>(uri: string, config?: AxiosRequestConfig) {
    const response = await this.instance.get<T>(uri, config);
    return response.data;
  }

  protected async _post<T>(uri: string, payload: any) {
    const response = await this.instance.post<T>(uri, payload);
    return response.data;
  }

  protected async _put<T>(uri: string, payload: any) {
    const response = await this.instance.put<T>(uri, payload);
    return response.data;
  }

  protected async _delete<T>(uri: string) {
    const response = await this.instance.delete<T>(uri);
    return response.data;
  }
}
