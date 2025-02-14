export interface UserResponse {
  email: string;
  roles: string[];
}

export interface UserStore {
  email: string | null;
  roles: string[] | null;
}
