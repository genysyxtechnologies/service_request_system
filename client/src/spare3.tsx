import axios, { AxiosRequestConfig } from 'axios';
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
        requestData: string,
        files: File[],
        config?: AxiosRequestConfig
    ) {
        try {
            const formData = new FormData();

            // Append each file
            files.forEach(file => {
                formData.append("attachment", file); // Note singular "attachment" as per your backend
            });

            const response = await axios.post(`${endpoint}/${serviceId}`, {requestData}, {
                ...config,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    ...config?.headers,
                    "Content-Type": "multipart/form-data",
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
        finally{
            console.log(requestData, serviceId);
            console.log('RAN SUCCESSFULLY')
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
            const response = await this.api.get(endpoint);
            return response;
        } catch (error) {
            return error;
        }
    }

    // get all repositories
    async getAllRequests(endpoint: string) {
        try {
            const response = await this.api.get(endpoint);
            return response;
        } catch (error) {
            return error;
        }
    }
}
