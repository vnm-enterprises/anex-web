import { NextResponse } from "next/server";
import { sendJobApplicationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const fullName = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const jobTitle = formData.get("job_title") as string;
    const message = formData.get("message") as string;
    const cvFile = formData.get("cv") as File | null;

    if (!fullName || !email || !phone || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let attachment: { filename: string; content: Buffer } | undefined;

    if (cvFile) {
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      attachment = {
        filename: cvFile.name,
        content: buffer,
      };
    }

    const result = await sendJobApplicationEmail({
      fullName,
      email,
      phone,
      jobTitle,
      message,
      attachment,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send application" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Jobs API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
