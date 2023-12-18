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
          (e.type = "text/javascript"),
            (e.async = !0),
            (e.src = "https://canny.io/sdk.js"),
            f.parentNode.insertBefore(e, f);
        }
      }
      if ("function" != typeof w.Canny) {
        var c = function () {
          c.q.push(arguments);
        };
        (c.q = []),
          (w.Canny = c),
          "complete" === d.readyState
            ? l()
            : w.attachEvent
              ? w.attachEvent("onload", l)
              : w.addEventListener("load", l, !1);
      }
    })(window, document, "canny-jssdk", "script");
    if (data) {
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
