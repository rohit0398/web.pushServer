/* eslint-disable no-console */
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Layout } from '@/layouts';
import api from '@/utils/api';

const segmentHeading = `text-xl font-semibold text-gray`;

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<any>({});
  const [campaigns, setCampaigns] = useState<any>({});

  useEffect(() => {
    api
      .get('/analytics/subscribe')
      .then((res) => {
        setSubscriptions(res?.data ?? {});
      })
      .catch((err) => {
        console.log('err', err);
      });

    api
      .get('/analytics/campaign')
      .then((res) => {
        setCampaigns(res?.data ?? {});
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  return (
    <Layout>
      <div className=" mb-5 h-full w-full overflow-y-auto bg-stroke-light-gray p-3 pb-10 sm:p-10">
        <div className=" relative rounded-2xl bg-white p-3 sm:p-10">
          <h2 className="mb-16 text-3xl font-semibold text-gray">Dashboard</h2>

          <h5 className={segmentHeading}>Push subscriptions</h5>
          <hr className="mt-1 border-t" />

          <div className=" mb-8 mt-5">
            <div className=" mb-4 grid grid-cols-3 gap-5">
              <div>
                <div className=" font-semibold text-light-gray">
                  Active subscriptions
                </div>
                <div className=" text-base font-semibold">
                  {get(subscriptions?.active, '0.count')}
                </div>
              </div>

              <div>
                <div className=" font-semibold text-light-gray">
                  Last 14 days Subscriptions
                </div>
                <div className=" text-base font-semibold">
                  {' '}
                  {get(subscriptions?.last14days, 'subscriptions', 0)}
                </div>
              </div>

              <div>
                <div className=" font-semibold text-light-gray">
                  Last 14 days Unscriptions
                </div>
                <div className=" text-base font-semibold">
                  {get(subscriptions?.last14days, 'unsubscriptions', 0)}
                </div>
              </div>
            </div>
            <div className=" mt-10 h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={subscriptions?.dates ?? []}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="subscriptions" fill="#8884d8" />
                  <Bar dataKey="unsubscriptions" fill="#82ca9d" />
                  {/* <Bar dataKey="inactivations" fill="#ffc658" /> */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className=" mt-16">
            <h5 className={segmentHeading}>Campaigns</h5>
            <hr className="mt-1 border-t" />
          </div>

          <div className=" mb-8 mt-5">
            <div className=" mb-4 grid grid-cols-3 gap-5">
              <div>
                <div className=" font-semibold text-light-gray">
                  Sent in the last 14 days
                </div>
                <div className=" text-base font-semibold">
                  {campaigns?.last14days?.sent ?? 0}
                </div>
              </div>

              <div>
                <div className=" font-semibold text-light-gray">
                  Shown in the last 14 days
                </div>
                <div className=" text-base font-semibold">
                  {campaigns?.last14days?.shown ?? 0}
                </div>
              </div>

              <div>
                <div className=" font-semibold text-light-gray">
                  Clicked in the last 14 days
                </div>
                <div className=" text-base font-semibold">
                  {campaigns?.last14days?.clicked ?? 0}
                </div>
              </div>

              <div>
                <div className=" font-semibold text-light-gray">
                  Closed in the last 14 days
                </div>
                <div className=" text-base font-semibold">
                  {campaigns?.last14days?.closed ?? 0}
                </div>
              </div>
            </div>
            <div className=" mt-10 h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={campaigns?.intervals ?? []}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {/* <Bar dataKey="LPClicks" fill="#8884d8" /> */}
                  {/* <Bar dataKey="Leads" fill="#82ca9d" /> */}
                  <Bar dataKey="clicked" fill="#ffc658" />

                  <Bar dataKey="closed" fill="#fa2070" />
                  <Bar dataKey="shown" fill="#fa0aea" />
                  <Bar dataKey="sent" fill="#00d0f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
