export const ROLES = {
    DEFAULT_ROLE: "REQUESTER",
    SUPER_ADMIN: "SUPER_ADMIN",
    MANAGER: "MANAGER",
    SUPERVISOR: "SUPERVISOR",
    HOD: "HOD"
  };
  

export const isUserAuthorized = (userRoles: string[], requiredRole: string) => {
    return userRoles.includes(requiredRole);
}  