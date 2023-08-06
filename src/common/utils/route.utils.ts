import { RouteObject } from 'react-router-dom';

export const dynamicRoute = (path: string, params: any): string => {
  return path.replace(/:([^/]+)/g, (_, key) => params[key]);
};

export const localizeRoutes = (routes: RouteObject[], locale: string = '/') => {
  const localizedRoutes: any = routes.map((route) => {
    const newRoute = { ...route };
    if (route.path) {
      newRoute.path = `/${locale}${route.path}`;
    }
    if (route.children) {
      newRoute.children = localizeRoutes(route.children, locale);
    }
    return newRoute;
  });

  return localizedRoutes;
};
