import { Api } from "../utils/api";

export class UserRepository {
  constructor(protected token?: string) {
    this.token = token;
  }
  private api: Api = new Api();

  // GET users
  async getUsers(endpoint: string) {
    try {
      const response = await this.api.get(endpoint, this.token);
      return response;
    } catch (error) {
      return error;
    }
  }
}
