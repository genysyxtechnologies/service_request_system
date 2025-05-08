import { useState } from "react";
import ManagersRepository from "../../repositories/managers.repository";
import { ENDPOINTS } from "../../utils/endpoints";
import { AxiosData, UserUpdateValues } from "../../utils/types";

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
  const updateUser = async (user: UserUpdateValues) => {
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
  };
};

export default useManagers;
