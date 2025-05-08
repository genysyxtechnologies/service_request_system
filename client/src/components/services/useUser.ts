import { useState } from "react";
import { AxiosData, SignUp } from "../../utils/types";
import { UserRepository } from "../../repositories/user.repository";
import { ENDPOINTS } from "../../utils/endpoints";

export const useUser = (token: string) => {
  const [allUsers, setAllUsers] = useState<SignUp[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>("");

  const userRepository = new UserRepository(token);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await userRepository.getUsers(ENDPOINTS.GET_USERS);
      if ((response as AxiosData).status === 200) {
        return (response as AxiosData).data;
      }
    } catch (error) {
      setError(error);
      return error;
    } finally {
      setLoading(false);
    }
  };

  return {
    allUsers,
    loading,
    error,
    fetchAllUsers,
  };
};
