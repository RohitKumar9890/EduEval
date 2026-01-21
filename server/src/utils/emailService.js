import nodemailer from 'nodemailer';

// Create transporter
let transporter = null;

const initializeTransporter = () => {
  if (transporter) return transporter;

  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn('⚠️  Email service not configured. Set SMTP_* environment variables to enable email notifications.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log('✓ Email service initialized');
  return transporter;
};

// Email templates
const emailTemplates = {
  examPublished: (data) => ({
    subject: `📝 New Exam Published: ${data.examTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #3B82F6; color: white; padding: 20px; text-align: center;">
          <h1>📝 New Exam Available</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <h2>Hello ${data.studentName},</h2>
          <p>A new exam has been published in your course:</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3B82F6; margin-top: 0;">${data.examTitle}</h3>
            <p><strong>Subject:</strong> ${data.subjectName}</p>
            <p><strong>Duration:</strong> ${data.durationMinutes} minutes</p>
            <p><strong>Total Marks:</strong> ${data.totalMarks}</p>
            ${data.startsAt ? `<p><strong>Starts:</strong> ${new Date(data.startsAt).toLocaleString()}</p>` : ''}
            ${data.endsAt ? `<p><strong>Ends:</strong> ${new Date(data.endsAt).toLocaleString()}</p>` : ''}
            <p><strong>Exam Code:</strong> <span style="font-size: 24px; color: #3B82F6; font-weight: bold;">${data.examCode}</span></p>
          </div>
          
          <p>Use the exam code to join and take the exam.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.examUrl}" style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Exam
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px;">Good luck!</p>
        </div>
        <div style="background-color: #1F2937; color: #9CA3AF; padding: 15px; text-align: center; font-size: 12px;">
          <p>EduEval - Educational Evaluation Platform</p>
        </div>
      </div>
    `,
    text: `
New Exam Published: ${data.examTitle}

Hello ${data.studentName},

A new exam has been published:
- Subject: ${data.subjectName}
- Duration: ${data.durationMinutes} minutes
- Total Marks: ${data.totalMarks}
- Exam Code: ${data.examCode}

${data.startsAt ? `Starts: ${new Date(data.startsAt).toLocaleString()}` : ''}
${data.endsAt ? `Ends: ${new Date(data.endsAt).toLocaleString()}` : ''}

Visit ${data.examUrl} to take the exam.

Good luck!
    `,
  }),

  submissionGraded: (data) => ({
    subject: `✅ Your Exam Has Been Graded: ${data.examTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10B981; color: white; padding: 20px; text-align: center;">
          <h1>✅ Exam Graded</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <h2>Hello ${data.studentName},</h2>
          <p>Your exam submission has been graded!</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #10B981; margin-top: 0;">${data.examTitle}</h3>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-size: 48px; color: #10B981; font-weight: bold;">
                ${data.score}/${data.maxScore}
              </div>
              <div style="font-size: 24px; color: #6B7280;">
                ${data.percentage}%
              </div>
            </div>
            
            ${data.feedback ? `
              <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <strong style="color: #374151;">Feedback from instructor:</strong>
                <p style="margin: 10px 0 0 0; color: #4B5563;">${data.feedback}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.submissionUrl}" style="background-color: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Detailed Results
            </a>
          </div>
        </div>
        <div style="background-color: #1F2937; color: #9CA3AF; padding: 15px; text-align: center; font-size: 12px;">
          <p>EduEval - Educational Evaluation Platform</p>
        </div>
      </div>
    `,
    text: `
Your Exam Has Been Graded: ${data.examTitle}

Hello ${data.studentName},

Your exam submission has been graded!

Score: ${data.score}/${data.maxScore} (${data.percentage}%)

${data.feedback ? `Feedback: ${data.feedback}` : ''}

Visit ${data.submissionUrl} to view detailed results.
    `,
  }),

  welcomeEmail: (data) => ({
    subject: 'Welcome to EduEval! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #3B82F6; color: white; padding: 20px; text-align: center;">
          <h1>🎉 Welcome to EduEval!</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <h2>Hello ${data.name},</h2>
          <p>Your account has been created successfully!</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3B82F6; margin-top: 0;">Account Details</h3>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Role:</strong> ${data.role.toUpperCase()}</p>
            ${data.temporaryPassword ? `<p><strong>Temporary Password:</strong> <code style="background-color: #F3F4F6; padding: 4px 8px; border-radius: 4px;">${data.temporaryPassword}</code></p>` : ''}
          </div>
          
          ${data.temporaryPassword ? `
            <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
              <strong style="color: #92400E;">⚠️ Security Notice:</strong>
              <p style="margin: 5px 0 0 0; color: #92400E;">Please change your password after your first login for security.</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Login Now
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px;">If you have any questions, please contact your administrator.</p>
        </div>
        <div style="background-color: #1F2937; color: #9CA3AF; padding: 15px; text-align: center; font-size: 12px;">
          <p>EduEval - Educational Evaluation Platform</p>
        </div>
      </div>
    `,
    text: `
Welcome to EduEval!

Hello ${data.name},

Your account has been created successfully!

Email: ${data.email}
Role: ${data.role.toUpperCase()}
${data.temporaryPassword ? `Temporary Password: ${data.temporaryPassword}` : ''}

${data.temporaryPassword ? 'Please change your password after your first login for security.' : ''}

Visit ${data.loginUrl} to login.
    `,
  }),

  passwordReset: (data) => ({
    subject: '🔐 Password Reset Request - EduEval',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #EF4444; color: white; padding: 20px; text-align: center;">
          <h1>🔐 Password Reset</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <h2>Hello ${data.name},</h2>
          <p>We received a request to reset your password.</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p>Click the button below to reset your password:</p>
            <div style="margin: 30px 0;">
              <a href="${data.resetUrl}" style="background-color: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #6B7280; font-size: 14px;">This link will expire in 1 hour.</p>
          </div>
          
          <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
            <strong style="color: #92400E;">⚠️ Security Notice:</strong>
            <p style="margin: 5px 0 0 0; color: #92400E;">If you didn't request this password reset, please ignore this email.</p>
          </div>
        </div>
        <div style="background-color: #1F2937; color: #9CA3AF; padding: 15px; text-align: center; font-size: 12px;">
          <p>EduEval - Educational Evaluation Platform</p>
        </div>
      </div>
    `,
    text: `
Password Reset Request

Hello ${data.name},

We received a request to reset your password.

Click this link to reset your password: ${data.resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.
    `,
  }),

  announcementNotification: (data) => ({
    subject: `📢 ${data.priority === 'high' ? '[URGENT] ' : ''}New Announcement: ${data.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${data.priority === 'high' ? '#EF4444' : '#3B82F6'}; color: white; padding: 20px; text-align: center;">
          <h1>📢 New Announcement</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <h2>Hello ${data.studentName},</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 style="color: #3B82F6; margin: 0;">${data.title}</h3>
              <span style="background-color: ${data.priority === 'high' ? '#FEE2E2' : data.priority === 'normal' ? '#DBEAFE' : '#F3F4F6'}; 
                           color: ${data.priority === 'high' ? '#991B1B' : data.priority === 'normal' ? '#1E40AF' : '#374151'}; 
                           padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                ${data.priority.toUpperCase()}
              </span>
            </div>
            <p style="color: #6B7280; font-size: 14px; margin-bottom: 15px;">
              <strong>Subject:</strong> ${data.subjectName}
            </p>
            <div style="border-top: 1px solid #E5E7EB; padding-top: 15px;">
              ${data.content}
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.announcementUrl}" style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View All Announcements
            </a>
          </div>
        </div>
        <div style="background-color: #1F2937; color: #9CA3AF; padding: 15px; text-align: center; font-size: 12px;">
          <p>EduEval - Educational Evaluation Platform</p>
        </div>
      </div>
    `,
    text: `
${data.priority === 'high' ? '[URGENT] ' : ''}New Announcement: ${data.title}

Hello ${data.studentName},

Subject: ${data.subjectName}
Priority: ${data.priority.toUpperCase()}

${data.content}

Visit ${data.announcementUrl} to view all announcements.
    `,
  }),
};

// Send email function
export const sendEmail = async (to, templateName, data) => {
  try {
    const emailTransporter = initializeTransporter();
    
    if (!emailTransporter) {
      console.log(`📧 Email would be sent to ${to}: ${templateName}`);
      return { success: false, message: 'Email service not configured' };
    }

    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const emailContent = template(data);
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'EduEval'}" <${process.env.SMTP_USER}>`,
      to,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`✓ Email sent to ${to}: ${emailContent.subject} (${info.messageId})`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`✗ Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Bulk email function
export const sendBulkEmail = async (recipients, templateName, dataGenerator) => {
  const results = [];
  
  for (const recipient of recipients) {
    const data = dataGenerator(recipient);
    const result = await sendEmail(recipient.email, templateName, data);
    results.push({ email: recipient.email, ...result });
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};

export default {
  sendEmail,
  sendBulkEmail,
  emailTemplates,
};
