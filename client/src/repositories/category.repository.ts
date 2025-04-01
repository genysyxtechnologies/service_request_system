import { Api } from "../utils/api";
import { ServiceRepository } from "./service.repository";

export class CategoryRepository extends ServiceRepository {
    constructor(token?: string) {
        super(token);
    }
    api = new Api();


    updateCategory = async (url: string, data: Record<string, string | any> | any) => {
        try {
            const response = await this.api.put(url, data, this.token);
            return response;
        } catch (error) {
            return error;

        }
    }
}