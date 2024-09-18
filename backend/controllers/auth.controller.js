import User from '../models/user.model.js'
import crypto from 'crypto'
import bcryptjs from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js'
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendPasswordResetCompleteEmail } from '../mailtrap/emails.js'

export const signUp = async (req, res) => {
    const { email, password, name } = req.body

    try {
        if (!email || !password || !name) {
            throw new Error('All fields are required')
        }


        const userAlreadyExists = await User.findOne({ email })
        if (userAlreadyExists) {
            return res.status(400).json({ sucess: false, message: 'User already exists' })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24hours
        })

        await user.save()

        generateTokenAndSetCookie(res, user._id)

        await sendVerificationEmail(user.email, verificationToken)

        res.status(200).json({
            success: true,
            message: 'user created successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        })



    } catch (error) {
        res.status(400).json({ sucess: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined

        user.save()

        await sendWelcomeEmail(user.email, user.name)

        res.status(200).json({
            success: true,
            message: "Email Verified Successfully",
            user: {
                ...user._doc,
                password: undefined
            }

        })

    } catch (error) {
        res.status(400).json({ sucess: false, message: error.message })
    }
}

export const logIn = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Email Address' })
        }
        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Invalid Password' })
        }
        generateTokenAndSetCookie(res, user._id)

        user.lastLogin = new Date
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Logged in Successfully',
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const logOut = async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ success: true, message: "Logged out Successfully" })
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: 'Your Email is not registered with us!' })
        }

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        user.save()

        await sendResetPasswordEmail(user.email, `${process.env.UI_URL}/reset-password/${resetToken}`)

        res.status(200).json({
            success: true,
            message: "Reset Password Email Successfully Sent",
            user: {
                ...user._doc,
                password: undefined
            }
        })


    } catch (error) {
        res.status(500).json({ message: error.message })
        throw new Error({ message: "Could not send reset password email" })
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    console.log(password)

    try {


        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status({ success: false, message: 'Cannot reset password' })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save()

        await sendPasswordResetCompleteEmail(user.email)

        res.status(200).json({
            success: true,
            message: 'Password Reset Successful',
            user: {
                ...user._doc,
                password: undefined
            }
        })



    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userid)
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Error in checkAuth", error)
        return res.status(400).json({ success: false, message: error.message })
    }
}

