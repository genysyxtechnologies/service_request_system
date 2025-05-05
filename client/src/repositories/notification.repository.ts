import { ServiceRepository } from "./service.repository";

class NotificationRepository extends ServiceRepository {
    constructor(token?: string) {
        super(token);
    }
}

export default NotificationRepository;
