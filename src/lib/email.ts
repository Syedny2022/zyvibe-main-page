import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder_key';
export const resend = new Resend(resendApiKey);

interface PaymentConfirmationParams {
  toEmail: string;
  customerName?: string;
  listingName: string;
  listingType: string;
  amountTotal: number;
  currency: string;
  sessionId: string;
}

export async function sendPaymentConfirmationEmail(params: PaymentConfirmationParams) {
  const { toEmail, customerName, listingName, listingType, amountTotal, currency, sessionId } = params;

  // Domain strictly restricted to mail.zyvibe.com for transactional confirmation only
  const fromAddress = 'Zyvibe Confirmations <confirmations@mail.zyvibe.com>';
  const subject = `Payment Confirmed: Your listing "${listingName}" is now active on Zyvibe`;

  const formattedAmount = (amountTotal / 100).toFixed(2);

  const textBody = `
Hello ${customerName || 'there'},

Thank you for promoting your ${listingType} on Zyvibe.

Receipt Details:
- Listing: ${listingName}
- Type: ${listingType}
- Amount Paid: ${formattedAmount} ${currency.toUpperCase()}
- Transaction Reference: ${sessionId}
- Status: Active & Verified

Your listing is now live in the verified index. You can view it directly on https://zyvibe.com.

If you need to make changes to your listing details, simply reply to this email.

Best regards,
The Zyvibe Team
https://zyvibe.com
`.trim();

  // If no live API key is configured (local dev/build), log and return success safely
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('placeholder')) {
    console.log(`[Resend Mocked] Email queued from ${fromAddress} to ${toEmail}: "${subject}"`);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromAddress,
      to: [toEmail],
      subject,
      text: textBody,
    });
    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to dispatch transactional confirmation email via mail.zyvibe.com:', error);
    return { success: false, error: error.message };
  }
}
