import { Layout } from "@/layouts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const segmentHeading = `text-xl font-semibold text-gray`;

export default function Dashboard() {
  const data = [
    {
      name: "07/07/23",
      subscriptions: 5,
      unsubscriptions: 2,
      inactivations: 1,
    },
    {
      name: "08/07/23",
      subscriptions: 5,
      unsubscriptions: 2,
      inactivations: 1,
    },
    {
      name: "09/07/23",
      subscriptions: 5,
      unsubscriptions: 2,
      inactivations: 1,
    },
    {
      name: "10/07/23",
      subscriptions: 5,
      unsubscriptions: 2,
      inactivations: 1,
    },
    {
      name: "11/07/23",
      subscriptions: 5,
      unsubscriptions: 2,
      inactivations: 1,
    },
    {
      name: "12/07/23",
      subscriptions: 5,
      unsubscriptions: 2,
      inactivations: 1,
    },
    {
      name: "13/07/23",
      subscriptions: 5,
      unsubscriptions: 2,
      inactivations: 1,
    },
  ];

  const data2 = [
    {
      name: "07/07/23",
      LPClicks: 5,
      Leads: 2,
      Clicked: 1,
      Closed: 1,
      Shown: 1,
      Sent: 1,
    },
    {
      name: "08/07/23",
      LPClicks: 5,
      Leads: 2,
      Clicked: 1,
      Closed: 1,
      Shown: 1,
      Sent: 1,
    },
    {
      name: "09/07/23",
      LPClicks: 5,
      Leads: 2,
      Clicked: 1,
      Closed: 1,
      Shown: 1,
      Sent: 1,
    },
    {
      name: "10/07/23",
      LPClicks: 5,
      Leads: 2,
      Clicked: 1,
      Closed: 1,
      Shown: 1,
      Sent: 1,
    },
  ];

  return (
    <Layout>
      <div className=" w-full mb-5 p-3 sm:p-10 pb-10 bg-stroke-light-gray h-full overflow-y-auto">
        <div className=" bg-white rounded-2xl p-3 sm:p-10 relative">
          <h2 className="text-3xl font-semibold text-gray mb-16">Dashboard</h2>

          <h5 className={segmentHeading}>Push subscriptions</h5>
          <hr className="border-t mt-1" />

          <div className=" mt-5 mb-8">
            <div className=" grid grid-cols-3 gap-5 mb-4">
              <div>
                <div className=" text-light-gray font-semibold">
                  Active subscriptions
                </div>
                <div className=" font-semibold text-base">0</div>
              </div>

              <div>
                <div className=" text-light-gray font-semibold">
                  Last 14 days (Unsub.%)
                </div>
                <div className=" font-semibold text-base">0</div>
              </div>

              <div>
                <div className=" text-light-gray font-semibold">
                  On the last active day (Unsub., %)
                </div>
                <div className=" font-semibold text-base">0</div>
              </div>
            </div>
            <div className=" h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={data}
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
                  <Bar dataKey="inactivations" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className=" mt-16">
            <h5 className={segmentHeading}>Campaigns</h5>
            <hr className="border-t mt-1" />
          </div>

          <div className=" mt-5 mb-8">
            <div className=" grid grid-cols-3 gap-5 mb-4">
              <div>
                <div className=" text-light-gray font-semibold">
                  Sent in the last 14 days
                </div>
                <div className=" font-semibold text-base">0</div>
              </div>

              <div>
                <div className=" text-light-gray font-semibold">
                  Shown in the last 14 days
                </div>
                <div className=" font-semibold text-base">0</div>
              </div>

              <div>
                <div className=" text-light-gray font-semibold">
                  Clicked in the last 14 days
                </div>
                <div className=" font-semibold text-base">0</div>
              </div>

              <div>
                <div className=" text-light-gray font-semibold">
                  Closed in the last 14 days
                </div>
                <div className=" font-semibold text-base">0</div>
              </div>

              <div>
                <div className=" text-light-gray font-semibold">
                  LPClicks in the last 14 days
                </div>
                <div className=" font-semibold text-base">0</div>
              </div>

              <div>
                <div className=" text-light-gray font-semibold">
                  Leads in the last 14 days
                </div>
                <div className=" font-semibold text-base">0</div>
              </div>
            </div>
            <div className=" h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={data2}
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
                  <Bar dataKey="LPClicks" fill="#8884d8" />
                  <Bar dataKey="Leads" fill="#82ca9d" />
                  <Bar dataKey="Clicked" fill="#ffc658" />

                  <Bar dataKey="Closed" fill="#fa2070" />
                  <Bar dataKey="Shown" fill="#fa0aea" />
                  <Bar dataKey="Sent" fill="#00d0f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
