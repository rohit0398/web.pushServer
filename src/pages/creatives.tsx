import React, { useCallback, useState } from "react";
import { Crop } from "react-image-crop";
import { Button, InputField, Modal } from "@/atoms";
import { getCroppedCanvas } from "@/utils/helper";
import { useForm } from "react-hook-form";
import ReusableReactCrop from "@/molecules/imageCrop";
import { Table, tableDataType } from "@/atoms/table/table";
import { ColumnDef, createColumnHelper, FilterFn } from "@tanstack/react-table";
import { Layout } from "@/layouts";

const columnHelper = createColumnHelper<tableDataType>();

type FormData = {
  previewImage: FileList;
  bodyImage: FileList;
};

interface ImageState {
  selectedFile: File | undefined;
  imgSrc: string | ArrayBuffer | null;
}

// Define the data type for each row
interface TableDataRow {
  ID: number;
  Title: string;
  Status: string;
  Countries: string[];
  Feeds: string[];
}

export default function AddCreative() {
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState<ImageState>({
    selectedFile: undefined,
    imgSrc: null,
  });
  const [bodyImages, setBodyImages] = useState<ImageState>({
    selectedFile: undefined,
    imgSrc: null,
  });

  const { register, handleSubmit, formState, watch } = useForm<FormData>();
  const previewImg = watch("previewImage");
  const bodyImg = watch("bodyImage");

  const handleCropComplete = useCallback(
    async (crop: Crop, isPreviewImage: boolean) => {
      const imagesState = isPreviewImage ? images : bodyImages;
      if (imagesState.imgSrc && crop.width && crop.height) {
        const image = new Image();
        image.src = imagesState.imgSrc as string;

        image.onload = async () => {
          const imageBlob = await getCroppedCanvas(image, crop, "image/png");
          console.log("blo", imageBlob);
          if (imageBlob) {
            const file = new File([imageBlob], "cropped-image.png", {
              type: "image/png",
            });
            console.log("file", file);
          }
        };
      }
    },
    [images, bodyImages]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, isPreviewImage: boolean) => {
      const imagesState = isPreviewImage ? images : bodyImages;
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () =>
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
              })
        );
        reader.readAsDataURL(file as File);
      }
    },
    [images, bodyImages]
  );

  const onSubmit = (data: FormData) => {
    // Handle file submission here
    console.log(data);
  };

  const data = [
    {
      title: "Angela",
      tags: ["ahfhd", "rohit"],
      id: "13",
      status: "single",
    },
    {
      title: "Madisen",
      tags: ["ahfhd", "rohit"],
      id: "75",
      status: "relationship",
    },
    {
      title: "Clair",
      tags: ["ahfhd", "rohit"],
      id: "56",
      status: "single",
    },
    {
      title: "Emilia",
      tags: ["ahfhd", "21rohit21"],
      id: "20",
      status: "relationship",
    },
    {
      title: "Domenic",
      tags: ["ahfhd", "21rohit21"],
      id: "91",
      status: "complicated",
    },
  ];

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        filterFn: "includesString",
        enableColumnFilter: false,
      },
      {
        accessorKey: "campaignId",
        header: "Campaign ID",
        filterFn: "includesString",
      },
      {
        accessorKey: "title",
        header: "Title",
        filterFn: "includesString",
        enableColumnFilter: false,
      },
      {
        accessorKey: "body",
        header: "Body",
        enableColumnFilter: false,
      },
      {
        accessorKey: "tags",
        header: "Tags",
        accessorFn: (row) => {
          return row?.tags?.join(",");
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
      {
        accessorKey: "random",
        header: "Random",
        enableColumnFilter: false,
      },
      {
        accessorKey: "data",
        header: "Data",
        enableColumnFilter: false,
      },
      {
        accessorKey: "previewImage",
        header: "Preview Image",
        enableColumnFilter: false,
      },
      {
        accessorKey: "bodyImage",
        header: "Body Image",
        enableColumnFilter: false,
      },
    ],
    []
  );

  return (
    <Layout>
      <div className=" w-full mb-5 p-3 sm:p-10 pb-10 bg-stroke-light-gray h-full overflow-y-auto">
        <div className=" bg-white rounded-2xl p-3 sm:p-10">
          <div className=" flex justify-between mb-8">
            <div className=" text-3xl font-semibold text-gray">Create</div>
            <Button title="creative" onClick={() => setShowModal(true)} />
          </div>

          <Table columns={columns} data={data} />

          <Modal
            open={showModal}
            setOpen={(bool) => setShowModal(bool)}
            width="sm:max-w-4xl sm:w-full max-h-[calc(100vh-4rem)] overflow-y-auto scroll-thin"
          >
            <div className="flex flex-col">
              <div className="text-2xl self-start font-semibold text-gray">
                Add creative
              </div>
              <div className="mt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Upload Preview Image */}
                  <div className="flex justify-between">
                    <div className="">
                      <div className="text-gray text-base font-semibold">
                        Upload Preview Image
                      </div>
                      <div className="text-light-gray text-sm font-semibold text-start">
                        Size: 196x196px
                      </div>
                    </div>

                    <div className="form-control">
                      <InputField
                        type="file"
                        id="previewImage"
                        name="previewImage"
                        className="form-input"
                        accept="image/png, image/jpeg"
                        register={register}
                        formState={formState}
                        required
                        validate={{
                          fileFormat: (value: any) =>
                            ["image/jpeg", "image/png"].includes(
                              value[0]?.type
                            ) || "Unsupported file format",
                          fileSize: (value: any) =>
                            value[0]?.size < 1024 * 1024 * 5 ||
                            "File size exceeds 5MB",
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
                      <div className="text-gray text-base font-semibold">
                        Upload Body Image
                      </div>
                      <div className="text-light-gray text-sm font-semibold text-start">
                        Size: 492x328px
                      </div>
                    </div>

                    <div className="form-control">
                      <InputField
                        type="file"
                        id="bodyImage"
                        name="bodyImage"
                        className="form-input "
                        accept="image/png, image/jpeg"
                        register={register}
                        formState={formState}
                        required
                        validate={{
                          fileFormat: (value: any) =>
                            ["image/jpeg", "image/png"].includes(
                              value[0]?.type
                            ) || "Unsupported file format",
                          fileSize: (value: any) =>
                            value[0]?.size < 1024 * 1024 * 5 ||
                            "File size exceeds 5MB",
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

                  <div className=" flex flex-col gap-3 max-w-[25rem] ml-auto">
                    <div className=" flex flex-col">
                      <InputField
                        label="Title"
                        name="Title"
                        placeholder="Title"
                        register={register}
                        formState={formState}
                        rules={{
                          required: "This is a required field.",
                        }}
                      />
                      <span className=" text-left mr-auto self-start place-self-start text-light-gray text-sm">
                        {String("{city},{regionName}")}
                      </span>
                    </div>

                    <div className=" flex flex-col">
                      <InputField
                        label="Body"
                        name="Body"
                        placeholder="Body"
                        register={register}
                        formState={formState}
                      />
                      <span className=" text-left mr-auto self-start place-self-start text-light-gray text-sm">
                        {String("{city},{regionName}")}
                      </span>
                    </div>

                    <div className=" flex flex-col">
                      <InputField
                        label="URL"
                        name="URL"
                        placeholder="URL"
                        register={register}
                        formState={formState}
                        rules={{
                          required: "This is a required field.",
                        }}
                      />
                      <span className=" text-left mr-auto self-start place-self-start text-light-gray text-sm">
                        <div>Available macros:</div>
                        {String(
                          "{externalId}{campaignId}{creativeId}{subscriptionId}{days}{feedId}{clickid}{t1}{t2}{t3}{t4}{t5}{uid}{title}{body}{previewImgName}{bodyImgName}"
                        )}
                      </span>
                    </div>

                    <InputField
                      label="Delay"
                      name="Delay"
                      placeholder="Delay"
                      register={register}
                      formState={formState}
                      rules={{
                        required: "This is a required field.",
                      }}
                    />
                  </div>

                  <div className=" flex justify-end gap-x-5 py-6">
                    <Button title="Cancel" variant="out-lined" />
                    <Button title="Save" type={"submit"} />
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}
