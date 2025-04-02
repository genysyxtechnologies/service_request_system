import { useState } from "react";
import RequestContext from "./RequestContext";

const RequestContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refreshRequest, setRefreshRequest] = useState<boolean>(false);

  return (
    <RequestContext.Provider value={{ refreshRequest, setRefreshRequest }}>
      {children}
    </RequestContext.Provider>
  );
};

export default RequestContextProvider;
