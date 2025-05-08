import { useState } from "react";
import RequestersRepository from "../../repositories/requesters.repository";
import { ENDPOINTS } from "../../utils/endpoints";
import { AxiosData } from "../../utils/types";

interface ApiResponse {
  content: any[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

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

  const fetchAllRequesters = async (url: string) => {
    const requestersRepository = new RequestersRepository(token);
    setLoading(true);
    setError(null);
    try {
      const response = await requestersRepository.getAllRequests(url);
      if ((response as AxiosData).status === 200) {
        return (response as AxiosData).data;
      }
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
      const response = await requestersRepository.updateRequesterPassword(
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

  return {
    fetchAllRequesters,
    resetPassword,
    loading,
    message,
    error,
  };
};

export default useRequesters;
