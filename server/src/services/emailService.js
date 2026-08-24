const axios = require("axios");

const sendEmailViaGoogleScript = async ({
    email,
    otp,
    type = "verification"
}) => {
    const url = process.env.GOOGLE_EMAIL_SERVICE_URL;
    const secret = process.env.GOOGLE_EMAIL_SERVICE_SECRET;

    if (!url || !secret) {
        throw new Error(
            "Google email service environment variables are not configured"
        );
    }

    const payload = {
        secret,
        email,
        otp,
        type
    };

    console.log("Calling Google Email Service...");

    // Apps Script Web App first returns a 302 redirect.
    // We intentionally stop axios from following it automatically.
    const firstResponse = await axios.post(url, payload, {
        timeout: 30000,
        maxRedirects: 0,
        validateStatus: (status) =>
            status >= 200 && status < 400,
        headers: {
            "Content-Type": "application/json"
        }
    });

    console.log(
        "Google Email Service first response:",
        firstResponse.status
    );

    // Apps Script returns the actual response through
    // the Location URL after executing doPost().
    const redirectUrl = firstResponse.headers.location;

    if (
        firstResponse.status >= 300 &&
        firstResponse.status < 400 &&
        redirectUrl
    ) {
        console.log(
            "Following Google Apps Script redirect..."
        );

        // IMPORTANT:
        // The redirect URL must be requested with GET.
        // Do NOT POST the payload again.
        const finalResponse = await axios.get(
            redirectUrl,
            {
                timeout: 30000,
                validateStatus: (status) =>
                    status >= 200 && status < 400
            }
        );

        console.log(
            "Google Email Service final response:",
            finalResponse.status
        );

        let result = finalResponse.data;

        // In some cases the response may arrive as a string.
        if (typeof result === "string") {
            try {
                result = JSON.parse(result);
            } catch (error) {
                throw new Error(
                    "Invalid response from Google Email Service"
                );
            }
        }

        console.log(
            "Google Email Service response body:",
            result
        );

        if (!result?.success) {
            throw new Error(
                result?.message ||
                "Google email service failed"
            );
        }

        return result;
    }

    // If Apps Script ever returns a direct 200 response.
    let result = firstResponse.data;

    if (typeof result === "string") {
        try {
            result = JSON.parse(result);
        } catch (error) {
            throw new Error(
                "Invalid response from Google Email Service"
            );
        }
    }

    if (!result?.success) {
        throw new Error(
            result?.message ||
            "Google email service failed"
        );
    }

    return result;
};


const sendVerificationOTP = async (email, otp) => {
    console.log("OTP:", otp);
    console.log("Sending OTP to:", email);

    await sendEmailViaGoogleScript({
        email,
        otp,
        type: "verification"
    });

    console.log(
        "Verification OTP email sent successfully."
    );
};


const sendPasswordResetOTP = async (email, otp) => {
    console.log("Password reset OTP:", otp);
    console.log("Sending password reset OTP to:", email);

    await sendEmailViaGoogleScript({
        email,
        otp,
        type: "password-reset"
    });

    console.log(
        "Password reset OTP email sent successfully."
    );
};


module.exports = {
    sendVerificationOTP,
    sendPasswordResetOTP
};