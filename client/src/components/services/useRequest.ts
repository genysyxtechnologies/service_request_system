import { useContext, useState } from "react";
import { message } from "antd";
import { AxiosData, AxiosError } from "../../utils/types";
import { ENDPOINTS } from "../../utils/endpoints";
import { RequestRepository } from "../../repositories/request.repository";
import RequestContext from "../../context/request.context/RequestContext";

interface RequestData {
  requestData: string;
  attachment: File[];
}

interface RequestItem {
  id: number;
  requestData: string;
  serviceName: string;
  status: string;
  submissionDate: string;
  submittedBy: string;
  attachmentUrl: string | null;
}

interface PaginationData {
  content: RequestItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const useRequest = (token: string, isAdmin?: boolean) => {
  const { setRefreshRequest } = useContext(RequestContext);
  const [requestForm, setRequestForm] = useState<
    Omit<RequestData, "attachment">
  >({
    requestData: "",
  });
  const [attachment, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const service = new RequestRepository(token);

  // handle text input changes
  const handleInputChange = (
    field: keyof typeof requestForm,
    value: string
  ) => {
    setRequestForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  // handle file changes
  const handleFileChange = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const isLt5M = file.size / 1024 / 1024 < 5;
      const isValidType = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type);

      if (!isLt5M) message.error(`${file.name} is too large (max 5MB)`);
      if (!isValidType)
        message.error(`${file.name} has an unsupported file type`);

      return isLt5M && isValidType;
    });

    setAttachments(validFiles);
  };

  // remove a specific file
  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // retch requests with pagination
  const fetchRequests = async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    try {
      const response = await service.getAllRequests(
        `${
          isAdmin ? ENDPOINTS.GET_REQUEST : ENDPOINTS.GET_REQUESTER_REQUESTS
        }?page=${page - 1}&size=${pageSize}`
      );

      if ((response as AxiosData).status === 200) {
        const data: PaginationData = (response as AxiosData).data;
        setRequests(data.content);
        setPagination({
          current: data.number + 1,
          pageSize: data.size,
          total: data.totalElements,
        });
      }
    } catch (error) {
      setError("Failed to fetch requests");
      message.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // Submit the request
  const submitRequest = async (serviceId: number, departmentId: number) => {
    if (!requestForm.requestData.trim()) {
      setError("Request data is required");
      return false;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("requestData", requestForm.requestData);
      attachment.forEach((file) => formData.append("attachment", file));

      const response = await service.createRequest(
        ENDPOINTS.CREATE_REQUEST,
        serviceId,
        departmentId,
        requestForm.requestData,
        attachment,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      setUploadProgress(100);

      if (response.data) {
        message.success("Request submitted successfully!");
        setRequestForm({ requestData: "" });
        setAttachments([]);
        // refresh requests after submission
        await fetchRequests(pagination.current, pagination.pageSize);
        return true;
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      setError(
        (err as AxiosError).response?.data?.message ||
          "Failed to submit request. Please try again."
      );
      message.error("Failed to submit request");
      return false;
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // UPDATE status
  const updateStatus = async (status: string, requestId: number) => {
    try {
      await service
        .updateStatus(
          `${ENDPOINTS.UPDATE_REQUEST_STATUS}/${requestId}/status`,
          status
        )
        .then(() => {
          setRefreshRequest((prev: boolean) => !prev);
        });
    } catch (error) {
      return error;
    }
  };
  return {
    // Form state
    requestForm,
    attachment,
    handleInputChange,
    handleFileChange,
    removeFile,

    // Submission
    submitRequest,
    isSubmitting,
    uploadProgress,

    // Requests data
    requests,
    fetchRequests,
    loading,
    error,
    setError,

    // Pagination
    pagination,

    // status update
    updateStatus,
  };
};
