import { ServiceRepository } from "./service.repository";

class NotificationRepository extends ServiceRepository {
  constructor(token?: string) {
    super(token);
  }

  updateNotification = async (endpoint: string) => {
    try {
      const response = await this.api.put(endpoint, {}, this.token);
      return response;
    } catch (error) {
      return error;
    }
  };
}

export default NotificationRepository;
