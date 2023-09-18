/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */

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
}: {
  show: boolean;
  setShow?: (bool: boolean) => void;
  singleRowData?: any;
  campaignId?: string;
  handleSuccess?: (data: any) => void;
}) {
  const [actionButton, setActionButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iconImgSrc, setIconImgSrc] = useState<string>();
  const [imageSrc, setBodyImages] = useState<string>();
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
            : setBodyImages(reader.result?.toString() as string),
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
    });
    setShow?.(false);
    setActionButton(false);
  }

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.set(key, value as any);
    }

    formData.set('campaignId', campaignId ?? '');
    formData.set('icon', iconImg as Blob);
    formData.set('image', image as Blob);

    try {
      setLoading(true);
      let creative;
      if (values?._id)
        creative = await api.patch(`/creative/${values?._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      else
        creative = await api.post('/creative', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      toast.success('Creative created successfully');
      setLoading(false);
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
                  Size: 196x196px
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
                  onChange={(e) => handleFileSelect(e, true)}
                />
              </div>
            </div>

            <div className=" flex justify-start">
              {iconImgSrc && (
                <ReusableReactCrop
                  src={iconImgSrc as string}
                  aspectRatio={1}
                  width={196}
                  height={196}
                  onCropComplete={(cropedFile) => setIconImg(cropedFile)}
                />
              )}
            </div>

            {/* Upload Body Image */}
            <div className="flex justify-between">
              <div className="">
                <div className="text-base font-semibold text-gray">
                  Upload Body Image
                </div>
                <div className="text-start text-sm font-semibold text-light-gray">
                  Size: 492x328px
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
                  onChange={(e) => handleFileSelect(e, false)}
                />
              </div>
            </div>

            <div className=" flex justify-start">
              {imageSrc && (
                <ReusableReactCrop
                  src={imageSrc as string}
                  aspectRatio={492 / 328}
                  width={492}
                  height={328}
                  onCropComplete={(cropedFile) => setImage(cropedFile)}
                />
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
                  {String('{city},{regionName}')}
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
                  {String('{city},{regionName}')}
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
                    '{externalId}{campaignId}{creativeId}{subscriptionId}{days}{feedId}{clickid}{t1}{t2}{t3}{t4}{t5}{uid}{title}{body}{previewImgName}{bodyImgName}',
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
