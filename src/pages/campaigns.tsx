import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, CustomCheckbox, InputField } from '@/atoms';
import { RadioInput } from '@/atoms/input/CustomRadiobutton';
import MultiSelectSearch from '@/atoms/multiSelectedSearch';
import { CustomTable } from '@/atoms/table/table';
import { Layout } from '@/layouts';

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  // Add more countries as needed
];

interface FormData {
  hours: {
    [key: number]: boolean;
  };
  days: {
    [key: string]: boolean;
  };
  selectedCountries: string[];
  feeds: string[];
  Language: any;
  countryCode: any;
  browsers: any;
  devices: any;
  os: any;
  connection: any;
  deliveryType: any;
}

const segmentHeading = `text-xl font-semibold text-gray`;
const labelClass = ` text-medium-gray font-medium mb-2`;

export default function Index() {
  const [create, setCreate] = useState(false);
  const { register, handleSubmit, formState, setValue, watch } =
    useForm<FormData>({
      defaultValues: {
        hours: [...Array(24)].reduce(
          (acc, _, index) => {
            acc[index] = true;
            return acc;
          },
          {} as FormData['hours'],
        ),
        days: {
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: true,
          Sunday: true,
        },
      },
    });

  // Initialize the form field with an empty array
  useEffect(() => {
    register('selectedCountries');
    setValue('selectedCountries', []);
  }, [register, setValue]);

  const onSubmit = (_data: FormData) => {};

  const data = [
    {
      title: 'Angela',
      feeds: ['ahfhd', 'rohit'],
      id: '13',
      status: 'single',
    },
    {
      title: 'Madisen',
      feeds: ['ahfhd', 'rohit'],
      id: '75',
      status: 'relationship',
    },
    {
      title: 'Clair',
      feeds: ['ahfhd', 'rohit'],
      id: '56',
      status: 'single',
    },
    {
      title: 'Emilia',
      feeds: ['ahfhd', '21rohit21'],
      id: '20',
      status: 'relationship',
    },
    {
      title: 'Domenic',
      feeds: ['ahfhd', '21rohit21'],
      id: '91',
      status: 'complicated',
    },
  ];

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'id',
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
      },
      {
        accessorKey: 'countries',
        header: 'Countries',
      },
      {
        accessorKey: 'feeds',
        header: 'Feeds',
        accessorFn: (row) => {
          return row?.feeds?.join(',');
        },
        cell: (info) => {
          const val = info?.getValue() as string;
          const arr = val?.split(',');
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
    ],
    [],
  );

  const deliveryType = watch('deliveryType') as any;
  return (
    <Layout>
      <div className=" mb-5 h-full w-full overflow-y-auto bg-stroke-light-gray p-3 pb-10 sm:p-10">
        <div className=" relative rounded-2xl bg-white p-3 sm:p-10">
          <div className=" mb-8 flex justify-between">
            <h2 className="text-3xl font-semibold text-gray">Campaign</h2>
            <Button title="creative" onClick={() => setCreate(true)} />
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
                  onClick={() => setCreate(false)}
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
                  options={countries}
                  register={register}
                  name="selectedCountries"
                  label="Select Countries"
                  error={formState?.errors?.selectedCountries}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="feeds"
                  label="Feeds"
                  error={formState?.errors?.feeds}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="language"
                  label="Language"
                  error={formState?.errors?.Language}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="countryCode"
                  label="Countries"
                  error={formState?.errors?.countryCode}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="browsers"
                  label="Browsers"
                  error={formState?.errors?.browsers}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="devices"
                  label="Devices"
                  error={formState?.errors?.devices}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="os"
                  label="OS"
                  error={formState?.errors?.os}
                />

                <MultiSelectSearch
                  options={countries}
                  register={register}
                  name="connection"
                  label="Connection"
                  error={formState?.errors?.connection}
                />

                <div className="">
                  <div className={labelClass}>Subscription period</div>
                  <div className="">
                    <div className=" flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                      <span>From</span>
                      <InputField
                        name="subscriptionAgeFrom"
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
                        name="subscriptionAgeTo"
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
                  <div className={segmentHeading}>Delivery type</div>

                  <div className=" mt-6 flex flex-col gap-2 sm:flex-row">
                    <RadioInput
                      label="Creative and feed frequency"
                      value="creative-feed"
                      name="deliveryType"
                      register={register}
                      checked={deliveryType === 'creative-feed'}
                    />
                    <RadioInput
                      label="Creative schedule"
                      value="creative-schedule"
                      name="deliveryType"
                      register={register}
                      checked={deliveryType === 'creative-schedule'}
                    />
                    {/* Add more RadioInput components for other options */}
                  </div>
                </div>

                <div className="">
                  <div className={labelClass}>
                    Send random
                    <span className="" aria-label="question-circle" />
                  </div>
                  <div className=" flex">
                    <InputField
                      name="sendRandomCreatives"
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
        </div>
      </div>
    </Layout>
  );
}
