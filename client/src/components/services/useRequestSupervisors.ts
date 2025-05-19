import { useState } from "react";
import { RequestRepository } from "../../repositories/request.repository";
import { ENDPOINTS } from "../../utils/endpoints";
import { AxiosData } from "../../utils/types";

export const useRequestSupervisors = (token: string) => {
  const request = new RequestRepository(token);
  const [loading, setLoading] = useState<boolean>(false);

  // get all request for supervisors
  const fetchRequestForSupervisors = async () => {
    setLoading(true);
    try {
      const response = await request.getAllRequests(
        `${ENDPOINTS.GET_SUPERVISORS}?page=1&size=10`
      );
      return (response as AxiosData).data;
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchRequestForSupervisors,
    loading,
  };
};
