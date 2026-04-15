import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

/**
 * Send contact form notification to admin
 * @param {Object} contactData - Contact form data
 */
export const sendContactNotification = async (contactData) => {
    const transporter = createTransporter();

    const { fullName, email, phone, serviceInterest, message } = contactData;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; margin-top: 5px; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${fullName}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value"><a href="tel:${phone}">${phone}</a></div>
          </div>
          <div class="field">
            <div class="label">Service Interested In:</div>
            <div class="value">${serviceInterest}</div>
          </div>
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${message}</div>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from 89T Corporate Advisors website.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form Submission - ${serviceInterest}`,
        html: htmlContent,
        text: `
New Contact Form Submission

Name: ${fullName}
Email: ${email}
Phone: ${phone}
Service: ${serviceInterest}
Message: ${message}
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
};

/**
 * Send welcome email to new admin (optional)
 * @param {Object} userData - User data
 */
export const sendWelcomeEmail = async (userData) => {
    const transporter = createTransporter();

    const { name, email } = userData;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to 89T Corporate Advisors Admin Panel</h2>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Your admin account has been created successfully. You can now access the admin panel to manage the website content.</p>
          <p>If you have any questions, please contact the super administrator.</p>
        </div>
        <div class="footer">
          <p>© 2026 89T Corporate Advisors Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Welcome to 89T Corporate Advisors Admin Panel',
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        // Don't throw error for welcome email - it's not critical
        return null;
    }
};

// Send invitation email to new admin
export const sendInvitationEmail = async (to, name, setupUrl) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to,
        subject: 'Admin Invitation - 89T Corporate Advisors',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2C4A6B;">Welcome to 89T Corporate Advisors Admin Panel</h2>
                <p>Hi ${name},</p>
                <p>You have been invited to join the 89T Corporate Advisors admin team.</p>
                <p>Please click the button below to set up your password and activate your account:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${setupUrl}" 
                       style="background-color: #2C4A6B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Set Up Password
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    This invitation link will expire in 7 days.<br>
                    If you didn't expect this invitation, please ignore this email.
                </p>
                <p style="color: #666; font-size: 14px;">
                    Or copy and paste this link in your browser:<br>
                    <a href="${setupUrl}" style="color: #2C4A6B;">${setupUrl}</a>
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} 89T Corporate Advisors. All rights reserved.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Invitation email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending invitation email:', error);
        throw error;
    }
};

// Send auto-reply to user
export const sendAutoReply = async (contactData) => {
    const transporter = createTransporter();
    const { fullName, email, serviceInterest } = contactData;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #EA580C; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Contacting Us</h2>
        </div>
        <div class="content">
          <p>Dear ${fullName},</p>
          <p>Thank you for reaching out to 89T Corporate Advisors regarding <strong>${serviceInterest}</strong>.</p>
          <p>We have received your inquiry and our team will get back to you shortly.</p>
          <p>If you have any urgent queries, please feel free to call us directly.</p>
          <br>
          <p>Best Regards,</p>
          <p><strong>89tcapl Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} 89T Corporate Advisors Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: `We received your inquiry regarding ${serviceInterest} - 89T Corporate Advisors`,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Auto-reply sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending auto-reply:', error);
        // Don't throw error as this is a secondary action
        return null;
    }
};

// Send OTP email
export const sendOTPEmail = async (to, otp) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to,
        subject: 'Password Reset OTP - 89T Corporate Advisors',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2C4A6B;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="background-color: #f4f4f4; padding: 10px 20px; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 5px; color: #333;">
                        ${otp}
                    </span>
                </div>
                <p style="color: #666; font-size: 14px;">
                    This OTP is valid for 10 minutes.<br>
                    If you didn't request this, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} 89T Corporate Advisors. All rights reserved.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error sending OTP email:', error);
        throw error;
    }
};

export default { sendContactNotification, sendWelcomeEmail, sendInvitationEmail, sendAutoReply, sendOTPEmail };
