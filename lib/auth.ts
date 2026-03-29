import db from '@/lib/prisma'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { getOAuthState } from "better-auth/api";
// import { forgotPasswordTemplate } from './templetes/email-templetes';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);



export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'mongodb',
  }),
  emailAndPassword: {
    enabled: true,
    maxPasswordLength: 50,
    sendResetPassword: async ({user, url}) => {
      // Send email using Resend
      const { error } = await resend.emails.send({
        from: 'Wallora <support@walloraarts.com>',
        to: user.email,
        subject: 'Reset Password',
        // html: forgotPasswordTemplate(url),
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>Hello,</p>
            <p>You requested to reset your password for your Wallora account. Click the button below to proceed:</p>
            <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              <p style="font-size: 12px; color: #666;">Demo Image Test:</p>
              <img src="https://via.placeholder.com/150x50?text=Wallora+Arts" alt="Wallora Arts Logo" />
            </div>
          </div>
        `,
        
      });
      if (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send reset password email');
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          if (ctx?.path === "/callback/:id") {
            const state = await getOAuthState();
            return {
              data: {
                ...user,
                role: state?.joinas === 'artist' ? ['USER', 'ARTIST'] : state?.joinas === "collector" ? ['USER', 'COLLECTOR'] : ['USER'],
              },
            };
          } else {
            const url = new URL(ctx?.headers?.get('referer') || '', 'http://localhost');
            const joinas = url.searchParams.get('joinas');
            console.log("CTX Query from auth.ts: ", joinas);
            return {
              data: {
                ...user,
                role: joinas === 'artist' ? ['USER', 'ARTIST'] : joinas === "collector" ? ['USER', 'COLLECTOR'] : ['USER'],
              },
            };
          }
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string[]',
        input: false
      },
      isActive: {
        type: 'boolean',
        input: false,
      },

    }
  },
  rateLimit: {
    enabled: true,
    window: 60, // time window in seconds
    max: 5, // max requests in the window
  },
})