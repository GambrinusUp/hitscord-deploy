import { Role } from '~/store/RolesStore';

export interface RoleItemProps {
  role: Role;
  editSettings: (role: Role) => void;
  editRole: (role: Role) => void;
}
