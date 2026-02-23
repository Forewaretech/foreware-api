// Remove undefined keys so Prisma doesn't complain
export const removeUndefinedFields = (data: any) =>
  Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined),
  );
