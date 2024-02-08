import DashboardContentTitle from "@/components/dashboard-content-title";
import Form from "@/components/form";
import AddIcons from "@/components/form/add-icons";
import { addHeroImage, updateSite, updateThemeConfig } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

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
    include: {
      iconsList: true,
      themeConfig: true,
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

  return (
    <>
      <DashboardContentTitle
        site={data}
        title={`Appearance for ${data.name}`}
      />
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
        <Form
          title="Theme Customization"
          description="Customize the theme for your site."
          helpText="Make your site unique."
          inputAttrs={{
            name: "bgColor",
            type: "select",
            defaultValue: data?.themeId!,
            options: themes.map((theme) => ({
              value: theme.id,
              label: theme.name,
              image: theme.thumbnail!,
            })),
          }}
          handleSubmit={updateThemeConfig}
        />
        {/* <Form
          title="Thumbnail image"
          description="The thumbnail image for your site. Accepted formats: .png, .jpg, .jpeg"
          helpText="Max file size 1MB. Recommended size 1200x630."
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
          title="Hero Image"
          description="The image on the Hero section (top) of your site. Accepted format: .png"
          helpText="Max file size 1MB. Recommended size 1200x630."
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.themeConfig?.image!,
          }}
          handleSubmit={addHeroImage}
        />
        <Form
          title="Logo"
          description="The logo for your site. Accepted formats: .png, .jpg, .jpeg"
          helpText="Max file size 1MB. Recommended size 400x400."
          inputAttrs={{
            name: "logo",
            type: "file",
            defaultValue: data?.logo!,
          }}
          handleSubmit={updateSite}
        />
        <AddIcons site={data} />
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
