import { User } from '~/entities/user';
import { LoadingState } from '~/shared';

export interface ServerApplication {
  applicationId: string;
  user: User;
  createdAt: string;
}

export interface UserApplication {
  applicationId: string;
  serverId: string;
  serverName: string;
  createdAt: string;
}

export interface GetServerApplications {
  applications: ServerApplication[];
  page: number;
  size: number;
  total: number;
}

export interface GetUserApplications {
  applications: UserApplication[];
  page: number;
  size: number;
  total: number;
}

export interface ServerApplicationState {
  serverApplications: ServerApplication[];
  userApplications: UserApplication[];
  serverApplicationsLoadingState: LoadingState;
  userApplicationsLoadingState: LoadingState;
  serverPage: number;
  serverTotal: number;
  userPage: number;
  userTotal: number;
  error: string;
}
