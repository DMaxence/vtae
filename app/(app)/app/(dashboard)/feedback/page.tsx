"use client";
import LoadingSpinner from "@/components/icons/loading-spinner";
import { fetcher } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import useSWR from "swr";

export default function Feedback() {
  const { data } = useSWR<{ ssoToken: string }>("/api/canny/sso", fetcher);
  const { theme } = useTheme();

  useEffect(() => {
    (function (w, d, i, s) {
      function l() {
        if (!d.getElementById(i)) {
          var f = d.getElementsByTagName(s)[0],
            e = d.createElement(s);
          ((e as HTMLScriptElement).type = "text/javascript"),
            ((e as HTMLScriptElement).async = !0),
            ((e as HTMLScriptElement).src = "https://canny.io/sdk.js"),
            f?.parentNode?.insertBefore(e, f);
        }
      }
      // @ts-expect-error
      if ("function" != typeof w.Canny) {
        var c = function () {
          // @ts-expect-error
          c.q.push(arguments);
        };
        // @ts-expect-error
        (c.q = []),
          // @ts-expect-error
          (w.Canny = c),
          "complete" === d.readyState
            ? l()
            : // @ts-expect-error
              w.attachEvent
              ? // @ts-expect-error
                w.attachEvent("onload", l)
              : w.addEventListener("load", l, !1);
      }
    })(window, document, "canny-jssdk", "script");
    if (data) {
      // @ts-expect-error
      Canny("render", {
        boardToken: process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN,
        basePath: null, // See step 2
        ssoToken: data.ssoToken, // See step 3
        theme: theme === "dark" ? "dark" : "light",
      });
    }
  }, [data, theme]);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Feature Requests
          </h1>
        </div>

        {!data ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div data-canny />
        )}
      </div>
    </div>
  );
}
