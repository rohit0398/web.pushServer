import { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/atoms';
import { Layout } from '@/layouts';
import ProtectedRoute from '@/molecules/protected';
import api from '@/utils/api';
import { wentWrong } from '@/utils/helper';

export default function Notification() {
  const [loading, setLoading] = useState(false);

  function handleSend() {
    setLoading(true);
    api
      .get(`/subscription/send?limit=10`)
      .then(() => toast.success('Notification send successfully'))
      .catch(() => toast.error(wentWrong))
      .finally(() => setLoading(false));
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className=" mb-5 h-full w-full overflow-y-auto bg-stroke-light-gray p-3 pb-10 sm:p-10">
          <div className=" relative rounded-2xl bg-white p-3 sm:p-10">
            <div className=" flex justify-between gap-8">
              <Button
                id={'pushNotificationButton'}
                title="ask permission"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                title="Send notification to last 10 subscription"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
