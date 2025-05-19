import { useState } from "react";
import { RequestRepository } from "../../repositories/request.repository";
import { ENDPOINTS } from "../../utils/endpoints";
import { AxiosData } from "../../utils/types";

export const useRequestSupervisors = (token: string) => {
  const request = new RequestRepository(token);
  const [loading, setLoading] = useState<boolean>(false);

  // get all request for supervisors
  const fetchRequestForSupervisors = async () => {
    console.log('Loading start');
    setLoading(true);
    try {
      const response = await request.getAllRequests(
        `${ENDPOINTS.GET_SUPERVISORS}?page=1&size=10`
      );
      console.log('API response received:', response);
      return (response as AxiosData).data;
    } catch (error) {
      console.error('API error:', error);
      return error;
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  return {
    fetchRequestForSupervisors,
    loading,
  };
};
