import { useState } from "react";
import api from "../api/axiosInstance";

export function useUpdateActivity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateActivity = async (activity_id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch(`/activities/${activity_id}/`, payload);
      return res.data; // return updated activity
    } catch (err) {
       const apiError = err?.response?.data;
        if (Array.isArray(apiError)) {
        // simplify to an array of messages
        setError(apiError.map((e) => e.msg || JSON.stringify(e)));
        } else if (typeof apiError === "object" && apiError !== null) {
        setError(apiError.detail || apiError.message || apiError);
        } else {
        setError(apiError || "Failed to update activity");
        }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateActivity, loading, error };
}
