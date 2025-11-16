import api from "../api/axiosInstance";
import { useState } from "react";

export function useActivityDelete() {
   const [deleting, setDeleting] = useState(false);
   const [message, setMessage] = useState(null);

   const deleteActivity = async (activity_id) => {
    setDeleting(true);
    setMessage(null);
    try {
      const response = await api.delete(`/activities/${activity_id}`);
      setMessage({
        type: "success",
        text: "Activity deleted successfully",
      });
      // return server response (if any) so caller can react
      return response?.data ?? true;
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to delete activity",
      });
      throw err;
    } finally {
      setDeleting(false);
    }
   }
   return { deleteActivity, message, deleting };
 }
