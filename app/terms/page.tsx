import LegalLayout from "@/components/legal/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        Welcome to <strong>annex.lk</strong>. By accessing or using our platform,
        you agree to be bound by these Terms of Service. Please read them
        carefully.
      </p>

      <h2>1. About annex.lk</h2>
      <p>
        annex.lk is an online platform that allows property owners and landlords
        in Sri Lanka to list rental properties such as annexes, rooms, and houses,
        and enables renters to discover them.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old to create an account or post listings on
        annex.lk. By using the platform, you confirm that the information you
        provide is accurate and lawful.
      </p>

      <h2>3. Listings & Content</h2>
      <ul>
        <li>You are responsible for the accuracy of your listings.</li>
        <li>
          You must not post misleading, false, or illegal property information.
        </li>
        <li>
          annex.lk reserves the right to review, modify, or remove listings that
          violate our policies.
        </li>
      </ul>

      <h2>4. User Responsibilities</h2>
      <p>
        You agree not to misuse the platform, attempt unauthorized access, or
        interfere with platform functionality.
      </p>

      <h2>5. Payments & Transactions</h2>
      <p>
        annex.lk does not directly participate in rental agreements between
        landlords and tenants. Any financial transactions are strictly between
        the involved parties unless explicitly stated otherwise.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        annex.lk is provided on an “as is” basis. We are not responsible for
        disputes, damages, or losses arising from property rentals or user
        interactions.
      </p>

      <h2>7. Termination</h2>
      <p>
        We reserve the right to suspend or terminate accounts that violate these
        Terms without prior notice.
      </p>

      <h2>8. Changes to Terms</h2>
      <p>
        These Terms may be updated from time to time. Continued use of annex.lk
        indicates acceptance of the updated Terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        If you have questions regarding these Terms, please contact us at{" "}
        <a href="mailto:support@annex.lk">support@annex.lk</a>.
      </p>
    </LegalLayout>
  );
}
