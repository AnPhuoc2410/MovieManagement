export const RoleName = {
  MEMBER: "MEMBER",
  STAFF: "STAFF",
  MANAGER: "MANAGER",
} as const;

export enum UserRole {
  MEMBER = "MEMBER",
  STAFF = "STAFF",
  MANAGER = "MANAGER",
}

// Define the Role type as an interface
export interface RoleModel {
  id: number;
  userRole: UserRole;
}

export enum Role {
  Member = 0,
  Employee = 1,
  Admin = 2,
}
