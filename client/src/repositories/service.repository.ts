import { Api } from "../utils/api";

export class ServiceRepository {

    constructor(protected token?: string) { }
    protected api = new Api();
    // CREATE service
    createService = async (endpoint: string, data: Record<string, string | any>) => {
        try {
            const response = await this.api.post(endpoint, data, this.token);
            return response;
        } catch (error) {
            return error;
        }
    }

    // GET services
    getServices = async (endpoint: string) => {
        try {
            const response = await this.api.get(endpoint, this.token);
            return response;
        } catch (error) {
            return error;
        }
    
    }

    // GET service
    getService = async (endpoint: string, id: number) => {
        try {
            const response = await this.api.get(`${endpoint}/${id}`);
            return response;
        } catch (error) {
            return error;
        }
    }
   
  // DELET service
    deleteService = async (endpoint: string, id: number) => {
        try {
            const response = await this.api.delete(`${endpoint}/${id}`, this.token);
            return response;
        } catch (error) {
            return error;
        }
    }  
  
 // UPDATE service
    updateService = async (endpoint: string, id: number, data: Record<string, string | any>) => {
        try {
            const response = await this.api.put(`${endpoint}/${id}`, data, this.token);
            return response;
        } catch (error) {
            return error;
        }
    }
 

 // UPDATE services
}
