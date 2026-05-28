import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token } = (await request.json().catch(() => ({}))) as { token?: string };
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return NextResponse.json({ success: false, message: "Missing reCAPTCHA secret key." }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json({ success: false, message: "Missing reCAPTCHA token." }, { status: 400 });
  }

  const params = new URLSearchParams({
    secret,
    response: token,
  });

  const verifyResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const result = (await verifyResponse.json()) as { success?: boolean; ["error-codes"]?: string[] };

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Captcha verification failed.",
        errors: result["error-codes"] ?? [],
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
