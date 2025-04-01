import { useState } from "react";
import { ServiceRepository } from "../../repositories/service.repository";
import { AxiosData, NewService, ServiceData } from "../../utils/types";
import { ENDPOINTS } from "../../utils/endpoints";

export const useServices = (token: string) => {
    const service = new ServiceRepository(token);
    const [services, setServices] = useState<NewService>({ name: "", description: "", fields: "", categoryId: 0, isActive: true });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>('');
    const [serviceId, setServiceId] = useState<number>(0);


    // post service
    const createService = async () => {
        console.log(token)
        console.log(services);
        setLoading(true);
        try {
            const response = await service.createService(ENDPOINTS.CREATE_SERVICE, services);
            if (response as AxiosData) {
                console.log((response as AxiosData).data);
            }
            setLoading(false);
        } catch (error) {
            console.log(error)
            setError(error);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }

    // GET services
    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await service.getServices(ENDPOINTS.GET_SERVICES);
            if (response as AxiosData) {
                console.log((response as AxiosData).data);
                return (response as AxiosData);
            }
            setLoading(false);
            console.log(response)
        } catch (error) {
            console.log(error);
            setError(error);
        }
        finally {
            setLoading(false);
        }
    }


    // DELETE Services
    const deleteService = async () => {
        setLoading(true);
        try {
            const response = await service.deleteService(ENDPOINTS.DELETE_SERVICE, serviceId);
            if (response as AxiosData) {
                console.log((response as AxiosData).data);
            }
            setLoading(false);
            console.log(response)
        } catch (error) {
            console.log(error)
            setError(error);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }

    // UPDATE services
    const updateService = async (services: ServiceData, serviceId: number) => {
        setLoading(true);
        console.log('SERVICES', services);
        try {
            const response = await service.updateService(ENDPOINTS.UPDATE_SERVICE, serviceId, services);
            if (response as AxiosData) {
                console.log((response as AxiosData).data);
            }
            setLoading(false);
        } catch (error) {
            console.log(error)
            setError(error);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }



    return { createService, services, loading, error, setServices, fetchServices, deleteService, serviceId, setServiceId, updateService }
}