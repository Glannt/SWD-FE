import { apiGet } from "../utils/api";

export const fetchSummary = (): Promise<Record<string, unknown>> => {
  return apiGet("/admin/dashboard/summary", { withCredentials: true });
};

export const fetchSessions = (): Promise<Record<string, unknown>[]> => {
  return apiGet("/admin/dashboard/sessions", { withCredentials: true });
};

export const fetchChatUsers = (): Promise<Record<string, unknown>[]> => {
  return apiGet("/admin/dashboard/users", { withCredentials: true });
};
