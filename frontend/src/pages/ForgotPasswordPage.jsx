import { ArrowLeftIcon, Mail, Loader } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import { Link } from 'react-router-dom'


const ForgotPasswordPage = () => {

    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { isLoading, forgotPassword } = useAuthStore()
    const handleForgotpassword = async (e) => {
        e.preventDefault()
        try {
            await forgotPassword(email)
            setIsSubmitted(true)
        } catch (error) {
            toast.error(error.response.data.message,
                {
                    duration: 2000,
                    id: error.response.data.message,
                    position: 'top-center',
                    // className: ' bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl text-base text-white p-4 shadow-xl border border-gray-600' 
                })
        }

    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >

            <div className='p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
                    Forgot Password
                </h2>
                {!isSubmitted ? (

                    <form onSubmit={handleForgotpassword}>
                        <p className='text-center text-sm text-gray-300 mb-6'>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <Input
                            icon={Mail}
                            type='email'
                            placeholder='Email Address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <motion.button
                            className='mt-3 w-full py-3 bg-gradient-to-r from-green-500
                                    to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
                                    focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200'
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Send Reset Link"}
                        </motion.button>
                    </form>
                ) : (

                    <div className='text-center'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'
                        >
                            <Mail className='h-8 w-8 text-white' />
                        </motion.div>
                        <p className='text-gray-300 nm-6'>
                            If an account exists for {email}, you will recieve a password reset link shortly
                        </p>
                    </div>

                )}
            </div>

            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <Link to={'/'} className='text-sm text-green-400 hover:underline flex justify-center items-center'>
                    <ArrowLeftIcon className='size-3 mr-1' /> Back to Login
                </Link>
            </div>

        </motion.div>
    )
}

export default ForgotPasswordPage