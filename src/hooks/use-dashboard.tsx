
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const useDashboard = () => {
  const { toast } = useToast();
  
  const refresh = () => {
    // This would typically refresh data in the dashboard
    // For now we'll just provide a basic implementation
    window.location.reload();
  };

  return {
    toast,
    refresh
  };
};
