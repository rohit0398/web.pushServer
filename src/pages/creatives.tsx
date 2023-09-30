/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */

import {
  PauseIcon,
  PencilIcon,
  PlayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Loader } from '@/atoms';
import ConfirmationModal from '@/atoms/confirmationModal';
import { CustomTable } from '@/atoms/table/table';
import { Layout } from '@/layouts';
import { CreateCreative } from '@/molecules/createCreative';
import api from '@/utils/api';
import { wentWrong } from '@/utils/helper';

export default function AddCreative() {
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState(false);
  const [singleRowData, setSingleRowData] = useState<any>({});
  const [updateObj, setUpdateObj] = useState<{ ind: number; _id: string }>({
    ind: 0,
    _id: '',
  });

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    api
      .get('/creative')
      .then((res) => setData(res?.data))
      .catch(() => toast.error(wentWrong))
      .finally(() => setLoading(false));
  }, []);

  function handelEdit(singleRow: any) {
    setShowModal(true);
    setSingleRowData(singleRow);
  }

  function handleDelete({ ind, _id }: { ind: number; _id: string }) {
    setUpdateObj({ ind, _id });
    setDeleteConfirm(true);
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
      .delete(`/creative/${updateObj?._id}`)
      .then(() => {
        setData(raw);
        toast.success('Creative deleted successfully');
      })
      .catch(() => toast.error(wentWrong))
      .finally(() => {
        setLoading(false);
        setDeleteConfirm(false);
      });
  }

  function handelStatusConfirm() {
    const raw: any = [...data];
    const status =
      raw[updateObj.ind]?.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    raw[updateObj.ind] = { ...raw[updateObj.ind], status };
    setLoading(true);
    api
      .patch(`/creative/${updateObj?._id}`, { status })
      .then(() => {
        setData(raw);
        toast.success('Creative status udpated successfully');
      })
      .catch(() => toast.error(wentWrong))
      .finally(() => {
        setLoading(false);
        setStatusConfirm(false);
      });
  }

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: '_id',
        header: 'ID',
        filterFn: 'includesString',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'campaignId',
        header: 'Campaign ID',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'title',
        header: 'Title',
        filterFn: 'includesString',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'body',
        header: 'Body',
        enableColumnFilter: false,
        cell: ({ row }) => {
          return (
            <div className=" max-w-[10rem] truncate">
              {row?.getValue('body')}
            </div>
          );
        },
      },
      {
        accessorKey: 'icon',
        header: 'Preview Image',
        enableColumnFilter: false,
        cell: ({ row }) => {
          return (
            <div className=" my-2 max-h-24 max-w-[12rem] overflow-hidden rounded-md">
              <img
                alt="pImage"
                src={row?.getValue('icon')}
                className=" h-full max-h-24 w-full max-w-[12rem] object-contain"
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'image',
        header: 'Body Image',
        enableColumnFilter: false,
        cell: ({ row }) => {
          return (
            <div className=" my-2 max-h-20 max-w-[10rem] overflow-hidden rounded-md">
              <img
                alt="bImage"
                src={row?.getValue('image')}
                className=" h-full max-h-20 w-full max-w-[10rem] object-contain"
              />
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
    <Layout>
      <div className=" mb-5 h-full w-full overflow-y-auto bg-stroke-light-gray p-3 pb-10 sm:p-10">
        <div className=" rounded-2xl bg-white p-3 sm:p-10">
          {loading && <Loader />}
          <div className=" mb-8 flex justify-between">
            <div className=" text-3xl font-semibold text-gray">Creative</div>
          </div>

          <CustomTable columns={columns} data={data} />

          <CreateCreative
            singleRowData={singleRowData}
            show={showModal}
            setShow={(bool) => {
              setShowModal(bool);
              setSingleRowData({});
            }}
            campaignId={singleRowData?.campaignId}
          />

          <ConfirmationModal
            isOpen={deleteConfirm}
            onCancel={() => setDeleteConfirm(false)}
            onConfirm={handelConfirm}
            title="Are you sure to delete!"
          />

          <ConfirmationModal
            isOpen={statusConfirm}
            onCancel={() => setStatusConfirm(false)}
            onConfirm={handelStatusConfirm}
            title="Are you sure update status!"
          />
        </div>
      </div>
    </Layout>
  );
}
