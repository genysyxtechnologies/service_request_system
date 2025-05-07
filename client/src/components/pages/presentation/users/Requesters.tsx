import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRequesters } from "../../../services/useRequesters";

const Requesters: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const { fetchAllRequesters, loading, error } = useRequesters(token);

  useEffect(() => {
    (async () => {
      await fetchAllRequesters();
    })();
  }, []);

  return <div>Requesters</div>;
};

export default Requesters;
