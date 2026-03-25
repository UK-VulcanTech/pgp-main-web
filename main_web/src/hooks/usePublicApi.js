import { useMutation, useQuery } from "@tanstack/react-query";
import { publicApi } from "../api/publicClient";

const q = {
  staleTime: 60 * 1000,
  retry: 1,
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["public", "site"],
    queryFn: async () => (await publicApi.get("/site/")).data,
    ...q,
  });
}

export function useNavigation() {
  return useQuery({
    queryKey: ["public", "navigation"],
    queryFn: async () => (await publicApi.get("/navigation/")).data,
    ...q,
  });
}

export function useFooterLinks() {
  return useQuery({
    queryKey: ["public", "footer-links"],
    queryFn: async () => (await publicApi.get("/footer-links/")).data,
    ...q,
  });
}

export function useHomePage() {
  return useQuery({
    queryKey: ["public", "pages", "home"],
    queryFn: async () => (await publicApi.get("/pages/home/")).data,
    ...q,
  });
}

export function useAboutPage() {
  return useQuery({
    queryKey: ["public", "pages", "about"],
    queryFn: async () => (await publicApi.get("/pages/about/")).data,
    ...q,
  });
}

export function useContactPage() {
  return useQuery({
    queryKey: ["public", "pages", "contact"],
    queryFn: async () => (await publicApi.get("/pages/contact/")).data,
    ...q,
  });
}

export function useImpactPage() {
  return useQuery({
    queryKey: ["public", "pages", "impact"],
    queryFn: async () => (await publicApi.get("/pages/impact/")).data,
    ...q,
  });
}

export function useTechnologyPage() {
  return useQuery({
    queryKey: ["public", "pages", "technology"],
    queryFn: async () => (await publicApi.get("/pages/technology/")).data,
    ...q,
  });
}

export function useSolutionDetail(slug) {
  return useQuery({
    queryKey: ["public", "solutions", slug],
    queryFn: async () => (await publicApi.get(`/solutions/${slug}/`)).data,
    enabled: Boolean(slug),
    ...q,
  });
}

export function useTrainingHub() {
  return useQuery({
    queryKey: ["public", "training", "hub"],
    queryFn: async () => (await publicApi.get("/training/")).data,
    ...q,
  });
}

export function useTrainingDetail(slug) {
  return useQuery({
    queryKey: ["public", "training", slug],
    queryFn: async () => (await publicApi.get(`/training/${slug}/`)).data,
    enabled: Boolean(slug),
    ...q,
  });
}

export function useContactSubmit() {
  return useMutation({
    mutationFn: async (payload) => (await publicApi.post("/contact/", payload)).data,
  });
}
