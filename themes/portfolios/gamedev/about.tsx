import { Avatar } from "@/components/avatar";
import { MaxWidthWrapper } from "@/components/home/max-width-wrapper";
import { PersonalInfos, Site, User } from "@prisma/client";

type AboutProps = {
  site: Site & {
    user: User;
    personalInfos: PersonalInfos;
  };
};

export default function About({ site }: AboutProps) {
  return (
    <div className="bg-[rgba(13,4,21,1)]">
      <MaxWidthWrapper
        id="about"
        className="flex flex-col gap-10 p-7 md:p-20 md:flex-row"
      >
        <Avatar
          user={{
            name: `${site.personalInfos.firstname} ${site.personalInfos.lastname}`,
            image: site.personalInfos.image,
            email: site.user.email,
          }}
          className="h-20 w-20 md:h-40 md:w-40"
        />
        <div className="flex flex-col gap-3.5">
          <div className="text-3xl font-bold text-white">
            {site.personalInfos.firstname} {site.personalInfos.lastname}
          </div>
          <div className="whitespace-pre-line text-white text-justify">
            {site.personalInfos.about}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
