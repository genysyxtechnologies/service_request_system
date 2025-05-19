import { ManagerValues, NewManager } from "../utils/types";
import { RequestRepository } from "./request.repository";

class ManagersRepository extends RequestRepository {
  constructor(token?: string) {
    super(token);
  }

  async updateManager(endpoint: string, payload: ManagerValues) {
    try {
      const response = await this.api.put(
        endpoint,
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          username: payload.username,
          email: payload.email,
        },
        this.token
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  async createManager(endpoint: string, payload: NewManager) {
    try {
      const response = await this.api.post(
        endpoint,
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          username: payload.username,
          email: payload.email,
        },
        this.token
      );
      return response;
    } catch (error) {
      return error;
    }
  }
}

export default ManagersRepository;
