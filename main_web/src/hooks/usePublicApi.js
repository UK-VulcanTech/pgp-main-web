import { useQuery } from "@tanstack/react-query";
import { publicClient } from "../api/publicClient";

const get = (path) => publicClient.get(path).then((r) => r.data);

const oneHour = 60 * 60 * 1000;
const fiveMinutes = 5 * 60 * 1000;

const baseOptions = {
  staleTime: fiveMinutes,
  gcTime: oneHour,
  retry: 1,
  refetchOnWindowFocus: false,
};

export const useSiteSettings = () =>
  useQuery({ queryKey: ["site"], queryFn: () => get("/site/"), ...baseOptions });

export const useHomePage = () =>
  useQuery({ queryKey: ["home"], queryFn: () => get("/pages/home/"), ...baseOptions });

export const useAboutPage = () =>
  useQuery({ queryKey: ["about"], queryFn: () => get("/pages/about/"), ...baseOptions });

export const useApproachPage = () =>
  useQuery({ queryKey: ["approach"], queryFn: () => get("/pages/approach/"), ...baseOptions });

export const useContactPage = () =>
  useQuery({ queryKey: ["contact-page"], queryFn: () => get("/pages/contact/"), ...baseOptions });

export const useSolutionsPage = () =>
  useQuery({ queryKey: ["solutions-page"], queryFn: () => get("/pages/solutions/"), ...baseOptions });

export const useTrainingPage = () =>
  useQuery({ queryKey: ["training-page"], queryFn: () => get("/pages/training/"), ...baseOptions });

export const useDigitalFastTrackPage = () =>
  useQuery({
    queryKey: ["dft"],
    queryFn: () => get("/pages/digital-fast-track/"),
    ...baseOptions,
  });

export const useSolutionList = () =>
  useQuery({
    queryKey: ["solutions"],
    queryFn: () => get("/solutions/"),
    ...baseOptions,
  });

export const useSolutionDetail = (slug) =>
  useQuery({
    queryKey: ["solution", slug],
    queryFn: () => get(`/solutions/${slug}/`),
    enabled: !!slug,
    ...baseOptions,
  });

export const useTrainingList = () =>
  useQuery({
    queryKey: ["trainings"],
    queryFn: () => get("/training/"),
    ...baseOptions,
  });

export const useTrainingDetail = (slug) =>
  useQuery({
    queryKey: ["training", slug],
    queryFn: () => get(`/training/${slug}/`),
    enabled: !!slug,
    ...baseOptions,
  });
