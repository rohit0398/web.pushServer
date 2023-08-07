export function useAuth() {
  let user =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('user')
      : undefined;
  const token =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('token')
      : undefined;
  if (user) user = JSON.parse(user);

  return {
    user,
    token,
  };
}
