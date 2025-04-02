import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser } from "../../../services/useUser";

const Users: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const { allUsers, fetchAllUsers, loading, error } = useUser(token);

  useEffect(() => {
    (async () => {
      await fetchAllUsers();
    })();
  }, []);

  return <div>Users</div>;
};

export default Users;
