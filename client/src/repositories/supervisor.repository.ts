import { ServiceRepository } from "./service.repository";

class SupervisorRepository extends ServiceRepository {
  constructor(token?: string) {
    super(token);
  }
}

export default SupervisorRepository;
