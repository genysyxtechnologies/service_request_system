import { Api } from "../utils/api";
import { ServiceRepository } from "./service.repository";

class DepartmentRepository extends ServiceRepository {
  constructor(token?: string) {
    super(token);
  }
  api = new Api();

  syncDepartments = async (endpoint: string) => {
    try {
      const response = await this.api.post(
        endpoint,
        {},
        this.token
      );
      return response;
    } catch (error) {
      return error;
    }
  };
}

export default DepartmentRepository;
