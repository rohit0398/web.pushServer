import { Button, InputField } from "@/atoms";
import { Table } from "@/atoms/table/table";
import { Layout } from "@/layouts";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function Feeds() {
  const [create, setCreate] = useState(false);

  const { register, handleSubmit, formState } =
    useForm<FormData>({
      defaultValues: {},
    });

  const data = [
    {
      title: "Angela",
      subscriptions: 3,
      unsubscribed: 0,
      id: "13",
      active: "single",
    },
    {
      title: "Madisen",
      subscriptions: 3,
      unsubscribed: 0,
      id: "75",
      active: "relationship",
    },
    {
      title: "Clair",
      subscriptions: 3,
      unsubscribed: 0,
      id: "56",
      active: "single",
    },
    {
      title: "Emilia",
      subscriptions: 8,
      unsubscribed: 1,
      id: "20",
      active: "relationship",
    },
    {
      title: "Domenic",
      subscriptions: 8,
      unsubscribed: 1,
      id: "91",
      active: "complicated",
    },
  ];

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnFilter: false,
      },
      {
        accessorKey: "title",
        header: "Title",
        enableColumnFilter: false,
      },
      {
        accessorKey: "active",
        header: "Active",
        enableColumnFilter: false,
      },
      {
        accessorKey: "subscriptions",
        header: "Subscriptions",
        enableColumnFilter: false,
      },
      {
        accessorKey: "unsubscribed",
        header: "Unsubscribed",
        enableColumnFilter: false,
      },
    ],
    []
  );

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Layout>
      <div className=" w-full mb-5 p-3 sm:p-10 pb-10 bg-stroke-light-gray h-full overflow-y-auto">
        <div className=" bg-white rounded-2xl p-3 sm:p-10 relative">
          <div className=" mb-8 flex justify-between">
            <h2 className="text-3xl font-semibold text-gray">Feeds</h2>
            <Button title="Create" onClick={() => setCreate(true)} />
          </div>
          <div>
            <Table columns={columns} data={data} />
          </div>

          {create && (
            <div
              className={`absolute top-0 left-0 right-0 z-20 bg-white p-3 sm:p-10`}
            >
              <div className=" flex justify-between">
                <h2 className="text-3xl font-semibold text-gray">
                  Create Feed
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
                <div className="flex flex-col gap-5">
                  <InputField
                    label="Title"
                    name="title"
                    type="text"
                    placeholder="Type here"
                    register={register}
                    formState={formState}
                    rules={{
                      required: "This is a required field.",
                    }}
                  />
                  <InputField
                    label="Description"
                    name="description"
                    type="text"
                    placeholder="Type here"
                    register={register}
                    formState={formState}
                    rules={{
                      required: "This is a required field.",
                    }}
                  />
                  <InputField
                    label="Postback URL"
                    name="postbackUrl"
                    type="text"
                    placeholder="Type here"
                    register={register}
                    formState={formState}
                    rules={{
                      required: "This is a required field.",
                    }}
                  />
                  <InputField
                    label="Frequency"
                    name="frequency"
                    type="number"
                    placeholder="0"
                    register={register}
                    formState={formState}
                    rules={{
                      required: "This is a required field.",
                    }}
                  />

                  <InputField
                    label={`Redirect URL when a user clicks "Allow"`}
                    name="allowRedirectUrl"
                    type="text"
                    placeholder="https://domainname.com/someurl.php"
                    register={register}
                    formState={formState}
                    rules={{
                      required: "This is a required field.",
                    }}
                  />

                  <InputField
                    label={`Redirect URL when a user clicks "Block" or if there is no support for push notifications`}
                    name="blockRedirectUrl"
                    type="text"
                    placeholder="https://domainname.com/someurl.php"
                    register={register}
                    formState={formState}
                    rules={{
                      required: "This is a required field.",
                    }}
                  />
                </div>

                <div className=" mt-8">
                  <Button type={"submit"} title="Save" />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
