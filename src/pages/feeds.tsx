/* eslint-disable no-underscore-dangle */
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button, InputField, Loader } from '@/atoms';
import ConfirmationModal from '@/atoms/confirmationModal';
import { CustomTable } from '@/atoms/table/table';
import { Layout } from '@/layouts';
import ProtectedRoute from '@/molecules/protected';
import api from '@/utils/api';
import {
  serviceWorkerStr,
  updateScriptString,
  wentWrong,
} from '@/utils/helper';

type FormData = {
  allowRedirectUrl: string;
  blockRedirectUrl: string;
  description: string;
  frequency: string;
  postbackUrl: string;
  title: string;
  _id?: string;
};

export default function Feeds() {
  const [scriptToCopy, setScriptToCopy] = useState('');
  const [create, setCreate] = useState(false);
  const [data, setData] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [deletingObj, setDeletingObj] = useState<{ ind: number; _id: string }>({
    ind: 0,
    _id: '',
  });
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState, reset } = useForm<FormData>({});

  useEffect(() => {
    setLoading(true);
    api
      .get('/feed')
      .then((res) => {
        setData(res.data ?? []);
      })
      .catch(() => toast.error(wentWrong))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(scriptToCopy);
  };

  const handleCopyToClipboard2 = () => {
    navigator.clipboard.writeText(serviceWorkerStr);
  };

  function handleDelete({ ind, _id }: { ind: number; _id: string }) {
    setDeletingObj({ ind, _id });
    setOpenConfirmationModal(true);
  }

  function handelConfirm() {
    const raw = [...data];
    raw.splice(deletingObj?.ind, 1);
    setData(raw);
    setOpenConfirmationModal(false);
    setLoading(true);
    api
      .delete(`/feed/${deletingObj?._id}`)
      .then(() => {
        toast.success('Feed deleted successfully');
      })
      .catch(() => toast.error(wentWrong))
      .finally(() => setLoading(false));
  }

  function handelEdit(singleRow: any) {
    setCreate(true);
    reset(singleRow);
    handleSetScript(singleRow);
  }

  async function handleCancelCreate() {
    reset({
      allowRedirectUrl: '',
      blockRedirectUrl: '',
      description: '',
      frequency: '0',
      postbackUrl: '',
      title: '',
    });
    setCreate(false);
    setScriptToCopy('');
  }

  function handleSetScript(obj: any) {
    const { allowRedirectUrl, blockRedirectUrl, postbackUrl } = obj;
    setScriptToCopy(
      updateScriptString({
        UPDATE_SUCCESS_URL: allowRedirectUrl,
        UPDATE_DENIED_URL: blockRedirectUrl,
        UPDATE_FEEDID: obj?._id,
        UPDATE_POSTBACK_URL: postbackUrl,
      }),
    );
  }

  const onSubmit = async (values: FormData) => {
    try {
      const feedRes = values?._id
        ? await api.patch(`/feed/${values?._id}`, values)
        : await api.post('/feed', values);
      toast.success('Feed create successfully');
      handleSetScript({ ...values, _id: feedRes?.data?._id });
    } catch (_err) {
      toast.error(wentWrong);
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: '_id',
        header: 'ID',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'count',
        header: 'Active subscriptions',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'actions',
        header: 'actions',
        enableColumnFilter: false,
        cell: ({ row }) => {
          return (
            <div className="flex gap-6">
              <div
                onClick={() =>
                  handleDelete({ ind: row.index, _id: row.original?._id })
                }
                className=" flex cursor-pointer gap-x-1 p-4 pl-0"
              >
                <TrashIcon className=" h-4 w-4 text-dark-purple" />
              </div>
              <div
                onClick={() => handelEdit(row.original)}
                className=" flex cursor-pointer gap-x-1 p-4"
              >
                <PencilIcon className=" h-4 w-4 text-dark-purple" />
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
              <h2 className="text-3xl font-semibold text-gray">Feeds</h2>
              <Button
                title="Create"
                onClick={() => {
                  setCreate(true);
                }}
              />
            </div>
            <div>
              <CustomTable columns={columns} data={data} />
            </div>

            <div
              className={`absolute inset-x-0 top-0 bg-white p-3 sm:p-10 ${
                create ? 'absolute z-20' : ' -z-20'
              }`}
            >
              <div className=" flex justify-between">
                <h2 className="text-3xl font-semibold text-gray">
                  Create Feed
                </h2>

                <Button
                  title="Cancel"
                  variant="out-lined"
                  onClick={handleCancelCreate}
                />
              </div>
              <form
                className="mt-4 space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-5">
                  <InputField
                    label="Title"
                    name="title"
                    type="text"
                    placeholder="Type here"
                    register={register}
                    formState={formState}
                    rules={{
                      required: 'This is a required field.',
                    }}
                  />
                  <InputField
                    label="Description"
                    name="description"
                    type="text"
                    placeholder="Type here"
                    register={register}
                    formState={formState}
                  />
                  <InputField
                    label="Postback URL"
                    name="postbackUrl"
                    type="text"
                    placeholder="Type here"
                    register={register}
                    formState={formState}
                    rules={{
                      required: 'This is a required field.',
                    }}
                  />
                  <InputField
                    label="Frequency"
                    name="frequency"
                    type="number"
                    placeholder="0"
                    defaultValue={0}
                    register={register}
                    formState={formState}
                    rules={{
                      required: 'This is a required field.',
                    }}
                  />

                  <InputField
                    label={`Redirect URL when a user clicks "Allow"`}
                    name="allowRedirectUrl"
                    type="text"
                    placeholder="https://domainname.com/someurl.php"
                    register={register}
                    formState={formState}
                  />

                  <InputField
                    label={`Redirect URL when a user clicks "Block" or if there is no support for push notifications`}
                    name="blockRedirectUrl"
                    type="text"
                    placeholder="https://domainname.com/someurl.php"
                    register={register}
                    formState={formState}
                  />
                </div>

                <div className=" mt-8 grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
                  <div>
                    <Button
                      type={'submit'}
                      title={scriptToCopy ? 'Update' : 'Save'}
                    />
                  </div>
                  {scriptToCopy && (
                    <div className="">
                      <div>
                        {`Copy and paste this code in index.html for relative file`}
                      </div>
                      <textarea
                        contentEditable={false}
                        value={scriptToCopy}
                        readOnly
                        className="h-32 w-full cursor-not-allowed rounded border border-stroke-gray bg-stroke-light-gray p-2 outline-none"
                      />

                      <Button
                        onClick={handleCopyToClipboard}
                        variant="out-lined"
                        title="Copy Script To Clipboard"
                      />

                      <div className=" mt-10">
                        <div>
                          {`Create file "serviceWorker.js" in your public folder or
                        root directory and paste this code.`}
                        </div>
                        <textarea
                          contentEditable={false}
                          value={serviceWorkerStr}
                          readOnly
                          className="h-32 w-full cursor-not-allowed rounded border border-stroke-gray bg-stroke-light-gray p-2 outline-none"
                        />
                      </div>
                      <Button
                        onClick={handleCopyToClipboard2}
                        variant="out-lined"
                        title="Copy Script To Clipboard"
                      />
                    </div>
                  )}
                </div>
              </form>

              <ConfirmationModal
                isOpen={openConfirmationModal}
                onCancel={() => setOpenConfirmationModal(false)}
                onConfirm={handelConfirm}
                title="Are you sure!"
              />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
