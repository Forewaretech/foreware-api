export const extractLeadData = (data: any) => {
  let email: string | null = null;
  let name: string | null = null;

  for (const key in data) {
    const value = data[key];

    if (!email && typeof value === "string" && value.includes("@")) {
      email = value;
    }

    if (
      !name &&
      typeof value === "string" &&
      key.toLowerCase().includes("name")
    ) {
      name = value;
    }
  }

  return { email, name };
};
