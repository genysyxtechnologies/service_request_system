import { Api } from "../utils/api";
import { ServiceRepository } from "./service.repository";

export class RequestRepository extends ServiceRepository {
  constructor(token?: string) {
    super(token);
  }
  api = new Api();

  async createRequest(
    endpoint: string,
    serviceId: number,
    departmentId: number,
    requestData: string
  ) {
    try {
      const response = await this.api.post(
        `${endpoint}/${serviceId}`,
        { requestData, userDepartmentId: departmentId },
        this.token
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  // update repository with form data
  async updateRequest(endpoint: string, formData: FormData) {
    try {
      const response = await this.api.put(endpoint, formData);
      return response;
    } catch (error) {
      return error;
    }
  }

  // update status
  async updateStatus(
    endpoint: string,
    status: string,
    rejectionReason?: string
  ) {
    try {
      const response = await this.api.put(
        endpoint,
        { status, rejectionReason },
        this.token
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  // delete repository
  async deleteRequest(endpoint: string) {
    try {
      const response = await this.api.delete(endpoint);
      return response;
    } catch (error) {
      return error;
    }
  }

  // get repository
  async getRequest(endpoint: string) {
    try {
      const response = await this.api.get(endpoint, this.token);
      return response;
    } catch (error) {
      return error;
    }
  }

  // get all repositories
  async getAllRequests(endpoint: string) {
    try {
      const response = await this.api.get(endpoint, this.token);
      return response;
    } catch (error) {
      return error;
    }
  }
}
