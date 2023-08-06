import { useRouteDirectionFetchMutation } from "../services/RouteApi";

export const useRouteDirection = () => {
  const [routeDirectionFetch, { data, error, isLoading }] = useRouteDirectionFetchMutation();

  const direction = data || [];

  return {
    getDirection: routeDirectionFetch,
    data: direction,
    error, isLoading,
  };
};
