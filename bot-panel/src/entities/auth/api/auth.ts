import type {
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  ProfileResponse,
} from '~/entities/auth/model/types';

import { LOGIN_USER, REGISTER_USER, GET_PROFILE } from './const';

import { api } from '~/shared';

export const registerUser = async (
  registerData: RegisterData,
): Promise<RegisterResponse> => {
  const { data } = await api.post(REGISTER_USER, registerData);

  return data;
};

export const loginUser = async (
  loginData: LoginData,
): Promise<LoginResponse> => {
  const { data } = await api.post(LOGIN_USER, loginData);

  return data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const { data } = await api.get(GET_PROFILE);

  return data;
};
