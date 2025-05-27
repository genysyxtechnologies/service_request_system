import { useState } from "react";
import DepartmentRepository from "../../repositories/department.repository";
import { AxiosData, Department } from "../../utils/types";
import { ENDPOINTS } from "../../utils/endpoints";
import { toast } from "sonner";
import { AxiosError } from "axios";

const useDepartment = (token: string) => {
  const department = new DepartmentRepository(token);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>("");
  const [departments, setDepartments] = useState<Department[]>([]);

  const syncDepartments = async () => {
    setLoading(true);
    try {
      const response = await department.syncDepartments(ENDPOINTS.SYNC_DEPARTMENTS);
      setLoading(false);
      if ((response as AxiosData).status === 202) {
        return toast.success("Departments synced successfully!");
      }
      toast.error(
        (response as AxiosError).message || "fail to sync departments!"
      );
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
