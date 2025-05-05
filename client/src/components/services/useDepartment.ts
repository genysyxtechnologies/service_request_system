import { useState } from "react";
import DepartmentRepository from "../../repositories/department.repository";
import { AxiosData, Department } from "../../utils/types";
import { ENDPOINTS } from "../../utils/endpoints";

const useDepartment = (token: string) => {
  const department = new DepartmentRepository(token);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>("");
  const [departments, setDepartments] = useState<Department[]>([]);

  const syncDepartments = async () => {
    setLoading(true);
    try {
      const response = await department.syncDepartments();
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await department.getServices(ENDPOINTS.GET_DEPARTMENTS);
      if ((response as AxiosData).status === 200) {
        return (response as AxiosData).data as Department[];
      }
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    syncDepartments,
    fetchDepartments,
    loading,
    error,
    departments,
    setDepartments,
  };
};

export default useDepartment;
