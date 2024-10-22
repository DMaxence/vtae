import {
  Button,
  Timeline,
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
} from "flowbite-react";
import { ArrowRight } from "lucide-react";

export default function Roadmap() {
  return (
    <div className="overflow-hidden" id="pricing">
      <div className="mx-auto max-w-5xl px-8 py-24">
        <div className="mb-20 flex w-full flex-col text-center">
          <h2 className="mx-auto mb-8 max-w-xl font-display text-4xl font-extrabold leading-tight tracking-tight text-black dark:text-white sm:text-5xl sm:leading-tight lg:text-5xl ">
            What&apos;s{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              next
            </span>
            ?
          </h2>
          <div className="text-base-content-secondary mx-auto max-w-md">
            A lot of exciting features are coming up. Here&apos;s a sneak peek
          </div>
        </div>
        <Timeline>
          <TimelineItem>
            <TimelinePoint
              theme={{
                marker: {
                  base: {
                    vertical:
                      "absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-green-200 dark:border-green-900 dark:bg-green-700",
                  },
                },
              }}
            />
            <TimelineContent>
              <TimelineTime>October 2024</TimelineTime>
              <TimelineTitle>Portfolios</TimelineTitle>
              <TimelineBody>
                Gives the ability to choose between a hosted resume or a
                portfolio website.
              </TimelineBody>
              {/* <Button color="gray">
                Learn More
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button> */}
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelinePoint />
            <TimelineContent>
              <TimelineTime>January 2025</TimelineTime>
              <TimelineTitle>Custom themes</TimelineTitle>
              <TimelineBody>
                Adding a lot more themes and the ability to customize them.
              </TimelineBody>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelinePoint />
            <TimelineContent>
              <TimelineTime>March 2025</TimelineTime>
              <TimelineTitle>Enterprise-scale</TimelineTitle>
              <TimelineBody>
                Give enterprises custom theme and platform so they can manage
                all their employees&apos; portfolios.
              </TimelineBody>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            {/* <TimelinePoint /> */}
            <TimelineContent>
              <TimelineTime>Soon...</TimelineTime>
              <TimelineTitle>A lot more is planned</TimelineTitle>
              <TimelineBody>
                We have a lot more planned for the future. Stay tuned for more
                updates.
              </TimelineBody>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  );
}
