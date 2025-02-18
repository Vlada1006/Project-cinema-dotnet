export interface UserResponse {
  id: string;
  email: string;
  roles: string[];
}

export interface UserStore {
  id: string | null;
  email: string | null;
  roles: string[] | null;
}
