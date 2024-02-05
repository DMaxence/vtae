import prisma from "@/lib/prisma";
import Form from "@/components/form";
import { updateSite } from "@/lib/actions";
import { Site } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function SiteSettingsAppearance({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });
  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  const themes = await prisma.theme.findMany({
    where: {
      type: data?.type,
    },
  });
  console.log("page", data?.themeId, data?.type, themes);

  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col items-center space-x-4 space-y-2 sm:flex-row sm:space-y-0">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          Appearance for {data.name}
        </h1>
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {url} ↗
        </a>
      </div>
      <div className="flex flex-col space-y-6">
        <Form
          title="Theme"
          description="The theme for your site."
          helpText="Please select a theme."
          inputAttrs={{
            name: "themeId",
            type: "select",
            defaultValue: data?.themeId!,
            options: themes.map((theme) => ({
              value: theme.id,
              label: theme.name,
              image: theme.thumbnail!,
            })),
          }}
          handleSubmit={updateSite}
        />
        {/* <Form
          title="Thumbnail image"
          description="The thumbnail image for your site. Accepted formats: .png, .jpg, .jpeg"
          helpText="Max file size 10MB. Recommended size 1200x630."
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
            button: true,
          }}
          handleSubmit={updateSite}
          site={data as Site}
        /> */}
        <Form
          title="Logo"
          description="The logo for your site. Accepted formats: .png, .jpg, .jpeg"
          helpText="Max file size 10MB. Recommended size 400x400."
          inputAttrs={{
            name: "logo",
            type: "file",
            defaultValue: data?.logo!,
          }}
          handleSubmit={updateSite}
        />
        {/* <Form
          title="Font"
          description="The font for the heading text your site."
          helpText="Please select a font."
          inputAttrs={{
            name: "font",
            type: "select",
            defaultValue: data?.font!,
          }}
          handleSubmit={updateSite}
        /> */}
        {/* <Form
          title="404 Page Message"
          description="Message to be displayed on the 404 page."
          helpText="Please use 240 characters maximum."
          inputAttrs={{
            name: "message404",
            type: "text",
            defaultValue: data?.message404!,
            placeholder: "Blimey! You've found a page that doesn't exist.",
            maxLength: 240,
          }}
          handleSubmit={updateSite}
        /> */}
      </div>
    </>
  );
}
