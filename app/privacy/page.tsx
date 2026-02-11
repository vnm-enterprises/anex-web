import LegalLayout from "@/components/legal/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        Your privacy is important to us. This Privacy Policy explains how
        <strong> annex.lk</strong> collects, uses, and protects your personal
        information.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Account details (name, email, contact number)</li>
        <li>Property listing information</li>
        <li>Usage data such as page visits and interactions</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and improve our services</li>
        <li>To display property listings</li>
        <li>To communicate important updates</li>
        <li>To ensure platform security and prevent abuse</li>
      </ul>

      <h2>3. Data Sharing</h2>
      <p>
        We do not sell or rent your personal data. Information may be shared only
        when required by law or to operate essential platform services.
      </p>

      <h2>4. Cookies</h2>
      <p>
        annex.lk may use cookies to enhance user experience and analyze traffic.
        You can control cookie settings through your browser.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We take reasonable technical and organizational measures to protect your
        data against unauthorized access or loss.
      </p>

      <h2>6. User Rights</h2>
      <p>
        You have the right to access, update, or request deletion of your
        personal information by contacting us.
      </p>

      <h2>7. Third-Party Links</h2>
      <p>
        annex.lk may contain links to third-party websites. We are not
        responsible for their privacy practices.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        This Privacy Policy may be updated periodically. Changes will be posted
        on this page.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        For privacy-related questions, contact us at{" "}
        <a href="mailto:privacy@annex.lk">privacy@annex.lk</a>.
      </p>
    </LegalLayout>
  );
}
