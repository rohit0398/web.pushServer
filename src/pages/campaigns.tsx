/* eslint-disable no-underscore-dangle */

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button, CustomCheckbox, InputField, Loader } from '@/atoms';
import ConfirmationModal from '@/atoms/confirmationModal';
import MultiSelectSearch from '@/atoms/multiSelectedSearch';
import { CustomTable } from '@/atoms/table/table';
import { Layout } from '@/layouts';
import api from '@/utils/api';
import {
  Browsers,
  Countries,
  Devices,
  Os,
  PopularLanguages,
} from '@/utils/consts';
import {
  convertOptionsToValues,
  convertValuesToOptions,
  convertValuesToOptionsDaysHours,
  resetDaysHours,
  wentWrong,
} from '@/utils/helper';

interface FormData {
  hours: {
    [key: number]: boolean;
  };
  days: {
    [key: string]: boolean;
  };
  countries: {
    [key: string]: string;
  }[];
  feeds: {
    [key: string]: string;
  }[];
  languages: {
    [key: string]: string;
  }[];
  browsers: {
    [key: string]: string;
  }[];
  devices: {
    [key: string]: string;
  }[];
  os: {
    [key: string]: string;
  }[];
  subscriptionFrom: string;
  subscriptionTo: string;
  random: string;
  frequency: string;
  title: string;
  _id: string;
}

const segmentHeading = `text-xl font-semibold text-gray`;
const labelClass = ` text-medium-gray font-medium mb-2`;

export default function Campaign() {
  const [create, setCreate] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deletingObj, setDeletingObj] = useState<{ ind: number; _id: string }>({
    ind: 0,
    _id: '',
  });

  const { register, handleSubmit, formState, control, reset } =
    useForm<FormData>({
      defaultValues: {
        subscriptionFrom: '0',
        subscriptionTo: '0',
        random: '0',
        frequency: '0',
        hours: resetDaysHours('hours'),
        days: resetDaysHours(),
      },
    });
  // Initialize the form field with an empty array
  useEffect(() => {
    setLoading(true);
    api
      .get('/campaign')
      .then((res) => setData(res?.data ?? []))
      .catch(() => toast.error(wentWrong))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete({ ind, _id }: { ind: number; _id: string }) {
    setDeletingObj({ ind, _id });
    setConfirmModal(true);
  }

  function handelConfirm() {
    const raw = [...data];
    raw.splice(deletingObj?.ind, 1);
    setData(raw);
    setConfirmModal(false);
    setLoading(true);
    api
      .delete(`/campaign/${deletingObj?._id}`)
      .then(() => {
        toast.success('Campaign deleted successfully');
      })
      .catch(() => toast.error(wentWrong))
      .finally(() => setLoading(false));
  }

  function handelEdit(singleRow: any) {
    const raw = { ...singleRow };
    setCreate(true);
    raw.days = convertValuesToOptionsDaysHours(raw.days);
    raw.hours = convertValuesToOptionsDaysHours(raw.hours, 'hours');
    raw.countries = convertValuesToOptions(raw.countries);
    raw.languages = convertValuesToOptions(raw.languages);
    raw.browsers = convertValuesToOptions(raw.browsers);
    raw.devices = convertValuesToOptions(raw.devices);
    raw.os = convertValuesToOptions(raw.os);
    raw.feeds = convertValuesToOptions(raw.feeds);
    reset(raw);
  }

  async function handleCancelCreate() {
    reset({
      subscriptionFrom: '0',
      subscriptionTo: '0',
      random: '0',
      frequency: '0',
      title: '',
      hours: resetDaysHours('hours'),
      days: resetDaysHours(),
    });
    setCreate(false);
  }

  const onSubmit = async (values: FormData) => {
    const raw: any = { ...values };
    const days = Object.entries(raw.days)
      .map(([key, value]: any) => {
        return value ? key : undefined;
      })
      .filter((val) => val);
    const hours = Object.entries(raw.hours)
      .map(([key, value]: any) => {
        return value ? key : undefined;
      })
      .filter((val) => val);

    raw.days = days.length === 7 ? ([] as any) : days;
    raw.hours = hours.length === 24 ? ([] as any) : hours;
    raw.countries = convertOptionsToValues(raw.countries);
    raw.languages = convertOptionsToValues(raw.languages);
    raw.browsers = convertOptionsToValues(raw.browsers);
    raw.devices = convertOptionsToValues(raw.devices);
    raw.os = convertOptionsToValues(raw.os);
    raw.feeds = convertOptionsToValues(raw.feeds);

    try {
      setLoading(true);
      if (raw?._id) await api.patch('/campaign', raw);
      else await api.post('/campaign', raw);
      toast.success('Campaign created successfully');
      setLoading(false);
    } catch (_err) {
      toast.error(wentWrong);
    }
  };

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
            <div
              className={`absolute inset-x-0 top-0 z-20 bg-white p-3 sm:p-10`}
            >
              <div className=" flex justify-between">
                <h2 className="text-3xl font-semibold text-gray">
                  Create Campaign
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
                <div className="flex flex-col">
                  <label htmlFor="title" className={labelClass}>
                    Title
                  </label>
                  <InputField
                    name="title"
                    type="text"
                    placeholder="Type here"
                    register={register}
                    formState={formState}
                    rules={{
                      required: 'This is a required field.',
                    }}
                  />
                </div>
                <hr className="mb-4 mt-6 border-t" />

                <h5 className={segmentHeading}>Targeting options</h5>

                <MultiSelectSearch
                  options={[]}
                  control={control}
                  name="feeds"
                  label="Feeds"
                  error={formState?.errors?.feeds}
                />
                <MultiSelectSearch
                  options={PopularLanguages}
                  control={control}
                  name="languages"
                  label="Language"
                  error={formState?.errors?.languages}
                />

                <MultiSelectSearch
                  options={Countries}
                  control={control}
                  name="countries"
                  label="Countries"
                  error={formState?.errors?.countries}
                />
                <MultiSelectSearch
                  options={Browsers}
                  control={control}
                  name="browsers"
                  label="Browsers"
                  error={formState?.errors?.browsers}
                />

                <MultiSelectSearch
                  options={Devices}
                  control={control}
                  name="devices"
                  label="Devices"
                  error={formState?.errors?.devices}
                />

                <MultiSelectSearch
                  options={Os}
                  control={control}
                  name="os"
                  label="OS"
                  error={formState?.errors?.os}
                />

                <div className="">
                  <div className={labelClass}>Subscription period</div>
                  <div className="">
                    <div className=" flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                      <span>From</span>
                      <InputField
                        name="subscriptionFrom"
                        type="number"
                        placeholder="0"
                        register={register}
                        formState={formState}
                        rules={{
                          required: 'This is a required field.',
                        }}
                      />

                      <span>hours to</span>

                      <InputField
                        name="subscriptionTo"
                        type="number"
                        placeholder="23"
                        register={register}
                        formState={formState}
                        rules={{
                          required: 'This is a required field.',
                        }}
                      />
                      <span>hours</span>
                    </div>
                  </div>
                </div>

                <hr className="mb-4 mt-6 border-t" />

                <div className="">
                  <div className={labelClass}>
                    Send random
                    <span className="" aria-label="question-circle" />
                  </div>
                  <div className=" flex">
                    <InputField
                      name="random"
                      type="number"
                      placeholder="0"
                      register={register}
                      formState={formState}
                      rules={{
                        required: 'This is a required field.',
                      }}
                    />
                  </div>
                </div>
                <div className="">
                  <div className={labelClass}>
                    Creatives frequency, hours
                    <span className="" aria-label="question-circle" />
                  </div>
                  <div className=" flex">
                    <InputField
                      name="frequency"
                      type="number"
                      placeholder="0"
                      register={register}
                      formState={formState}
                      rules={{
                        required: 'This is a required field.',
                      }}
                    />
                  </div>
                </div>

                <hr className="mb-4 mt-6 border-t" />
                <div className={segmentHeading}>Time schedule</div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className={labelClass}>Target Hours</h3>
                    <div className="grid grid-cols-4  space-y-2 sm:grid-cols-8">
                      {[...Array(24)].map((_, ind) => (
                        <CustomCheckbox
                          key={ind}
                          label={`${ind}`}
                          name={`hours[${ind}]`}
                          register={register}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={labelClass}>Target Days</h3>
                    <div className="grid grid-cols-2 space-y-2 sm:grid-cols-4">
                      {[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ].map((day) => (
                        <CustomCheckbox
                          key={day}
                          label={day}
                          name={`days[${day}]`}
                          register={register}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className=" !mt-16">
                  <Button
                    type={'submit'}
                    title="Save"
                    paddingMargin="px-5 lg:px-16"
                  />
                </div>
              </form>
            </div>
          )}
          <ConfirmationModal
            isOpen={confirmModal}
            onCancel={() => setConfirmModal(false)}
            onConfirm={handelConfirm}
            title="Are you sure!"
          />
        </div>
      </div>
    </Layout>
  );
}
