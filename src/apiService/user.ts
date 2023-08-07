import api from '@/utils/api';

export function notifyMeApi(email: string) {
  const url = 'util/notify-me';
  return api.post(url, { email });
}

export function loginApi(payload: { email: string; password: string }) {
  return api.post('/user/sign-in', payload);
}

export function signUpApi(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return api.post('/user/sign-up', payload);
}

export function redirectToDashboardApi() {
  return api.get('/user/redirect-to-dashboard');
}
