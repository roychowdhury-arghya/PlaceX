import request from "./client";
import type {
  ApplicationResponse,
  InterviewRoundResponse,
} from "./types";

export const applicationApi = {
  getAll: () =>
    request<ApplicationResponse[]>("/applications/all").catch((err) => {
      console.warn("[applicationApi.getAll] GET /applications/all failed (backend dependency). Returning empty array fallback.", err);
      return [] as ApplicationResponse[];
    }),

  getById: (id: number) =>
    request<ApplicationResponse>(`/applications/${id}`),

  getByStudent: (studentId: string) =>
    request<ApplicationResponse[]>(
      `/applications/my?studentId=${encodeURIComponent(studentId)}`
    ),

  create: (data: { studentId: string; jobPostingId: number }) =>
    request<ApplicationResponse>("/applications/add", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStatus: (id: number, status: string) => {
    const s = status.trim().toUpperCase();
    const validStatus =
      s === "SHORTLISTED" || s === "REJECTED" || s === "SELECTED"
        ? s
        : "APPLIED";
    return request<ApplicationResponse>(
      `/applications/${id}/status?newStatus=${encodeURIComponent(validStatus)}`,
      { method: "PATCH" }
    );
  },

  
  delete: (id: number) =>
    request<string>(`/applications/${id}`, { method: "DELETE" }),

  getRounds: (applicationId: number) =>
    request<InterviewRoundResponse[]>(
      `/applications/${applicationId}/rounds`
    ),

  
  addRound: (
    applicationId: number,
    data: {
      roundNumber: number;
      roundType: string;
      scheduledAt: string;
    }
  ) =>
    request<InterviewRoundResponse>(
      `/applications/${applicationId}/rounds`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  updateRound: (
    roundIdOrAppId: number,
    roundIdOrData: any,
    dataArg?: any
  ) => {
    const roundId = dataArg !== undefined ? (roundIdOrData as number) : roundIdOrAppId;
    const data = dataArg !== undefined ? dataArg : roundIdOrData;
    return request<InterviewRoundResponse>(`/applications/rounds/${roundId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};