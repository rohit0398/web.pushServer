import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button, InputField } from '@/atoms';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/layouts';
import api from '@/utils/api';
import { wentWrong } from '@/utils/helper';

export default function Login() {
  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: {},
  });

  const { push } = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (token) push('/dashboard');
  }, [token]);

  const onSubmit = (data: any) => {
    const { email, password } = data;
    if (email && password)
      api
        .post('user/sign-in', { email, password })
        .then((res) => {
          localStorage.setItem('token', res?.data?.token);
          push('/dashboard');
        })
        .catch((err) => {
          toast.error(err?.message ?? wentWrong);
        });
    else toast.error('Please use correct credentials!');
  };

  return (
    <Layout showFooter={false}>
      <div
        className=" container mb-5 flex flex-col items-center justify-center px-5"
        style={{ height: 'calc(100vh - 120px)' }}
      >
        <h1 className=" text-center text-[2.5rem] font-normal text-gray">
          Welcome back.
        </h1>

        <form className="mt-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className=" mt-12 w-full max-w-sm lg:w-96">
            <InputField
              name="email"
              label="Email"
              type="email"
              register={register}
              formState={formState}
              rules={{
                required: 'This is a required field.',
              }}
            />
          </div>
          <div className=" mt-12 w-full max-w-sm lg:w-96">
            <InputField
              name="password"
              label="Password"
              type="password"
              register={register}
              formState={formState}
              rules={{
                required: 'This is a required field.',
              }}
            />
          </div>

          <div className=" mt-12 flex w-full max-w-sm items-center justify-between lg:w-96">
            <Button title="Login" size=" h-8" type={'submit'} />
          </div>
        </form>
      </div>
    </Layout>
  );
}
