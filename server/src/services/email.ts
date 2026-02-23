/**
 * Email delivery service (Resend pattern stub)
 * Replace with actual Resend SDK in production:
 *   import { Resend } from 'resend';
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface InviteEmailData {
  guestName: string;
  guestEmail: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  inviteUrl: string;
}

interface DeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Stub: logs email instead of sending
export async function sendEmail(options: EmailOptions): Promise<DeliveryResult> {
  const { to, subject, html, from = 'Invite Me NFT <noreply@invitemenft.com>' } = options;

  console.log(`📧 [EMAIL STUB] Sending to: ${to}`);
  console.log(`   From: ${from}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Body length: ${html.length} chars`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // In production, replace with:
  // const { data, error } = await resend.emails.send({ from, to, subject, html });

  return {
    success: true,
    messageId: `stub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };
}

export async function sendInviteEmail(data: InviteEmailData): Promise<DeliveryResult> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: 'Inter', sans-serif; background: #0A0A0A; color: #F5F5F5; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #141414; border-radius: 12px; border: 1px solid rgba(14,165,233,0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, rgba(14,165,233,0.2), rgba(14,165,233,0.05)); padding: 40px; text-align: center;">
          <h1 style="font-size: 28px; margin: 0 0 8px;">You're Invited! 🎉</h1>
          <p style="color: #94a3b8; margin: 0;">A special invitation from</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0EA5E9; font-size: 24px; margin: 0 0 16px;">${data.eventName}</h2>
          <p style="color: #94a3b8;">Hi ${data.guestName},</p>
          <p style="color: #94a3b8;">You've received an exclusive NFT invitation!</p>
          <div style="background: #1a1a1a; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0; color: #e2e8f0;">📅 ${data.eventDate}</p>
            <p style="margin: 4px 0; color: #e2e8f0;">📍 ${data.eventLocation}</p>
          </div>
          <a href="${data.inviteUrl}" style="display: inline-block; background: #0EA5E9; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
            View Your Invitation & RSVP
          </a>
        </div>
        <div style="padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">Powered by Invite Me NFT · Built on Base</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.guestEmail,
    subject: `You're invited to ${data.eventName}!`,
    html,
  });
}

export async function sendBatchInviteEmails(
  invites: InviteEmailData[]
): Promise<{ sent: number; failed: number; results: DeliveryResult[] }> {
  const results: DeliveryResult[] = [];
  let sent = 0;
  let failed = 0;

  for (const invite of invites) {
    const result = await sendInviteEmail(invite);
    results.push(result);
    if (result.success) sent++;
    else failed++;
  }

  console.log(`📧 [EMAIL BATCH] Sent: ${sent}, Failed: ${failed}`);
  return { sent, failed, results };
}
