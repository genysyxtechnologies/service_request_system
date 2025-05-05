import { useState } from "react";
import RequestContext from "./RequestContext";

const RequestContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refreshRequest, setRefreshRequest] = useState<boolean>(false);
  const [departmentId, setDepartmentId] = useState<number | null>(null);

  return (
    <RequestContext.Provider
      value={{
        refreshRequest,
        setRefreshRequest,
        departmentId,
        setDepartmentId,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export default RequestContextProvider;
