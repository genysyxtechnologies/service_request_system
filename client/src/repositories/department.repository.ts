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
      console.log("response from the root: ", response);
      return response;
    } catch (error) {
      console.log("error from the root: ", error);
      return error;
    }
  };
}

export default DepartmentRepository;
