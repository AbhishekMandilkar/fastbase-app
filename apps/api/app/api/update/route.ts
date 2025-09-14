
import FastbaseUpdateEmail from "@/components/email-update";
import SchemaViewerUpdate from "@/components/schema-update";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma"

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { email, sendToAll } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    if (email) {
      const { data, error } = await resend.emails.send({
        from: "updates@fastbase.in",
        to: [email],
        subject: "New in FastBase: Visual Table Schema Viewer is here 🎉",
        react: FastbaseUpdateEmail()
      });
    } else if (sendToAll) {
      const waitlist = await getWaitlist();
      const { data, error } = await resend.emails.send({
        from: "updates@fastbase.in",
        to: waitlist,
        subject: "New in FastBase: Visual Table Schema Viewer is here 🎉",
        react: FastbaseUpdateEmail()
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}


const getWaitlist = async () => {
  const waitlist = await prisma.waitlist.findMany();
  return waitlist?.map((user) => user.email);
}