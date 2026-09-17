import axiosClient from "../utils/axiosClient";

export interface SignupData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    accessToken: string;
}

export const signup = async (
    data: SignupData
): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>(
        "/auth/signup",
        data
    );

    return response.data;
};

export const login = async (
    data: LoginData
): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>(
        "/auth/login",
        data
    );

    return response.data;
};