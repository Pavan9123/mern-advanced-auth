import { client, sender } from './mailtrap.config.js'
import { VERIFICATION_EMAIL_TEMPLATE,  PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} from './emailTemplate.js'

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]

    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email Sent Successfully", res)
    } catch (error) {
        console.error('Error Sending Verification', error)
        throw new Error(`Error Sending verificatio email: ${error}`)
    }

}

export const sendWelcomeEmail = async (email, name) => {

    const recipient = [{ email }]

    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            template_uuid: "52696299-a0c5-4d21-8494-8ec659aa078f",
            template_variables: {
                "company_info_name": "Auth Company",
                "name": name
            },
            })
        console.log("Welcome Email Sent Successfully", res)
    } catch (error) {
        console.error('Error Sending Verification', error)
        throw new Error(`Error Sending verificatio email: ${error}`)
    }

}

export const sendResetPasswordEmail = async (email, url) => {
    const recipient = [{email}]

    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: "Reset Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", url),
            category: "Reset Password"
        })
        console.log("Email Sent Successfully", res)
    } catch (error) {
        console.error('Error Sending password reset email', error)
        throw new Error(`Error Sending password reset email: ${error}`)
    }
}

export const sendPasswordResetCompleteEmail = async (email) => {
    const recipient = [{email}]
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Completed",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Completed"
        })
        console.log("Email Sent Successfully", res)
    } catch (error) {
        console.error('Error Sending Success Email', error)
        throw new Error(`Error Sending Success Email: ${error}`)
    }
}