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

export async function sendJobApplicationEmail({
  fullName,
  email,
  phone,
  jobTitle,
  message,
  attachment,
}: {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  message: string;
  attachment?: { filename: string; content: Buffer };
}) {
  if (!resend) {
    console.log("Mock Job Application Email:", { fullName, email, jobTitle });
    return { success: true, mocked: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Annex.lk Careers <no-reply@annex.lk>",
      to: ["annexlk1@gmail.com"],
      subject: `New Job Application: ${jobTitle} - ${fullName}`,
      attachments: attachment ? [attachment] : [],
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6;">New Job Application</h2>
          <p><strong>Position:</strong> ${jobTitle}</p>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Message/Cover Letter:</p>
            <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #6b7280;">CV should be attached to this email.</p>
        </div>
      `,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function sendContactInquiryEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!resend) {
    console.log("Mock Contact Inquiry Email:", { name, email, subject });
    return { success: true, mocked: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Annex.lk Support <no-reply@annex.lk>",
      to: ["annexlk1@gmail.com"],
      subject: `New Contact Inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6;">New Contact Inquiry</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Message:</p>
            <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function sendListingExpirationEmail({
  email,
  customerName,
  listingTitle,
  listingId,
}: {
  email: string;
  customerName: string;
  listingTitle: string;
  listingId: string;
}) {
  if (!resend) {
    console.log("Mock Expiration Email:", { email, listingTitle });
    return { success: true, mocked: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Annex.lk <no-reply@annex.lk>",
      to: [email],
      subject: `Your Listing "${listingTitle}" Has Expired`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f59e0b;">Listing Expired</h2>
          <p>Hello <strong>${customerName}</strong>,</p>
          <p>Your listing "<strong>${listingTitle}</strong>" has expired and is no longer visible to the public.</p>
          <p>You can renew your listing from your dashboard to make it active again.</p>
          <div style="margin: 30px 0;">
            <a href="https://annex.lk/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Dashboard</a>
          </div>
          <p style="font-size: 12px; color: #9ca3af;">Note: Expired listings that are not renewed within 30 days will be permanently deleted.</p>
        </div>
      `,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}
