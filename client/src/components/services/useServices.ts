import { useState } from "react";
import { ServiceRepository } from "../../repositories/service.repository";
import { AxiosData, NewService, ServiceData } from "../../utils/types";
import { ENDPOINTS } from "../../utils/endpoints";
import { toast } from "sonner";

export const useServices = (token: string) => {
  const service = new ServiceRepository(token);
  const [services, setServices] = useState<NewService>({
    name: "",
    description: "",
    fields: "",
    categoryId: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>("");
  const [isServerError, setIsServerError] = useState<boolean>(false);
  const [serviceId, setServiceId] = useState<number>(0);
  const [dashboad, setDashBoard] = useState<any>(null);

  // post service
  const createService = async () => {
    setLoading(true);
    try {
      const response = await service.createService(
        ENDPOINTS.CREATE_SERVICE,
        services
      );
      if (response as AxiosData) {
        toast.success("service created successfully!");
        setLoading(false);
        return response as AxiosData;
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // GET services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await service.getServices(ENDPOINTS.GET_SERVICES);
      if (response as AxiosData) {
        console.log("RESPONSE IS", response);
        return response as AxiosData;
      }
      
      setLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      console.log("FETCHING SERVICES")
      setLoading(false);
    }
  };

  // GET admin dashboard
  const fetchDashBoard = async () => {
    setLoading(true);
    try {
      const response = await service.getServices(
        ENDPOINTS.SUPER_ADMIN_DASHBOARD
      );
      if (response as AxiosData) {
        setIsServerError(false);
        return (response as AxiosData).data;
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setIsServerError(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // DELETE Services
  const deleteService = async (serviceId: number) => {
    setLoading(true);
    try {
      const response = await service.deleteService(
        ENDPOINTS.DELETE_SERVICE,
        serviceId
      );
      if (response as AxiosData) {
        setLoading(false);
        return response as AxiosData;
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE services
  const updateService = async (services: ServiceData, serviceId: number) => {
    setLoading(true);
    try {
      const response = await service.updateService(
        ENDPOINTS.UPDATE_SERVICE,
        serviceId,
        services
      );
      if ((response as AxiosData).status === 200) {
        toast.success("updated successfully");
        await fetchServices();
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    } finally {
      await fetchServices();
      setLoading(false);
    }
  };

  return {
    createService,
    services,
    loading,
    setLoading,
    error,
    setServices,
    fetchServices,
    fetchDashBoard,
    deleteService,
    serviceId,
    setServiceId,
    updateService,
    dashboad,
    setDashBoard,
    isServerError,
  };
};
