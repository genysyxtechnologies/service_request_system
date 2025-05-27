import { useState } from "react";
import RequestersRepository from "../../repositories/requesters.repository";
import { ENDPOINTS } from "../../utils/endpoints";
import { AxiosData } from "../../utils/types";
import DepartmentRepository from "../../repositories/department.repository";

// Interface for paginated API responses
type PaginatedResponse = {
  content: any[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
};

// Interface for synchronization response
type SyncResponse = {
  success: boolean;
  data?: any;
  message: string;
  error?: any;
};

export const useRequesters = (token: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [message, setMessage] = useState<{
    isSuccess: boolean;
    content: string;
  }>({
    isSuccess: false,
    content: "",
  });
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const fetchAllRequesters = async (
    url: string
  ): Promise<PaginatedResponse | null> => {
    const requestersRepository = new RequestersRepository(token);
    setLoading(true);
    setError(null);
    try {
      const response = await requestersRepository.getAllRequests(url);
      if ((response as AxiosData).status === 200) {
        return (response as AxiosData).data as PaginatedResponse;
      }
      return null;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // RESET REQUESTERS PASSWORD
  const resetPassword = async (requesterId: number) => {
    const requestersRepository = new RequestersRepository(token);
    setLoading(true);
    setError(null);
    try {
      const response = await requestersRepository.updateRequester(
        `${ENDPOINTS.RESET_REQUESTER_PASSWORD}/${requesterId}/reset-password`
      );
      if ((response as AxiosData).status === 200) {
        setMessage({
          isSuccess: true,
          content: (response as any).data,
        });
        return (response as AxiosData).data;
      }
      setMessage({
        isSuccess: false,
        content: "Failed to reset password",
      });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // fetch all user roles
  const fetchAllUserRoles = async () => {
    const requestersRepository = new RequestersRepository(token);
    try {
      const response = await requestersRepository.getAllRequests(
        ENDPOINTS.GET_USER_ROLES
      );
      if ((response as AxiosData).status === 200) {
        return (response as AxiosData).data;
      }
    } catch (error) {
      setError(error);
      return error;
    }
  };

  // syncronize users
  const syncronizeUsers = async (): Promise<SyncResponse> => {
    setLoading(true);
    const requestersRepository = new DepartmentRepository(token);
    try {
      const response = await requestersRepository.syncDepartments(
        ENDPOINTS.SYNC_USERS
      );
      if ((response as AxiosData).status === 202) {
        setMessage({
          isSuccess: true,
          content:
            "Users synchronized successfully! The system has been updated with the latest user information.",
        });
        return {
          success: true,
          data: (response as AxiosData).data,
          message:
            "Users synchronized successfully! The system has been updated with the latest user information.",
        };
      }
      return {
        success: false,
        message: "Synchronization did not complete. Please try again.",
      };
    } catch (error) {
      setError(error);
      setMessage({
        isSuccess: false,
        content: "Failed to synchronize users. Please try again later.",
      });
      return {
        success: false,
        error,
        message: "Failed to synchronize users. Please try again later.",
      };
    } finally {
      setLoading(false);
    }
  };

  // assign role to a user
  const assignRoleToUser = async (userId: number, role: string) => {
    setLoading(true);
    const requestersRepository = new RequestersRepository(token);
    try {
      const response = await requestersRepository.updateRequester(
        `${ENDPOINTS.ASSIGN_ROLE_TO_USER}/${userId}/assign-role?role=${role}`
      );
      if ((response as AxiosData).status === 200) {
        setMessage({
          isSuccess: true,
          content: "Role assigned successfully!",
        });
        console.log("THIS IS THE RESPONSE FROM THE ASSIGN ROLE: ", (response as AxiosData).data)
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
    fetchAllRequesters,
    resetPassword,
    fetchAllUserRoles,
    assignRoleToUser,
    userRoles,
    setUserRoles,
    loading,
    message,
    error,
    syncronizeUsers,
  };
};

export default useRequesters;
