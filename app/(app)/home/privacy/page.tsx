import { MaxWidthWrapper } from "@/components/home/max-width-wrapper";

export default function Privacy() {
  return (
    <MaxWidthWrapper className="py-10">
      <div className="flex min-h-screen flex-col justify-between gap-3.5">
        <h1 className="font-bold">Vtae Privacy Policy</h1>
        <div className="font-italic">Last update: January 31, 2024</div>
        <div className="">
          Welcome to Vtae, the resume and portfolio creation platform. At Vtae,
          we understand the importance of your privacy. This privacy policy
          explains what information we collect, how we use it, and how we
          protect it.
        </div>
        <h3 className="text-2xl font-bold">1. Information we collect</h3>
        <h4 className="text-xl">1.1 Personal information</h4>
        <div className="">
          When you use Vtae, we may collect personal information such as your
          name, e-mail address, location, and any other information you choose
          to provide.
        </div>
        <h4 className="text-xl">1.2 Analysis data</h4>
        <div className="">
          We also collect analytics data, including referer, location (country
          and city), device type, browser, and operating system, in order to
          improve our service and provide useful features.
        </div>
        <h3 className="text-2xl font-bold">2. How we use your information</h3>
        <h4 className="text-xl">2.1 Provision of services</h4>
        <div className="">
          We use your information to provide you with CV and portfolio creation
          services, as well as to personalize and enhance your experience on
          Vtae.
        </div>
        <h4 className="text-xl">2.2 Communication</h4>
        <div className="">
          We may use your information to send you important information about
          service updates, new features, and other Vtae-related communications.
        </div>
        <h3 className="text-2xl font-bold">3. Protecting your information</h3>
        Your information is valuable, and we take steps to protect it. We use
        security technologies to safeguard your data against unauthorized access
        or misuse.
        <h3 className="text-2xl font-bold">4. Information sharing</h3>
        We do not share your personal information with third parties without
        your consent, except as necessary to provide our services or as required
        by law.
        <h3 className="text-2xl font-bold">5. Changes to the Privacy Policy</h3>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page, so please check back periodically.
      </div>
    </MaxWidthWrapper>
  );
}
