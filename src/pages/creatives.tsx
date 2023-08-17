/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Crop } from 'react-image-crop';
import { toast } from 'react-toastify';

import { Button, InputField, Loader, Modal } from '@/atoms';
import ConfirmationModal from '@/atoms/confirmationModal';
import { CustomTable } from '@/atoms/table/table';
import { Layout } from '@/layouts';
import ReusableReactCrop from '@/molecules/imageCrop';
import api from '@/utils/api';
import { getCroppedCanvas, wentWrong } from '@/utils/helper';

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

interface ImageState {
  selectedFile: File | undefined;
  imgSrc: string | ArrayBuffer | null;
}

export default function AddCreative() {
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [actionButton, setActionButton] = useState(false);
  const [deletingObj, setDeletingObj] = useState<{ ind: number; _id: string }>({
    ind: 0,
    _id: '',
  });
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageState>({
    selectedFile: undefined,
    imgSrc: null,
  });
  const [bodyImages, setBodyImages] = useState<ImageState>({
    selectedFile: undefined,
    imgSrc: null,
  });

  const [data, setData] = useState([]);

  const { register, handleSubmit, formState, reset } = useForm<FormData>();
  // const previewImg = watch('previewImage');
  // const bodyImg = watch('bodyImage');

  useEffect(() => {
    setLoading(true);
    api
      .get('/creative')
      .then((res) => setData(res?.data))
      .catch(() => toast.error(wentWrong))
      .finally(() => setLoading(false));
  }, []);

  const handleCropComplete = useCallback(
    async (crop: Crop, isPreviewImage: boolean) => {
      const imagesState = isPreviewImage ? images : bodyImages;
      if (imagesState.imgSrc && crop.width && crop.height) {
        const image = new Image();
        image.src = imagesState.imgSrc as string;

        image.onload = async () => {
          const imageBlob = await getCroppedCanvas(image, crop, 'image/png');
          if (imageBlob) {
            const file = new File([imageBlob], 'cropped-image.png', {
              type: 'image/png',
            });
            /* eslint-disable-next-line no-console */
            console.log('file', file);
          }
        };
      }
    },
    [images, bodyImages],
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, isPreviewImage: boolean) => {
      const imagesState = isPreviewImage ? images : bodyImages;
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () =>
          isPreviewImage
            ? setImages({
                ...imagesState,
                selectedFile: file,
                imgSrc: reader.result?.toString() || null,
              })
            : setBodyImages({
                ...imagesState,
                selectedFile: file,
                imgSrc: reader.result?.toString() || null,
              }),
        );
        reader.readAsDataURL(file as File);
      }
    },
    [images, bodyImages],
  );

  function handelEdit(singleRow: any) {
    setShowModal(true);
    reset(singleRow);
    if (singleRow?.buttonTitle) setActionButton(true);
  }

  function handleDelete({ ind, _id }: { ind: number; _id: string }) {
    setDeletingObj({ ind, _id });
    setConfirmModal(true);
  }

  async function handleCancelCreate() {
    reset({
      title: '',
      body: '',
      campaignId: '',
      url: '',
      buttonTitle: '',
      buttonUrl: '',
    });
    setShowModal(false);
    setActionButton(false);
  }

  function handelConfirm() {
    const raw = [...data];
    raw.splice(deletingObj?.ind, 1);
    setData(raw);
    setConfirmModal(false);
    setLoading(true);
    api
      .delete(`/creative/${deletingObj?._id}`)
      .then(() => {
        toast.success('Creative deleted successfully');
      })
      .catch(() => toast.error(wentWrong))
      .finally(() => setLoading(false));
  }

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    values.bodyImage =
      'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=328&ixid=MnwxfDB8MXxyYW5kb218MHx8c2FsZXx8fHx8fDE2OTIxMDY2NzE&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=492' as any;
    values.previewImage =
      'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=196&ixid=MnwxfDB8MXxyYW5kb218MHx8c2FsZXx8fHx8fDE2OTIxMDY2NzE&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=196' as any;
    try {
      setLoading(true);
      if (values?._id) await api.patch('/creative', data);
      else await api.post('/creative', data);
      toast.success('Creative created successfully');
      setLoading(false);
    } catch (_err) {
      toast.error(wentWrong);
    }
  };

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
        accessorKey: 'previewImage',
        header: 'Preview Image',
        enableColumnFilter: false,
        cell: ({ row }) => {
          return (
            <div className=" my-2 max-h-24 max-w-[12rem] overflow-hidden rounded-md">
              <img
                alt="pImage"
                src={row?.getValue('previewImage')}
                className=" h-full w-full object-contain "
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'bodyImage',
        header: 'Body Image',
        enableColumnFilter: false,
        cell: ({ row }) => {
          return (
            <div className=" my-2 max-h-20 max-w-[10rem] overflow-hidden rounded-md">
              <img
                alt="bImage"
                src={row?.getValue('bodyImage')}
                className=" h-full w-full object-contain "
              />
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
        <div className=" rounded-2xl bg-white p-3 sm:p-10">
          {loading && <Loader />}
          <div className=" mb-8 flex justify-between">
            <div className=" text-3xl font-semibold text-gray">Creative</div>
            <Button title="create" onClick={() => setShowModal(true)} />
          </div>

          <CustomTable columns={columns} data={data} />

          <Modal
            open={showModal}
            setOpen={(bool) => {
              bool === true ? setShowModal(bool) : handleCancelCreate();
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
                            value[0]
                              ? ['image/jpeg', 'image/png'].includes(
                                  value[0]?.type,
                                ) || 'Unsupported file format'
                              : true,
                          fileSize: (value: any) =>
                            value[0]
                              ? value[0]?.size < 1024 * 1024 * 5 ||
                                'File size exceeds 5MB'
                              : true,
                        }}
                        onChange={(e) => handleFileSelect(e, true)}
                      />
                    </div>
                  </div>

                  <div className=" flex justify-start">
                    {images.selectedFile && (
                      <ReusableReactCrop
                        src={images.imgSrc as string}
                        aspectRatio={1}
                        width={196}
                        height={196}
                        onCropComplete={(crop) =>
                          handleCropComplete(crop, true)
                        }
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
                          fileFormat: (value: any) =>
                            value[0]
                              ? ['image/jpeg', 'image/png'].includes(
                                  value[0]?.type,
                                ) || 'Unsupported file format'
                              : true,

                          fileSize: (value: any) =>
                            value[0]
                              ? value[0]?.size < 1024 * 1024 * 5 ||
                                'File size exceeds 5MB'
                              : true,
                        }}
                        onChange={(e) => handleFileSelect(e, false)}
                      />
                    </div>
                  </div>

                  <div className=" flex justify-start">
                    {bodyImages.selectedFile && (
                      <ReusableReactCrop
                        src={bodyImages.imgSrc as string}
                        aspectRatio={492 / 328}
                        width={492}
                        height={328}
                        onCropComplete={(crop) =>
                          handleCropComplete(crop, false)
                        }
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
                    <Button title="Save" type={'submit'} />
                  </div>
                </form>
              </div>
            </div>
          </Modal>
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
