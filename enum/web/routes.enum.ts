const prefix = '/web/';

export const buildWebDinamicRoute = (
  basePath: WEB_ROUTES,
  params: string | number
): string => {
  return basePath + '/' + params;
};

export enum WEB_ROUTES {
  HOME = prefix,
  LOGIN = prefix + 'login',
  SIGNUP = prefix + 'signup',
  NEW_PASSWORD = prefix + 'new-password',
  PASSWORD_RECOVERY = prefix + 'password-recovery',
  TOKEN_VALIDATION = prefix + 'token-validation',
  POLICY = prefix + 'policy',
  PROFILES = prefix + 'profiles',
  MY_POSTS = prefix + 'posts/my-posts',
  ALL_POSTS = prefix + 'posts/all-posts',
  MY_MARKETPLACE = prefix + 'marketplace/my-marketplace',
  ALL_MARKETPLACE = prefix + 'marketplace/all-marketplace',
  EVENTS = prefix + 'events',
  RECOMMENDATIONS = prefix + 'recommendations',
  REPORTS = prefix + 'reports',
}
