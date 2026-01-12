import api from "@/lib/api";
import { Property } from "@/types/property";

export const fetchMyProperties = async (): Promise<Property[]> => {
  const res = await api.get("/properties/my");
  return res.data;
};
