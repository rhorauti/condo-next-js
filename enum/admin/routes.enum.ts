const prefix = '/admin/';

export const buildAdminDinamicRoute = (
  basePath: ADMIN_ROUTES,
  params: string | number
): string => {
  return basePath + '/' + params;
};

export enum ADMIN_ROUTES {
  HOME = prefix,
  CONDO = prefix + 'condo',
  USERS = prefix + 'users',
  REPORTS = prefix + 'reports',
  EVENTS = prefix + 'events',
  FAQ = prefix + 'faq',
  POLICY = prefix + 'policy',
}
