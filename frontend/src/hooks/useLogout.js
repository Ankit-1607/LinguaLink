import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logout } from "../lib/api.js";

export default function useLogout() {
  const queryClient = useQueryClient();
  const {mutate: logoutMutation, isPending, error} = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: () => {
      // fix: it should automatically take to login bcoz of app.jsx routing conditions
      queryClient.invalidateQueries({queryKey: ['authUser']});
      localStorage.removeItem('app-theme');
      toast.success('Logged out successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to logout');
    }
  });

  return {logoutMutation, isPending, error};
};