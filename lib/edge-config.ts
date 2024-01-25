import { getDomainWithoutWWW } from "@/utils";
import { EdgeConfigValue, get } from "@vercel/edge-config";

export const isBlacklistedDomain = async (domain: string) => {
  let blacklistedDomains, blacklistedTerms;
  try {
    [blacklistedDomains, blacklistedTerms] = await Promise.all([
      get("domains"),
      get("terms"),
    ]);
  } catch (e) {
    blacklistedDomains = [];
    blacklistedTerms = [];
  }
  const domainToTest = getDomainWithoutWWW(domain) || domain;
  return (
    // @ts-expect-error
    blacklistedDomains.includes(domainToTest) ||
    // @ts-expect-error
    new RegExp(blacklistedTerms.join("|")).test(domainToTest)
  );
};

export const isBlacklistedReferrer = async (referrer: string | null) => {
  const hostname = referrer ? getDomainWithoutWWW(referrer) : "(direct)";
  let referrers;
  try {
    referrers = await get("referrers");
  } catch (e) {
    referrers = [];
  }
  // @ts-expect-error
  return !referrers.includes(hostname);
};

export const isBlacklistedKey = async (key: string) => {
  let blacklistedKeys;
  try {
    blacklistedKeys = await get("keys");
  } catch (e) {
    blacklistedKeys = [];
  }
  // @ts-expect-error
  return new RegExp(blacklistedKeys.join("|"), "i").test(key);
};

export const isWhitelistedEmail = async (email: string) => {
  let whitelistedEmails;
  try {
    whitelistedEmails = await get("whitelist");
  } catch (e) {
    whitelistedEmails = [];
  }
  // @ts-expect-error
  return whitelistedEmails.includes(email);
};

export const isBlacklistedEmail = async (email: string) => {
  if (!process.env.NEXT_PUBLIC_IS_DUB) {
    return false;
  }
  let blacklistedEmails;
  try {
    blacklistedEmails = await get("emails");
  } catch (e) {
    blacklistedEmails = [];
  }
  // @ts-expect-error
  return new RegExp(blacklistedEmails.join("|"), "i").test(email);
};

export const isReservedKey = async (key: string) => {
  if (!process.env.NEXT_PUBLIC_IS_DUB) {
    return false;
  }
  let reservedKeys;
  try {
    reservedKeys = await get("reserved");
  } catch (e) {
    reservedKeys = [];
  }
  // @ts-expect-error
  return reservedKeys.includes(key);
};

export const isReservedUsername = async (key: string) => {
  if (!process.env.NEXT_PUBLIC_IS_DUB) {
    return false;
  }
  let reservedUsernames;
  try {
    reservedUsernames = await get("reservedUsernames");
  } catch (e) {
    reservedUsernames = [];
  }
  // @ts-expect-error
  return reservedUsernames.includes(key);
};
