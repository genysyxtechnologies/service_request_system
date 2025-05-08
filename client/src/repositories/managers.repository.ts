import { UserUpdateValues } from "../utils/types";
import { RequestRepository } from "./request.repository";

class ManagersRepository extends RequestRepository {
  constructor(token?: string) {
    super(token);
  }

  async updateManager(endpoint: string, payload: UserUpdateValues) {
    try {
      const response = await this.api.put(
        endpoint,
        { username: payload.username, email: payload.email },
        this.token
      );
      return response;
    } catch (error) {
      return error;
    }
  }
}

export default ManagersRepository;
