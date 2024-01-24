import { compare, hash } from "bcryptjs";

import { getServerSession, type NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { LogSnag } from "@logsnag/next/server";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

const logsnag = new LogSnag({
  token: process.env.LOGSNAG_TOKEN as string,
  project: process.env.LOGSNAG_PROJECT as string,
});

export interface Session {
  user: {
    id: string;
    name: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    image: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          firstname: profile.firstname || profile.name || profile.login,
          lastname: profile.lastname || "",
          gh_username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    LinkedInProvider({
      clientId: process.env.AUTH_LINKEDIN_ID as string,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET as string,
      issuer: "https://www.linkedin.com",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      authorization: {
        params: {
          scope: "profile email openid",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          image: profile.picture || profile.image || profile.profilePicture,
          locale: profile.locale,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      profile(profile) {
        console.log("Google profile", profile);
        return {
          id: profile.id,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          image: profile.picture || profile.image || profile.profilePicture,
          locale: profile.locale,
        };
      },
    }),
    CredentialsProvider({
      id: "app-login",
      name: "App Login",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "Email Address",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async (credentials) => {
        try {
          let user = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              firstname: true,
              lastname: true,
              image: true,
            },
          });

          if (!user) {
            if (!credentials?.password || !credentials?.email) {
              throw new Error("Invalid Credentials");
            }

            throw new Error("The combo email/password is not correct");
          } else {
            if (!credentials?.password || !user.password) {
              throw new Error("Invalid Credentials");
            }
            const isValid = await verifyPassword(
              credentials?.password,
              user.password,
            );

            if (!isValid) {
              throw new Error("Invalid Credentials");
            }
          }
          return {
            id: user.id,
            name: user.name,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
    CredentialsProvider({
      id: "app-register",
      name: "App Register",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "Email Address",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
        firstname: {
          label: "First name",
          type: "text",
          placeholder: "First name",
        },
        lastname: {
          label: "Last name",
          type: "text",
          placeholder: "Last name",
        },
        locale: {
          type: "hidden",
        },
      },
      authorize: async (credentials) => {
        try {
          let maybeUser = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              firstname: true,
              lastname: true,
              image: true,
            },
          });

          if (!maybeUser) {
            if (!credentials?.password || !credentials?.email) {
              throw new Error("Invalid Credentials");
            }

            maybeUser = await prisma.user.create({
              data: {
                email: credentials?.email,
                password: await hashPassword(credentials?.password),
                name: `${credentials?.firstname} ${credentials?.lastname}`,
                firstname: credentials?.firstname,
                lastname: credentials?.lastname,
                locale: credentials?.locale,
              },
              select: {
                id: true,
                email: true,
                password: true,
                name: true,
                firstname: true,
                lastname: true,
                image: true,
              },
            });
          } else {
            if (!credentials?.password || !maybeUser.password) {
              throw new Error("This email is already taken");
            }
          }

          return {
            id: maybeUser.id,
            name: maybeUser.name,
            firstname: maybeUser.firstname,
            lastname: maybeUser.lastname,
            email: maybeUser.email,
            image: maybeUser.image,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
        // @ts-expect-error
        id: token.sub,
        // @ts-expect-error
        firstname: token?.user?.firstname,
        // @ts-expect-error
        lastname: token?.user?.lastname,
        // @ts-expect-error
        username: token?.user?.username || token?.user?.gh_username,
      };
      return session;
    },
    // signIn: async ({ user, account, profile, email, credentials }) => {
    //   console.log(
    //     "Signin callback",
    //     user,
    //     account,
    //     profile,
    //     email,
    //     credentials,
    //   );
    //   return true;
    // },
  },
  events: {
    // createUser: async ({ user }) => {
    //   await logsnag.track({
    //     channel: "users",
    //     event: "User Registered",
    //     user_id: user.id,
    //     icon: "👨",
    //     notify: true,
    //     tags: {
    //       name: user.name?.toString() || "",
    //       email: user.email?.toString() || "",
    //     },
    //   });
    // },
    signIn: async ({ user, account, isNewUser }) => {
      const emailSplited = (user.email || "").split("@");
      let email = "";
      if (emailSplited.length !== 2) email = "error@error.com";
      const domain = emailSplited[1];
      const domainSplited = domain.split(".");
      email =
        domainSplited.length > 2
          ? `${emailSplited[0]}@${domainSplited.slice(-2).join(".")}`
          : user.email || "";
      if (isNewUser) {
        await logsnag.track({
          channel: "users",
          event: "User Registered",
          user_id: user.id,
          icon: "👨",
          notify: true,
          tags: {
            name: user.name || "",
            email: email,
            provider: account?.provider || "password",
            // @ts-expect-error
            locale: user?.locale || "",
          },
        });
      }
      await logsnag.identify({
        user_id: user.id,
        properties: {
          name: user.name || "",
          // @ts-expect-error
          firstname: user?.firstname || "",
          // @ts-expect-error
          lastname: user?.lastname || "",
          email: email,
          provider: account?.provider || "password",
          // @ts-expect-error
          locale: user?.locale || "",
        },
      });
    },
  },
};

export function getSession() {
  return getServerSession(authOptions) as Promise<Session | null>;
}

export function withSiteAuth(action: any) {
  return async (
    data: object | FormData | null,
    siteId: string,
    key?: string | null,
  ) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }
    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });
    if (!site || site.userId !== session.user.id) {
      return {
        error: "Not authorized",
      };
    }

    return action(data, site, key);
  };
}

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        site: true,
      },
    });
    if (!post || post.userId !== session.user.id) {
      return {
        error: "Post not found",
      };
    }

    return action(formData, post, key);
  };
}

export function withAuth(handler: any) {
  return async (
    req: Request,
    { params }: { params: Record<string, string> | undefined },
  ) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }

    return handler({
      req,
      params: params || {},
      session,
    });
  };
}

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
