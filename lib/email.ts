export const runtime = "nodejs";
// lib/email.ts
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendPaymentSuccessEmail({
  email,
  customerName,
  amount,
  listingTitle,
  orderId,
}: {
  email: string;
  customerName: string;
  amount: number;
  listingTitle: string;
  orderId: string;
}) {
  if (!resend) {
    console.log("Mock Email Sending (RESEND_API_KEY missing):", {
      to: email,
      subject: "Payment Success - Annex.lk",
      body: `Hello ${customerName}, your payment of LKR ${amount} for "${listingTitle}" was successful. Order ID: ${orderId}`,
    });
    return { success: true, mocked: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Annex.lk <no-reply@annex.lk>", // Replace with your verified domain
      to: [email],
      subject: "Payment Confirmed - Your Listing is Now Pending Review",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #3b82f6;">Payment Successful!</h1>
          <p>Hello <strong>${customerName}</strong>,</p>
          <p>Thank you for choosing Annex.lk. Your payment for the listing "<strong>${listingTitle}</strong>" has been received.</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Order ID: ${orderId}</p>
            <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #111827;">Amount Paid: LKR ${amount.toLocaleString()}</p>
          </div>
          <p>Your listing has been moved to <strong>Pending Review</strong> status. Our team will review and approve it shortly.</p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
            This is an automated email. Please do not reply. For support, contact <a href="mailto:support@annex.lk">support@annex.lk</a>.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email Sending Failed:", err);
    return { success: false, error: err };
  }
}
