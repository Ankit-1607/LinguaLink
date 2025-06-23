import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import toast from "react-hot-toast";

export default function useSignup() {
  const queryClient = useQueryClient();
  const { mutate: signUpMutation, isPending, error} = useMutation({
    mutationKey: ['signup'],
    mutationFn: signup,
    onSuccess: () => {
      toast.success('Account created successfully!');
      queryClient.invalidateQueries({queryKey: ['authUser']}); // refetch query key - authUser
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Signup failed. Please try again."
      );
    }
  });
  return { signUpMutation, isPending, error };
};