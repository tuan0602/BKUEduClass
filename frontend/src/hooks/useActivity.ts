// src/hooks/useActivity.ts
import { useQuery } from "@tanstack/react-query";
import { getRecentActivities, ActivityItem } from "../lib/activityService";
import { toast } from "sonner";

// ===========================
// QUERY KEYS
// ===========================
export const activityKeys = {
  all: ["activities"] as const,
  recent: () => [...activityKeys.all, "recent"] as const,
};

// ===========================
// HOOK
// ===========================
/**
 * Hook lấy recent activities (Admin Dashboard)
 */
export const useRecentActivities = (enabled: boolean = true) => {
  return useQuery<ActivityItem[], Error>({
    queryKey: activityKeys.recent(),
    queryFn: async () => {
      try {
        const data = await getRecentActivities();
        return data;
      } catch (error: any) {
        toast.error(error.message || "Không thể tải hoạt động gần đây");
        throw error;
      }
    },
    enabled,
    staleTime: 1000 * 60 * 3, // cache 3 phút
  });
};
