import { Api } from "../utils/api";
import { ChangePasswordFormValues } from "../utils/types";

export class AuthRepository {
  private api: Api = new Api();
  constructor() {}

  // signup
  signup = async (data: Record<string, string | any>) => {
    try {
      const response = await this.api.post("/api/auth/signup", data);
      return response;
    } catch (error) {
      return error;
    }
  };

  // signin
  signin = async (data: Record<string, string | any>) => {
    try {
      const response = await this.api.post("/api/auth/login", data);
      return response;
    } catch (error) {
      return error;
    }
  };

  // get user
  getUser = async () => {
    try {
      const response = await this.api.get("/api/auth/user");
      return response;
    } catch (error) {
      return error;
    }
  };

  // update password
  updatePassword = async (endpoint: string, payload: ChangePasswordFormValues, token: string) => {
    try {
      const response = await this.api.put(endpoint, {
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
      }, token);
      return response;
    } catch (error) {
      return error;
    }
  };
}
