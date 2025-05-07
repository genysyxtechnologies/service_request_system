import { RequestRepository } from "./request.repository";

class RequestersRepository extends RequestRepository {
  constructor(token?: string) {
    super(token);
  }
}

export default RequestersRepository;
