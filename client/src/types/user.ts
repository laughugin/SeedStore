export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  theme: string;
  user_uid: string;
  created_at: string;
  updated_at: string | null;
} 