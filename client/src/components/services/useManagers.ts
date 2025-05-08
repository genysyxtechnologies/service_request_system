import { useState } from "react";
import ManagersRepository from "../../repositories/managers.repository";
import { ENDPOINTS } from "../../utils/endpoints";
import { AxiosData, ManagerValues, NewManager } from "../../utils/types";

export interface Manager {
  id: number;
  username: string;
  email: string;
  role?: string;
  status?: "active" | "inactive";
}

interface ApiResponse {
  content: Manager[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export const useManagers = (token: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  // create new manager
  const createManager = async (user: NewManager) => {
    const manager = new ManagersRepository(token);
    setLoading(true);
    setError(null);
    try {
      const response = await manager.createManager(
        `${ENDPOINTS.CREATE_MANAGER}`,
        user
      );
      if ((response as AxiosData).status === 200) {
        console.log("NEW MANAGER IS: ", response);
        return { response: (response as AxiosData).data, created: true };
      }
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async (page = 0, size = 10, search = "") => {
    const manager = new ManagersRepository(token);
    setLoading(true);
    setError(null);
    try {
      const response = await manager.getServices(
        `${ENDPOINTS.GET_MANAGERS}?page=${page}&size=${size}&search=${search}`
      );
      if ((response as AxiosData).status === 200) {
        return (response as AxiosData).data;
      }
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // update user
  const updateUser = async (user: ManagerValues) => {
    const manager = new ManagersRepository(token);
    setLoading(true);
    setError(null);
    try {
      const response = await manager.updateManager(
        `${ENDPOINTS.UPDATE_MANAGER}/${user.id}`,
        user
      );
      if ((response as AxiosData).status === 200) {
        return (response as AxiosData).data;
      }
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchManagers,
    loading,
    error,
    updateUser,
    createManager,
  };
};

export default useManagers;
