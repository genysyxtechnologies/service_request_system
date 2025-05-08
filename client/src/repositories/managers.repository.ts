import { RequestRepository } from "./request.repository";

class ManagersRepository extends RequestRepository {
  constructor(token?: string) {
    super(token);
  }
}

export default ManagersRepository;
