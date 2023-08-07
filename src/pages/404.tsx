import { useRouter } from 'next/router';

import { Button } from '@/atoms';
import { Layout } from '@/layouts';

export default function Custom404() {
  const { back } = useRouter();
  return (
    <Layout showFooter={false}>
      <div
        className=" container mb-5 flex flex-col items-center justify-center px-5"
        style={{ height: 'calc(100vh - 120px)' }}
      >
        <div>
          <img src="/assets/images/AlienEmoji.svg" alt="svg-alein-icon" />
        </div>
        <h1 className=" text-center text-[2.5rem] font-normal leading-normal text-[#05063E]">
          Oops! seems like you got lost in the galaxy.
        </h1>
        <h2 className=" mt-6 text-center text-2xl font-normal text-gray">
          We couldn’t find what you are looking for, but we have found some
          results that may interest you
        </h2>

        <div className="mt-12 flex items-center">
          <Button onClick={() => back()} title="Go Back" size=" h-8" />
        </div>
      </div>
    </Layout>
  );
}
