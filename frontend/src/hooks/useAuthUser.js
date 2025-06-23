import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api.js";

const useAuthUser = () => {
  // using tanstack to avoid the need for multiple useState+useEffect hooks - this also handles caching and refetching - it refetches 3 times by default
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // Disable retrying on failure
  });

  return {
    authUser: authUser.data?.user, // Extract the user from the data
    isLoading: authUser.isLoading,
    error: authUser.error,
  };
}

export default useAuthUser
