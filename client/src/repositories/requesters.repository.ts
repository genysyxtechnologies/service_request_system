import { RequestRepository } from "./request.repository";

class RequestersRepository extends RequestRepository {
  constructor(token?: string) {
    super(token);
  }

  updateRequester(endpoint: string) {
    try {
      const response = this.api.put(endpoint, {}, this.token);
      return response;
    } catch (error) {
      return error;
    }
  }
}

export default RequestersRepository;
