"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Site, SiteType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { withSiteAuth } from "./auth";
// import { getClient } from "@umami/api-client";
import {
  addDomainToVercel,
  // getApexDomain,
  removeDomainFromVercelProject,
  // removeDomainFromVercelTeam,
  validDomainRegex,
} from "@/lib/domains";
import { getBlurDataURL, revalidateSite } from "@/lib/utils";
import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import { customAlphabet } from "nanoid";
import puppeteer from "puppeteer";
import { handleCloudinaryUpload } from "./cloudinary";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const createSite = async (formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;
  const type = formData.get("type") as SiteType;

  // const client = getClient();

  // const website = await client.createWebsite({
  //   name,
  //   domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
  // });

  try {
    const response = await prisma.site.create({
      data: {
        name,
        description,
        subdomain,
        type,
        theme: {
          connect: {
            slug: type === "RESUME" ? "light" : "gamedev",
          },
        },
        themeConfig: {
          create: {},
        },
        user: {
          connect: {
            id: session.user.id,
          },
        },
        // umamiId: data?.id,
      },
    });
    try {
      await prisma.personalInfos.create({
        data: {
          firstname: session.user.firstname,
          lastname: session.user.lastname,
          image: session.user.image,
          site: {
            connect: {
              id: response.id,
            },
          },
        },
      });
    } catch (e) {
      console.log(e);
    }

    await revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    // takeWebsiteScreenshot({
    //   url: process.env.NEXT_PUBLIC_VERCEL_ENV
    //     ? `https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    //     : `http://${subdomain}.localhost:${process.env.PORT || 3000}`,
    // });
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const updateSite = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vtae.xyz")) {
          return {
            error: "Cannot use vtae.xyz subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: value,
            },
          });
          await Promise.all([
            addDomainToVercel(value),
            // Optional: add www subdomain as well and redirect to apex domain
            // addDomainToVercel(`www.${value}`),
          ]);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: null,
            },
          });
        }

        // if the site had a different customDomain before, we need to remove it from Vercel
        if (site.customDomain && site.customDomain !== value) {
          response = await removeDomainFromVercelProject(site.customDomain);

          /* Optional: remove domain from Vercel team 

          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await prisma.site.count({
            where: {
              OR: [
                {
                  customDomain: apexDomain,
                },
                {
                  customDomain: {
                    endsWith: `.${apexDomain}`,
                  },
                },
              ],
            },
          });

          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          
          */
        }
      } else if (key === "image" || key === "logo") {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return {
            error:
              "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd",
          };
        }

        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
        });
      } else {
        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: key === "published" ? value === "true" : value,
          },
        });
      }
      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${site.customDomain}-metadata`,
      );
      await revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      site.customDomain &&
        (await revalidateTag(`${site.customDomain}-metadata`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteSite = withSiteAuth(async (_: FormData, site: Site) => {
  try {
    const response = await prisma.site.delete({
      where: {
        id: site.id,
      },
    });
    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    response.customDomain &&
      (await revalidateTag(`${site.customDomain}-metadata`));
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  if (key === "image") {
    const file = formData.get(key) as File;

    if (file.size > 0) {
      const filename = `${nanoid()}.${file.type.split("/")[1]}`;
      const base64 = await file.arrayBuffer();
      const base64String = Buffer.from(base64).toString("base64");

      const uploadResponse = await handleCloudinaryUpload({
        path: `data:image/png;base64,${base64String}`,
        name: filename,
        folder: "avatar",
      });

      const response = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          [key]: uploadResponse.secure_url,
        },
      });
      return response;
    } else {
      const response = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          [key]: null,
        },
      });
      return response;
    }
  }

  const value = formData.get(key) as string;
  try {
    const response = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [key]: value,
      },
    });
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const takeWebsiteScreenshot = async (options: { url: string }) => {
  // Get the url and fullPage from the options
  const { url } = options;

  // Launch a new browser using puppeteer
  const browser = await puppeteer.launch();

  // Create a new page in the browser
  const page = await browser.newPage();

  const urlObject = new URL(url);

  // Define a path where the screenshot will be saved
  const path = `public/screenshots/${urlObject.hostname.split(".")[0]}.png`;

  // Navigate to the url
  await page.goto(url);

  // Take a screenshot of the page
  await page.screenshot({
    path,
  });

  // Close the browser once done
  await browser.close();

  // Upload the screenshot to cloudinary
  const uploadResponse = await handleCloudinaryUpload({
    path,
    folder: "website-screenshots",
  });

  // Delete the screenshot from the server
  await fs.unlink(path);

  return uploadResponse;
};

export const updateThemeConfig = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const value = formData.get(key) as string;

    try {
      const response = await prisma.themeConfig.update({
        where: {
          siteId: site.id,
        },

        data: {
          [key]: value.length > 0 ? value : null,
        },
      });
      console.log(
        "Updated theme config! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${site.customDomain}-metadata`,
      );
      await revalidateSite(site);
      return response;
    } catch (error: any) {
      console.log("Error updating theme config:", error);
      return {
        error: error.message,
      };
    }
  },
);

export const addHeroImage = async (
  formData: FormData,
  id: string,
  name: string,
) => {
  const file = formData.get(name) as File;

  if (file.size > 0) {
    try {
      const filename = `${nanoid()}.${file.type.split("/")[1]}`;
      const base64 = await file.arrayBuffer();
      const base64String = Buffer.from(base64).toString("base64");

      const res = await handleCloudinaryUpload({
        path: `data:image/png;base64,${base64String}`,
        name: filename,
        folder: "themes/custom-images",
      });

      if (res) {
        const data = new FormData();
        data.append(name, res.secure_url);
        return updateThemeConfig(data, id, name);
      }
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  } else {
    const data = new FormData();
    data.append(name, "");
    return updateThemeConfig(data, id, name);
  }
};
