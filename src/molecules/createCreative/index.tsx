/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */

import { get } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button, InputField, Modal } from '@/atoms';
import api from '@/utils/api';
import { wentWrong } from '@/utils/helper';

import ReusableReactCrop from '../imageCrop';

type FormData = {
  previewImage: FileList;
  bodyImage: FileList;
  icon?: string;
  image?: string;
  title: string;
  body: string;
  url: string;
  buttonTitle: string;
  buttonUrl: string;
  campaignId: string;
  _id?: string;
};

export function CreateCreative({
  show,
  setShow,
  singleRowData,
  campaignId,
  handleSuccess,
  addFromExisting,
}: {
  show: boolean;
  setShow?: (bool: boolean) => void;
  singleRowData?: any;
  campaignId?: string;
  handleSuccess?: (data: any) => void;
  addFromExisting?: boolean;
}) {
  const [actionButton, setActionButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iconImgSrc, setIconImgSrc] = useState<string>();
  const [imageSrc, setImagSrc] = useState<string>();
  const [iconImg, setIconImg] = useState<any>();
  const [image, setImage] = useState<any>();

  const { register, handleSubmit, formState, reset } = useForm<FormData>();

  useEffect(() => {
    if (singleRowData?.title) {
      reset(singleRowData);
      if (singleRowData?.buttonTitle) setActionButton(true);
    }
  }, [singleRowData]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, isPreviewImage: boolean) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () =>
          isPreviewImage
            ? setIconImgSrc(reader.result?.toString() as string)
            : setImagSrc(reader.result?.toString() as string),
        );
        reader.readAsDataURL(file as File);
      }
    },
    [iconImgSrc, imageSrc],
  );

  async function handleCancelCreate() {
    reset({
      title: '',
      body: '',
      campaignId: '',
      url: '',
      buttonTitle: '',
      buttonUrl: '',
      bodyImage: undefined,
      previewImage: undefined,
      icon: '',
      image: '',
    });
    setShow?.(false);
    setActionButton(false);
    setIconImgSrc('');
    setImagSrc('');
    setIconImg(null);
    setImage(null);
  }

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (
        !(
          key === 'previewImage' ||
          key === 'bodyImage' ||
          key === 'icon' ||
          key === 'image'
        )
      )
        formData.set(key, value as any);
    }

    if (iconImg) {
      formData.set('icon', iconImg as Blob);
      if (values?.icon && typeof values?.icon === 'string')
        formData.set('prevIcon', values?.icon);
    }
    if (image) {
      formData.set('image', image as Blob);
      if (values?.image && typeof values?.image === 'string')
        formData.set('prevImage', values?.image);
    }

    formData.set('campaignId', campaignId ?? '');

    try {
      setLoading(true);
      let creative;
      if (values?._id) {
        if (addFromExisting) {
          const iconSplit = values?.icon && values.icon.split('/icons/');
          const imageSplit = values?.image && values.image.split('/images/');
          if (get(iconSplit, '[1]'))
            formData.set('icon', `/icons/${get(iconSplit, '[1]')}` as any);
          if (get(imageSplit, '[1]'))
            formData.set('image', `/images/${get(imageSplit, '[1]')}` as any);

          formData.delete('_id');
          formData.delete('createdAt');

          creative = await api.post(`/creative`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else
          creative = await api.patch(`/creative/${values?._id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
      } else
        creative = await api.post('/creative', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      toast.success(
        `Creative ${
          values?._id && !addFromExisting ? 'updated' : 'created'
        } successfully`,
      );
      setLoading(false);
      handleCancelCreate();
      handleSuccess?.(creative?.data);
    } catch (_err) {
      toast.error(wentWrong);
    }
  };

  return (
    <Modal
      open={show}
      setOpen={(bool) => {
        bool === true ? setShow?.(bool) : handleCancelCreate();
      }}
      width="sm:max-w-4xl sm:min-w-[40rem] lg:min-w-[50rem] max-h-[calc(100vh-4rem)] overflow-y-auto scroll-thin"
    >
      <div className="flex w-full flex-col">
        <div className="self-start text-2xl font-semibold text-gray">
          Add creative
        </div>
        <div className="mt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Upload Preview Image */}
            <div className="flex justify-between">
              <div className="">
                <div className="text-base font-semibold text-gray">
                  Upload Preview Image
                </div>
                <div className="text-start text-sm font-semibold text-light-gray">
                  Size: 192x192px
                </div>
              </div>

              <div className="">
                <InputField
                  type="file"
                  id="previewImage"
                  name="previewImage"
                  className="form-input"
                  accept="image/png, image/jpeg"
                  register={register}
                  formState={formState}
                  validate={{
                    fileFormat: (value: any) =>
                      value[0]?.type
                        ? ['image/jpeg', 'image/png'].includes(
                            value[0]?.type,
                          ) || 'Unsupported file format'
                        : true,
                    fileSize: (value: any) =>
                      value[0]?.type
                        ? value[0]?.size < 1024 * 1024 * 5 ||
                          'File size exceeds 5MB'
                        : true,
                  }}
                  rules={{
                    required: singleRowData?._id
                      ? undefined
                      : 'File is required',
                  }}
                  onChange={(e) => handleFileSelect(e, true)}
                />
              </div>
            </div>

            <div className=" flex justify-start">
              {iconImgSrc ? (
                <ReusableReactCrop
                  src={iconImgSrc as string}
                  aspectRatio={192 / 192}
                  width={192}
                  height={192}
                  onCropComplete={(cropedFile) => setIconImg(cropedFile)}
                />
              ) : (
                singleRowData?.icon &&
                typeof singleRowData?.icon === 'string' && (
                  <img
                    src={singleRowData.icon}
                    className=" aspect-[192/192] max-w-[12rem] object-cover"
                    alt="uploadedimg"
                  />
                )
              )}
            </div>

            {/* Upload Body Image */}
            <div className="flex justify-between">
              <div className="">
                <div className="text-base font-semibold text-gray">
                  Upload Body Image
                </div>
                <div className="text-start text-sm font-semibold text-light-gray">
                  Size: 720x480px
                </div>
              </div>

              <div className="">
                <InputField
                  type="file"
                  id="bodyImage"
                  name="bodyImage"
                  className="form-input "
                  accept="image/png, image/jpeg"
                  register={register}
                  formState={formState}
                  validate={{
                    fileFormat: (value: any) => {
                      return value[0]?.type
                        ? ['image/jpeg', 'image/png'].includes(
                            value[0]?.type,
                          ) || 'Unsupported file format'
                        : true;
                    },
                    fileSize: (value: any) =>
                      value[0]?.type
                        ? value[0]?.size < 1024 * 1024 * 5 ||
                          'File size exceeds 5MB'
                        : true,
                  }}
                  rules={{
                    required: singleRowData?._id
                      ? undefined
                      : 'File is required',
                  }}
                  onChange={(e) => handleFileSelect(e, false)}
                />
              </div>
            </div>

            <div className=" flex justify-start">
              {imageSrc ? (
                <ReusableReactCrop
                  src={imageSrc as string}
                  aspectRatio={720 / 480}
                  width={720}
                  height={480}
                  onCropComplete={(cropedFile) => setImage(cropedFile)}
                />
              ) : (
                singleRowData?.image &&
                typeof singleRowData?.image === 'string' && (
                  <img
                    src={singleRowData.image}
                    className=" aspect-[720/480] max-w-[30rem] object-cover"
                    alt="uploadedimg"
                  />
                )
              )}
            </div>

            <div className=" ml-auto flex max-w-[25rem] flex-col gap-3">
              <div className=" flex flex-col">
                <InputField
                  label="Title"
                  name="title"
                  placeholder="Title"
                  register={register}
                  formState={formState}
                  rules={{
                    required: 'This is a required field.',
                  }}
                />
                <span className=" mr-auto place-self-start self-start text-left text-sm text-light-gray">
                  {'same as for URL'}
                </span>
              </div>

              <div className=" flex flex-col">
                <InputField
                  label="Body"
                  name="body"
                  placeholder="Body"
                  register={register}
                  formState={formState}
                />
                <span className=" mr-auto place-self-start self-start text-left text-sm text-light-gray">
                  {'same as for URL'}
                </span>
              </div>

              <div className=" flex flex-col">
                <InputField
                  label="URL"
                  name="url"
                  placeholder="URL"
                  register={register}
                  formState={formState}
                  rules={{
                    required: 'This is a required field.',
                  }}
                />
                <span className=" mr-auto place-self-start self-start text-left text-sm text-light-gray">
                  <div>Available macros:</div>
                  {String(
                    '{campaignId}{creativeId}{subscriptionId}{days}{feedId}{clickid}{t1}{t2}{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{title}{body}{previewImgName}{bodyImgName}',
                  )}
                </span>
              </div>

              <div className=" flex flex-col gap-4">
                {actionButton && (
                  <div>
                    <div className="mb-1 block text-left text-gray">
                      Add Action Button
                    </div>
                    <div className=" grid grid-cols-3 gap-4">
                      <InputField
                        name="buttonTitle"
                        placeholder="Title (i.e. Order)"
                        register={register}
                        formState={formState}
                      />
                      <div className=" col-span-2">
                        <InputField
                          name="buttonUrl"
                          placeholder="Callback URL (i.e. https://a1.com)"
                          register={register}
                          formState={formState}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => setActionButton((bool) => !bool)}
                  title={
                    actionButton
                      ? 'Remove Action Button'
                      : 'Add Action (Button) to Creative'
                  }
                  variant="out-lined"
                  size="h-10 w-fit"
                  fontSize="text-sm lg:text-base lg:font-normal opacity-90"
                />
              </div>
            </div>

            <div className=" flex justify-end gap-x-5 py-6">
              <Button
                onClick={handleCancelCreate}
                title="Cancel"
                variant="out-lined"
              />
              <Button disabled={loading} title="Save" type={'submit'} />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
