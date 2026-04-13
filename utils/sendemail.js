const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendBookingConfirmation = async (userEmail, userName, bookingDetails) => {
  try {
    await resend.emails.send({
      from: "Smart Parking <onboarding@resend.dev>",
      to: userEmail,
      subject: "Booking Confirmation - Smart Parking System",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #1a1a2e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">🅿 Smart Parking</h1>
          <p style="color: #a0a0b0; margin: 5px 0 0;">Booking Confirmation</p>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;">
          <p style="color: #333; font-size: 15px;">Dear <b>${userName}</b>,</p>
          <p style="color: #555; font-size: 14px; line-height: 1.6;">Your parking slot has been successfully booked. Please find your booking details below.</p>
          <div style="background-color: #f4f6fb; border-left: 4px solid #1a1a2e; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #1a1a2e; margin: 0 0 15px; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888; width: 40%;">Parking Slot</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.slot}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888;">Date</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888;">Time</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.fromTime}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888;">Vehicle Number</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.vehicleNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px 5px; color: #888;">Amount Paid</td>
                <td style="padding: 10px 5px; color: #2e7d32; font-weight: bold; font-size: 16px;">${bookingDetails.amount}</td>
              </tr>
            </table>
          </div>
          <p style="color: #333; font-size: 14px; margin-top: 25px;">Warm regards,<br/><b>Smart Parking Support Team</b></p>
        </div>
        <div style="background-color: #1a1a2e; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #a0a0b0; font-size: 12px; margin: 0;">© 2026 Smart Parking System. All rights reserved.</p>
        </div>
      </div>`,
    });
    console.log("✅ Booking email sent to:", userEmail);
  } catch (error) {
    console.log("❌ Booking email error:", error.message);
  }
};

const sendThankYouEmail = async (userEmail, userName, bookingDetails) => {
  try {
    await resend.emails.send({
      from: "Smart Parking <onboarding@resend.dev>",
      to: userEmail,
      subject: "Thank You for Visiting - Smart Parking System",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #1a1a2e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🅿 Smart Parking</h1>
          <p style="color: #a0a0b0; margin: 5px 0 0;">Visit Complete</p>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;">
          <h2 style="color: #1a1a2e;">Thank You, ${userName}! 🎉</h2>
          <p style="color: #555; font-size: 14px; line-height: 1.6;">Your parking session has ended. We hope you had a great experience!</p>
          <div style="background-color: #f4f6fb; border-left: 4px solid #f97316; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #1a1a2e; margin: 0 0 15px;">Session Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888;">Slot</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.slot}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888;">Date</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888;">From</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.fromTime}</td>
              </tr>
              <tr>
                <td style="padding: 10px 5px; color: #888;">To</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.toTime}</td>
              </tr>
            </table>
          </div>
          <p style="color: #333; font-size: 14px; margin-top: 25px;">Warm regards,<br/><b>Smart Parking Support Team</b></p>
        </div>
        <div style="background-color: #1a1a2e; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #a0a0b0; font-size: 12px; margin: 0;">© 2026 Smart Parking System. All rights reserved.</p>
        </div>
      </div>`,
    });
    console.log("✅ ThankYou email sent to:", userEmail);
  } catch (error) {
    console.log("❌ ThankYou email error:", error.message);
  }
};

const sendCancellationEmail = async (userEmail, userName, bookingDetails) => {
  try {
    await resend.emails.send({
      from: "Smart Parking <onboarding@resend.dev>",
      to: userEmail,
      subject: "Booking Cancelled - Smart Parking System",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #1a1a2e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🅿 Smart Parking</h1>
          <p style="color: #a0a0b0; margin: 5px 0 0;">Booking Cancelled</p>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;">
          <p style="color: #333; font-size: 15px;">Dear <b>${userName}</b>,</p>
          <p style="color: #555; font-size: 14px; line-height: 1.6;">Your booking has been successfully cancelled.</p>
          <div style="background-color: #fff5f5; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #ef4444; margin: 0 0 15px; font-size: 15px;">Cancelled Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888; width: 40%;">Parking Slot</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.slot}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888;">Date</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888;">Time</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.fromTime} - ${bookingDetails.toTime}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px 5px; color: #888;">Vehicle Number</td>
                <td style="padding: 10px 5px; color: #333; font-weight: bold;">${bookingDetails.vehicleNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px 5px; color: #888;">Amount</td>
                <td style="padding: 10px 5px; color: #ef4444; font-weight: bold; font-size: 16px;">${bookingDetails.amount}</td>
              </tr>
            </table>
          </div>
          <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 15px; margin: 15px 0; border-radius: 4px;">
            <p style="color: #854d0e; font-size: 13px; margin: 0;">⚠️ <b>Refund Notice:</b> This is a demo platform. No actual payment will be refunded.</p>
          </div>
          <p style="color: #333; font-size: 14px; margin-top: 25px;">Warm regards,<br/><b>Smart Parking Support Team</b></p>
        </div>
        <div style="background-color: #1a1a2e; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #a0a0b0; font-size: 12px; margin: 0;">© 2026 Smart Parking System. All rights reserved.</p>
        </div>
      </div>`,
    });
    console.log("✅ Cancellation email sent to:", userEmail);
  } catch (error) {
    console.log("❌ Cancellation email error:", error.message);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendThankYouEmail,
  sendCancellationEmail,
};