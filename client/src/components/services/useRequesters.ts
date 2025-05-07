import { useState } from "react";
import RequestersRepository from "../../repositories/requesters.repository";
import { ENDPOINTS } from "../../utils/endpoints";

export const useRequesters = (token: string) => {
  const requestersRepository = new RequestersRepository(token);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>("");

  const fetchAllRequesters = async () => {
    setLoading(true);
    try {
      const response = await requestersRepository.getAllRequests(
        ENDPOINTS.GET_REQUESTERS
      );
      console.log("ALL REQUESTERS ARE: ", response);
      return response;
    } catch (error) {
      console.log("ERROR: ", error);
      setError(error);
      return error;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAllRequesters,
    loading,
    error,
  };
};

export default useRequesters;
