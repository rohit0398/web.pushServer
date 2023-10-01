/* eslint-disable no-underscore-dangle */

import {
  PauseIcon,
  PencilIcon,
  PlayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Button, Loader } from '@/atoms';
import ConfirmationModal from '@/atoms/confirmationModal';
import { CustomTable } from '@/atoms/table/table';
import { Layout } from '@/layouts';
import { CreateCampaign } from '@/molecules/createCampaign';
import ProtectedRoute from '@/molecules/protected';
import api from '@/utils/api';
import { wentWrong } from '@/utils/helper';

export default function Campaign() {
  const [create, setCreate] = useState(false);
  const [data, setData] = useState([]);
  const [singleRowData, setSingleRowData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [deleteConfrim, setDeleteConfrim] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState(false);
  const [updateObj, setUpdateObj] = useState<{ ind: number; _id: string }>({
    ind: 0,
    _id: '',
  });

  useEffect(() => {
    setLoading(true);
    api
      .get('/campaign')
      .then((res) => setData(res?.data ?? []))
      .catch(() => toast.error(wentWrong))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete({ ind, _id }: { ind: number; _id: string }) {
    setUpdateObj({ ind, _id });
    setDeleteConfrim(true);
  }

  function handleStatusUpdate({ ind, _id }: { ind: number; _id: string }) {
    setUpdateObj({ ind, _id });
    setStatusConfirm(true);
  }

  function handelConfirm() {
    const raw = [...data];
    raw.splice(updateObj?.ind, 1);
    setLoading(true);
    api
      .delete(`/campaign/${updateObj?._id}`)
      .then(() => {
        setData(raw);
        toast.success('Campaign deleted successfully');
      })
      .catch(() => toast.error(wentWrong))
      .finally(() => {
        setLoading(false);
        setDeleteConfrim(false);
      });
  }

  function handelStatusConfirm() {
    const raw: any = [...data];
    const status =
      raw[updateObj.ind]?.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    raw[updateObj.ind] = { ...raw[updateObj.ind], status };
    setLoading(true);
    api
      .patch(`/campaign/${updateObj?._id}`, { status })
      .then(() => {
        setData(raw);
        toast.success('Campaign status updated successfully');
      })
      .catch(() => toast.error(wentWrong))
      .finally(() => {
        setLoading(false);
        setStatusConfirm(false);
      });
  }

  function handelEdit(singleRow: any) {
    setCreate(true);
    setSingleRowData(singleRow);
  }

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: '_id',
        header: 'ID',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'title',
        header: 'Title',
        filterFn: 'includesString',
      },

      {
        accessorKey: 'countries',
        header: 'Countries',
        accessorFn: (row) => {
          return row?.countries?.join(',');
        },
        cell: ({ row }) => {
          const val = row?.getValue('countries') as string;
          const arr = val ? val?.split(',') : ['All'];
          return (
            <div className=" flex gap-x-1">
              {arr.map((ele, ind) => (
                <span key={ind} className=" rounded bg-light-blue p-1">
                  {ele}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'feeds',
        header: 'Feeds',
        accessorFn: (row) => {
          return row?.feeds?.join(',');
        },
        cell: (info) => {
          const val = info?.getValue() as string;
          const arr = val ? val?.split(',') : ['All'];
          return (
            <div className=" flex gap-x-1">
              {arr.map((ele, ind) => (
                <span key={ind} className=" rounded bg-light-blue p-1">
                  {ele}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        filterFn: 'includesString',
        cell: ({ row }) => {
          const val = row.getValue('status') as string;
          return (
            <div>
              {val === 'Active' ? (
                <span className=" rounded border-dark-purple bg-dark-purple/30 p-1 text-dark-purple">
                  {val}
                </span>
              ) : (
                <span className=" rounded border-light-yellow bg-light-yellow/30 p-1 text-light-yellow">
                  {val}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: 'actions',
        enableColumnFilter: false,
        cell: ({ row }) => {
          const { index, original } = row ?? {};
          return (
            <div className="flex gap-6">
              <div
                onClick={() =>
                  handleStatusUpdate({ ind: index, _id: original?._id })
                }
                className=" flex cursor-pointer gap-x-1 p-4 px-2 pl-0"
              >
                {original?.status === 'ACTIVE' ? (
                  <PauseIcon className=" h-5 w-5 text-dark-purple" />
                ) : (
                  <PlayIcon className=" h-5 w-5 text-dark-purple" />
                )}
              </div>

              <div
                onClick={() => handelEdit(original)}
                className=" flex cursor-pointer gap-x-1 p-4 px-2"
              >
                <PencilIcon className=" h-4 w-4 text-dark-purple" />
              </div>

              <div
                onClick={() => handleDelete({ ind: index, _id: original?._id })}
                className=" flex cursor-pointer gap-x-1 p-4 px-2 pl-0"
              >
                <TrashIcon className=" h-4 w-4 text-dark-purple" />
              </div>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <ProtectedRoute>
      <Layout>
        <div className=" mb-5 h-full w-full overflow-y-auto bg-stroke-light-gray p-3 pb-10 sm:p-10">
          <div className=" relative rounded-2xl bg-white p-3 sm:p-10">
            {loading && <Loader />}
            <div className=" mb-8 flex justify-between">
              <h2 className="text-3xl font-semibold text-gray">Campaign</h2>

              <Button title="create" onClick={() => setCreate(true)} />
            </div>
            <div>
              <CustomTable columns={columns} data={data} />
            </div>
            {create && (
              <CreateCampaign
                singleRowData={singleRowData}
                setCreate={(bool) => {
                  setCreate(bool);
                  setSingleRowData({});
                }}
              />
            )}
            <ConfirmationModal
              isOpen={deleteConfrim}
              onCancel={() => setDeleteConfrim(false)}
              onConfirm={handelConfirm}
              title="Are you sure to delete!"
            />
            <ConfirmationModal
              isOpen={statusConfirm}
              onCancel={() => setStatusConfirm(false)}
              onConfirm={handelStatusConfirm}
              title="Are you sure to update status!"
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
