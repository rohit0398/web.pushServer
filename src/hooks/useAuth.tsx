export function useAuth() {
  const token =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('token')
      : undefined;

  return {
    token,
  };
}
