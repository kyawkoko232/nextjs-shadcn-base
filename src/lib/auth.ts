import { prisma } from "@/db";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import VerifyEmail from "@/components/emails/verify-email";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

// Validate email configuration
const emailSenderName = process.env.EMAIL_SENDER_NAME || "Your App";
const emailSenderAddress = process.env.EMAIL_SENDER_ADDRESS;

if (!emailSenderAddress) {
  throw new Error("EMAIL_SENDER_ADDRESS environment variable is required");
}

if (!emailSenderAddress.includes("@")) {
  throw new Error("EMAIL_SENDER_ADDRESS must be a valid email address (e.g., noreply@yourdomain.com)");
}

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails.send({
        from: `${emailSenderName} <${emailSenderAddress}>`,
        to: user.email,
        subject: "Verify your email",
        react: VerifyEmail({ username: user.name, verifyUrl: url }),
      });
    },
    sendOnSignUp: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: `${emailSenderName} <${emailSenderAddress}>`,
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({
          username: user.name,
          resetUrl: url,
          userEmail: user.email,
        }),
      });
    },
    requireEmailVerification: false,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    lastLoginMethod(),
    nextCookies(),
  ],
});
