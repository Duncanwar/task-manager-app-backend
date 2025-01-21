const roles: Record<string, { can: string[] }> = {
  admin: { can: ["create", "edit", "delete", "view"] },
  member: { can: ["view"] },
};

export default roles;
