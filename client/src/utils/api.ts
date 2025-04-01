import axios from "axios";

export class Api {
    constructor() { }

    // POST request
    post(url: string, data: Record<string, string | any>, token?: string) {
        try {
            const response = axios.post(url, data, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            return Promise.resolve(response);
        } catch (error) {
            console.log(error)
            return Promise.reject(error);
        }
    }


    // GET request
    get(url: string, token?: string) {
        try {
            const response = axios.get(url, { headers: token ? { Authorization: `Bearer ${token}`, } : {} });
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // PUT request
    put(url: string, data: Record<string, string | any>, token?: string) {
        try {
            const response = axios.put(url, data, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // DELETE request
    delete(url: string, token?: string) {
        try {
            const response = axios.delete(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}