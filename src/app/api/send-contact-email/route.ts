import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address' },
                { status: 400 }
            );
        }

        // HTML email template
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                🤝 New Connection Request
                            </h1>
                            <p style="margin: 10px 0 0; color: #e6e6ff; font-size: 16px;">
                                Someone wants to connect with you
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                Hello,
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                                You have received a new connection request from a visitor on your website.
                            </p>
                            
                            <!-- Email Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9ff; border-left: 4px solid #667eea; border-radius: 6px; margin: 0 0 30px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <p style="margin: 0 0 10px; color: #667eea; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Contact Email
                                        </p>
                                        <p style="margin: 0; color: #333333; font-size: 20px; font-weight: 600;">
                                            ${email}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Call to Action -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 20px;">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="mailto:${email}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                                            Reply to ${email}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;">
                                This visitor is interested in connecting with you and learning more about your services.
                            </p>
                            
                            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                We recommend reaching out within 24 hours for the best response rate.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px; color: #999999; font-size: 14px;">
                                This email was sent from your website contact form
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                ${new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Footer Note -->
                <table role="presentation" style="width: 600px; border-collapse: collapse; margin-top: 20px;">
                    <tr>
                        <td align="center" style="padding: 0 20px;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                You're receiving this because you own this website. 
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        // Plain text version
        const textContent = `
New Connection Request

You have received a new connection request from a visitor on your website.

Contact Email: ${email}

This visitor is interested in connecting with you and learning more about your services.
We recommend reaching out within 24 hours for the best response rate.

---
This email was sent from your website contact form
${new Date().toLocaleString()}
        `;

        // Here you would integrate with your email service (e.g., SendGrid, AWS SES, Nodemailer, etc.)
        // For now, we'll return success and log the email
        console.log('Email to be sent to: abc@gmail.com');
        console.log('From:', "Abc@gmail.com");
        console.log('HTML:', htmlContent);
        console.log('Text:', textContent);

        // TODO: Implement actual email sending here
        // Example with Nodemailer:
        /*
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'abc@gmail.com',
            subject: `New Connection Request from ${email}`,
            text: textContent,
            html: htmlContent
        });
        */

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send email' },
            { status: 500 }
        );
    }
}
