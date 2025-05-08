import { Api } from "../utils/api";
import { ServiceRepository } from "./service.repository";
import { ENDPOINTS } from "../utils/endpoints";

class DepartmentRepository extends ServiceRepository {
  constructor(token?: string) {
    super(token);
  }
  api = new Api();

  syncDepartments = async () => {
    try {
      const response = await this.api.post(
        ENDPOINTS.SYNC_DEPARTMENTS,
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
