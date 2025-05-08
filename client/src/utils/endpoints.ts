export const ENDPOINTS = {
  CREATE_CATEGORY: "/api/v1/categories",
  CREATE_SERVICE: "/api/v1/services",
  CREATE_REQUEST: "/api/v1/requester/request",
  GET_CATEGORIES: "/api/v1/categories",
  GET_SERVICES: `/api/v1/services`,
  GET_REQUESTS: "/api/v1/requests",
  GET_CATEGORY: "/api/v1/categories/:id",
  GET_SERVICE: "/api/v1/services",
  GET_REQUEST: "/api/v1/requests",
  UPDATE_CATEGORY: "/api/v1/categories",
  UPDATE_SERVICE: "/api/v1/services",
  UPDATE_REQUEST: "/api/v1/requests/:id",
  DELETE_CATEGORY: "/api/v1/categories/:id",
  DELETE_SERVICE: "/api/v1/services",
  DELETE_REQUEST: "/api/v1/requests/:id",
  SUPER_ADMIN_DASHBOARD: "/api/v1/dashboard/super-admin",

  GET_REQUESTER_REQUESTS: "/api/v1/requester/requests",
  GET_REQUESTER_CATEGORIES: "/api/v1/requester/categories",
  UPDATE_REQUEST_STATUS: "/api/v1/requests",

  // USERS
  GET_USERS: "/api/v1/users/requesters",
  PASSWORD_UPDATE: "/api/auth/change-password",

  // DEPARTMENT
  SYNC_DEPARTMENTS: "/api/v1/departments/synchronize",
  GET_DEPARTMENTS: "/api/v1/departments",

  // NOTIFICATIONS
  GET_NOTIFICATIONS: "/api/v1/notifications/user/me",
  MARK_NOTIFICATION_READ: "/api/v1/notifications",
  GET_UNREAD_NOTIFICATIONS: "/api/v1/notifications/user",

  // REQUESTERS
  GET_REQUESTERS: "/api/v1/users/requesters",

  // MANAGERS
  GET_MANAGERS: "/api/v1/users/managers",
};
