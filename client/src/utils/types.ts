export interface SignUp {
    firstName: string,
    lastName: string,
    username: string;
    email: string;
    password: string;
}

export interface SignIn {
    identifier: string;
    password: string;
}

export interface NewService {
    name: string;
    description: string;
    fields: string,
    categoryId: number,
    isActive: boolean,
}

export interface NewCategory {
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

// services with pagination
export interface Service {
    data: Record<string, unknown | any>;
    total: number;
    page: number;
    size: number;

}

export interface AxiosData {
    data: Record<string, unknown | any>;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: Record<string, unknown>;
    request: Record<string, unknown>;
}

export interface AxiosError {
    status: number;
    statusText: string;
    data: Record<string, unknown>;
    config: Record<string, unknown>;
    request: Record<string, unknown>;
    response: Record<string, unknown | any>;
    message: string;
}

export interface ServiceData {
    id: number;
    name: string;
    description: string;
    fields: string;
    isActive: boolean;
    categoryName: string,
    categoryId: number,
}

export interface Service {
    name: string,
    description: string,
    category: string,
}

export const ROLES = {
    DEFAULT_ROLE: 'REQUESTER',
}
