import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { Loader } from '@/atoms';

import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/'); // Redirect to login if not authenticated
    }
  }, [token, router]);

  return token ? <>{children}</> : <Loader />;
};

export default ProtectedRoute;
