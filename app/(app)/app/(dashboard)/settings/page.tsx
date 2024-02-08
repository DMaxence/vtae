import { ReactNode } from "react";
import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Settings
        </h1>
        <Form
          title="Profile Picture"
          helpText="Max file size 1MB. Recommended size 400x400."
          inputAttrs={{
            name: "image",
            type: "avatar",
            defaultValue: session.user?.image!,
          }}
          handleSubmit={editUser}
        />
        <Form
          title="First Name"
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: "firstname",
            type: "text",
            defaultValue: session.user.firstname!,
            placeholder: "John",
            maxLength: 32,
          }}
          handleSubmit={editUser}
        />
        <Form
          title="First Name"
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: "lastname",
            type: "text",
            defaultValue: session.user.lastname!,
            placeholder: "Doe",
            maxLength: 32,
          }}
          handleSubmit={editUser}
        />
        <Form
          title="Email"
          description="Your email on this app."
          helpText="Please enter a valid email."
          inputAttrs={{
            name: "email",
            type: "email",
            defaultValue: session.user.email!,
            placeholder: "panic@thedis.co",
          }}
          handleSubmit={editUser}
        />
      </div>
    </div>
  );
}
