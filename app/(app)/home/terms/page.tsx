import { MaxWidthWrapper } from "@/components/home/max-width-wrapper";

export default function Privacy() {
  return (
    <MaxWidthWrapper className="py-10">
      <div className="flex min-h-screen flex-col justify-between gap-3.5">
        <h1 className="font-bold">Terms and Conditions for Vtae</h1>
        <div className="font-italic">Last update: January 31, 2024</div>
        <div className="">
          Welcome to Vtae, the resume and portfolio creation platform. By using
          Vtae, you agree to comply with and be bound by the following terms and
          conditions of use. If you do not agree to these terms, please do not
          use Vtae.
        </div>
        <h3 className="text-2xl font-bold">1. Use of Vtae</h3>
        <h4 className="text-xl">1.1 User Account</h4>
        <div className="">
          To use certain features of Vtae, you may be required to create a user
          account. You are responsible for maintaining the confidentiality of
          your account information.
        </div>
        <h4 className="text-xl">1.2 Acceptable Use</h4>
        <div className="">
          You agree to use Vtae in accordance with all applicable laws and
          regulations. Any use of the service for illegal or unauthorized
          purposes is prohibited.
        </div>
        <h3 className="text-2xl font-bold">2. User Content</h3>
        <h4 className="text-xl">2.1 Ownership</h4>
        <div className="">
          You retain ownership of the content you create on Vtae. By using the
          service, you grant Vtae a non-exclusive, worldwide, royalty-free
          license to use, reproduce, and display your content.
        </div>
        <h4 className="text-xl">2.2 Prohibited Content</h4>
        <div className="">
          You agree not to create, upload, or share content that is offensive,
          violates the rights of others, or is in violation of any laws.
        </div>
        <h3 className="text-2xl font-bold">3. Privacy</h3>
        <h4 className="text-xl">3.1 Data collection</h4>
        <div className="">
          Your use of Vtae is subject to our Privacy Policy. By using the
          service, you consent to the collection and use of your information as
          described in the Privacy Policy.
        </div>
        <h3 className="text-2xl font-bold">4. Termination</h3>
        <h4 className="text-xl">4.1 Termination by User</h4>
        <div className="">
          You may terminate your account at any time by following the
          instructions on Vtae. All provisions of these terms that by their
          nature should survive termination shall survive termination.
        </div>
        <h4 className="text-xl">4.2 Termination by Vtae</h4>
        <div className="">
          Vtae reserves the right to terminate or suspend your account at any
          time, without prior notice, for any reason.
        </div>
        <h3 className="text-2xl font-bold">
          5. Changes to Terms and Conditions
        </h3>
        <div className="">
          We may update these terms and conditions from time to time. The
          updated version will be effective as of the date of posting. Please
          check this page regularly for updates.
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
