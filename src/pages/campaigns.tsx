import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { fetchDealsApi } from "@/apiService/deal";
import { fetchInvestorsApi } from "@/apiService/investor";
import { fetchStartupsApi } from "@/apiService/startup";
import {
  Button,
  CustomCheckbox,
  Heading2WithIcon,
  InputField,
  Loader,
  OneLinerCard,
} from "@/atoms";
import { Layout } from "@/layouts";
import { AnnouncementIcon } from "@/public/assets/svg-icons";
import MultiSelectSearch from "@/atoms/multiSelectedSearch";
import { RadioInput } from "@/atoms/input/CustomRadiobutton";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "@/atoms/table/table";

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
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
}

const segmentHeading = `text-xl font-semibold text-gray`;
const labelClass = `form-label text-medium-gray font-medium mb-2`;

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
          {} as FormData["hours"]
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
    register("selectedCountries");
    setValue("selectedCountries", []);
  }, [register, setValue]);

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const data = [
    {
      title: "Angela",
      feeds: ["ahfhd", "rohit"],
      id: "13",
      status: "single",
    },
    {
      title: "Madisen",
      feeds: ["ahfhd", "rohit"],
      id: "75",
      status: "relationship",
    },
    {
      title: "Clair",
      feeds: ["ahfhd", "rohit"],
      id: "56",
      status: "single",
    },
    {
      title: "Emilia",
      feeds: ["ahfhd", "21rohit21"],
      id: "20",
      status: "relationship",
    },
    {
      title: "Domenic",
      feeds: ["ahfhd", "21rohit21"],
      id: "91",
      status: "complicated",
    },
  ];

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        filterFn: "includesString",
      },
      {
        accessorKey: "title",
        header: "Title",
        filterFn: "includesString",
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: "includesString",
      },
      {
        accessorKey: "countries",
        header: "Countries",
      },
      {
        accessorKey: "feeds",
        header: "Feeds",
        accessorFn: (row) => {
          return row?.feeds?.join(",");
        },
        cell: (info) => {
          const val = info?.getValue() as string;
          const arr = val?.split(",");
          return (
            <div className=" flex gap-x-1">
              {arr.map((val, ind) => (
                <span key={ind} className=" bg-light-blue p-1 rounded">
                  {val}
                </span>
              ))}
            </div>
          );
        },
      },
    ],
    []
  );

  const deliveryType = watch("deliveryType") as any;
  return (
    <Layout>
      <div className=" w-full mb-5 p-3 sm:p-10 pb-10 bg-stroke-light-gray h-full overflow-y-auto">
        <div className=" bg-white rounded-2xl p-3 sm:p-10 relative">
          <div className=" mb-8 flex justify-between">
            <h2 className="text-3xl font-semibold text-gray">Campaign</h2>
            <Button title="creative" onClick={() => setCreate(true)} />
          </div>
          <div>
            <Table columns={columns} data={data} />
          </div>
          {create && (
            <div className={`absolute top-0 left-0 right-0 z-20 bg-white p-3 sm:p-10`}>
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
                      required: "This is a required field.",
                    }}
                  />
                </div>
                <hr className="border-t mt-6 mb-4" />

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

                <div className="form-item">
                  <div className={labelClass}>Subscription period</div>
                  <div className="form-control">
                    <div className=" flex flex-col items-start sm:flex-row sm:items-center gap-2">
                      <span>From</span>
                      <InputField
                        name="subscriptionAgeFrom"
                        type="number"
                        placeholder="0"
                        register={register}
                        formState={formState}
                        rules={{
                          required: "This is a required field.",
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
                          required: "This is a required field.",
                        }}
                      />
                      <span>hours</span>
                    </div>
                  </div>
                </div>

                <hr className="border-t mt-6 mb-4" />
                <div className="form-item">
                  <div className={segmentHeading}>Delivery type</div>

                  <div className=" flex flex-col sm:flex-row gap-2 mt-6">
                    <RadioInput
                      label="Creative and feed frequency"
                      value="creative-feed"
                      name="deliveryType"
                      register={register}
                      checked={deliveryType === "creative-feed"}
                    />
                    <RadioInput
                      label="Creative schedule"
                      value="creative-schedule"
                      name="deliveryType"
                      register={register}
                      checked={deliveryType === "creative-schedule"}
                    />
                    {/* Add more RadioInput components for other options */}
                  </div>
                </div>

                <div className="form-item">
                  <div className={labelClass}>
                    Send random
                    <span
                      className="question-icon"
                      aria-label="question-circle"
                    />
                  </div>
                  <div className="form-control flex">
                    <InputField
                      name="sendRandomCreatives"
                      type="number"
                      placeholder="0"
                      register={register}
                      formState={formState}
                      rules={{
                        required: "This is a required field.",
                      }}
                    />
                  </div>
                </div>
                <div className="form-item">
                  <div className={labelClass}>
                    Creatives frequency, hours
                    <span
                      className="question-icon"
                      aria-label="question-circle"
                    />
                  </div>
                  <div className="form-control flex">
                    <InputField
                      name="frequency"
                      type="number"
                      placeholder="0"
                      register={register}
                      formState={formState}
                      rules={{
                        required: "This is a required field.",
                      }}
                    />
                  </div>
                </div>

                <hr className="border-t mt-6 mb-4" />
                <div className={segmentHeading}>Time schedule</div>

                <div className="space-y-4 mt-6">
                  <div>
                    <h3 className={labelClass}>Target Hours</h3>
                    <div className="grid grid-cols-4  sm:grid-cols-8 space-y-2">
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 space-y-2">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
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
                    type={"submit"}
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
