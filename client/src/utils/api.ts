import axios, { AxiosError } from "axios";
import { handleError } from "./errors";

export class Api {
    constructor() { }

    // POST request
    async post(url: string, data: Record<string, string | any>, token?: string) {
        try {
            const response = axios.post(url, data, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    }


    // GET request
    async get(url: string, token?: string) {
        try {
            const response = axios.get(url, { headers: token ? { Authorization: `Bearer ${token}`, } : {} });
            return Promise.resolve(response);
        } catch (error) {
            handleError(error as AxiosError)
            return Promise.reject(error);
        }
    }

    // PUT request
    async put(url: string, data: Record<string, string | any>, token?: string) {
        try {
            const response = axios.put(url, data, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // DELETE request
    async delete(url: string, token?: string) {
        try {
            const response = axios.delete(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}