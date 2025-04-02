import { createContext } from "react";

const RequestContext = createContext({
    refreshRequest: false,
    setRefreshRequest: () => {}
} as any);

export default RequestContext;
