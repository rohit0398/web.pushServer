/* eslint-disable no-underscore-dangle */

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button, CustomCheckbox, InputField, SelectSearch } from '@/atoms';
import ConfirmationModal from '@/atoms/confirmationModal';
import MultiSelectSearch from '@/atoms/multiSelectedSearch';
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

import { CreateCreative } from '../createCreative';

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

export function CreateCampaign({
  setCreate,
  singleRowData = {},
}: {
  setCreate: (bool: boolean) => void;
  singleRowData?: any;
}) {
  const [loading, setLoading] = useState(false);
  const [createCreative, setCreateCreative] = useState(false);
  const [feeds, setFeeds] = useState<{ label: string; value: string }[]>([]);
  const [creatives, setCreatives] = useState<any>([]);
  const [seletedCreative, setSelectedCreative] = useState({});
  const [campaignCreatives, setCampaignCreatives] = useState<any>([]);
  const [deletingObj, setDeletingObj] = useState<{ ind: number; _id: string }>({
    ind: 0,
    _id: '',
  });
  const [confirmation, setConfirmation] = useState(false);

  const { register, handleSubmit, formState, control, reset, watch } =
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

  const values = watch() ?? {};

  useEffect(() => {
    if (singleRowData?.title) {
      const raw = { ...singleRowData };
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
  }, [singleRowData]);

  useEffect(() => {
    if (values?._id) fetchCampaignCreatives(values?._id);
  }, [values?._id]);

  useEffect(() => {
    fetchFeeds();
    fetchCreatives();
  }, []);

  function fetchFeeds() {
    return api.get('/feed').then((res) => {
      if (Array.isArray(res?.data))
        setFeeds(
          res.data.map((val) => {
            return {
              label: `${val?.title ?? ''}, ID:${val?._id?.slice(0, 6)}...`,
              value: val?._id,
            };
          }),
        );
    });
  }

  function fetchCreatives() {
    return api.get('/creative').then((res) => {
      if (Array.isArray(res?.data)) setCreatives(res?.data);
    });
  }

  function fetchCampaignCreatives(_id: string) {
    return api.get(`/creative?campaignId=${_id}`).then((res) => {
      if (Array.isArray(res?.data)) setCampaignCreatives(res?.data);
    });
  }

  function handelSelectExistingCreative(creative: any) {
    const found =
      Array.isArray(creatives) &&
      creatives.find((val) => val?._id === creative?.value);

    if (found) {
      setSelectedCreative(found);
      setCreateCreative(true);
    } else toast.error(wentWrong);
  }

  function handleDeleteCreative({ ind, _id }: { ind: number; _id: string }) {
    setDeletingObj({ ind, _id });
    setConfirmation(true);
  }

  function handelConfirm() {
    const raw = [...campaignCreatives];
    raw.splice(deletingObj?.ind, 1);
    setCampaignCreatives(raw);
    setConfirmation(false);
    setLoading(true);
    api
      .delete(`/creative/${deletingObj?._id}`)
      .then(() => {
        toast.success('Creative deleted successfully');
      })
      .catch(() => toast.error(wentWrong))
      .finally(() => setLoading(false));
  }

  function handleCreativeSuccess(res: any) {
    setCampaignCreatives((prev: any) => [...prev, res]);
    setCreateCreative(false);
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

  const onSubmit = async (formValues: FormData) => {
    const raw: any = { ...formValues };
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
  return (
    <div className={`absolute inset-x-0 top-0 z-10 bg-white p-3 sm:p-10`}>
      <div className=" flex justify-between">
        <h2 className="text-3xl font-semibold text-gray">Create Campaign</h2>

        <Button
          title="Cancel"
          variant="out-lined"
          onClick={handleCancelCreate}
        />
      </div>
      <div className=" grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className=" col-span-3">
          <form className="mt-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              options={feeds}
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
                disabled={loading}
                type={'submit'}
                title="Save"
                paddingMargin="px-5 lg:px-16"
              />
            </div>
          </form>
        </div>
        {formState?.defaultValues?._id && (
          <div className=" col-span-2 mt-28 p-5">
            <div className={segmentHeading}>Creative: Search Or Add New</div>

            <div className=" flex flex-col gap-8">
              {campaignCreatives.map((val: any, ind: number) => (
                <div key={ind} className=" flex flex-col">
                  <div className="max-h-52 w-full overflow-hidden rounded-t-xl">
                    <img
                      alt="img"
                      src={val?.bodyImage}
                      className=" w-full border border-stroke-light-gray object-cover"
                    />
                  </div>
                  <div className=" flex items-center gap-4 border border-stroke-light-gray p-4">
                    <img
                      alt="img"
                      src={val?.previewImage}
                      className=" max-h-10 max-w-[4rem] overflow-hidden rounded object-cover"
                    />
                    <div className=" text-base font-semibold text-gray">
                      {val?.title}
                    </div>
                  </div>
                  <div className=" flex items-center justify-between border border-stroke-light-gray p-4">
                    <div className=" text-base font-semibold text-light-gray">
                      ID:{val?._id}
                    </div>
                    <div className="flex gap-2">
                      <PencilIcon
                        onClick={() =>
                          handelSelectExistingCreative({ value: val?._id })
                        }
                        className=" h-5 w-5 cursor-pointer text-dark-purple"
                      />
                      <TrashIcon
                        onClick={() =>
                          handleDeleteCreative({ ind, _id: val?._id })
                        }
                        className=" h-5 w-5 cursor-pointer text-dark-purple"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className=" mt-6 grid grid-cols-1 items-center md:grid-cols-3">
              <div className=" col-span-2">
                <SelectSearch
                  options={creatives.map((val: any) => {
                    return {
                      label: `${val?.title ?? ''}, ID:${val?._id?.slice(
                        0,
                        6,
                      )}...`,
                      value: val?._id,
                    };
                  })}
                  name="creatives"
                  label="Existing Creatives"
                  value={[]}
                  onChange={handelSelectExistingCreative}
                />
              </div>
              <div className=" flex justify-center pt-2">
                <Button
                  title="Add New"
                  onClick={() => setCreateCreative(true)}
                  className="w-full md:w-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <CreateCreative
        campaignId={formState?.defaultValues?._id}
        singleRowData={seletedCreative}
        show={createCreative}
        setShow={(bool) => {
          setCreateCreative(bool);
          setSelectedCreative({});
        }}
        handleSuccess={handleCreativeSuccess}
      />
      <ConfirmationModal
        isOpen={confirmation}
        onCancel={() => setConfirmation(false)}
        onConfirm={handelConfirm}
        title="Are you sure!"
      />
    </div>
  );
}
