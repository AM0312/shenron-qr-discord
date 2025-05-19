import dotenv from "dotenv";
dotenv.config();

export const OWNER_ID = process.env.OWNER_ID;
export const PRIVILEGED_ROLE_IDS = process.env.ADMIN_ROLE_IDS
  ? process.env.ADMIN_ROLE_IDS.split(",")
  : [];
