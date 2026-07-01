"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { ApiError } from "@/services/apiClient";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["me"],
    queryFn: userService.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isAuthenticated = !!user && !(error instanceof ApiError && error.status === 401);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (userData) => {
      queryClient.setQueryData(["me"], userData);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.register(email, password),
    onSuccess: (userData) => {
      queryClient.setQueryData(["me"], userData);
      router.push("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/");
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    loginPending: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    registerError: registerMutation.error,
    registerPending: registerMutation.isPending,
    logout: logoutMutation.mutate,
    logoutPending: logoutMutation.isPending,
  };
}
