import { Lock, Loader } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import { useNavigate, useParams } from 'react-router-dom'

const ResetPasswordPage = () => {

    const {isLoading, error, resetPassword} = useAuthStore()
    const [newPassword, setNewPassword] = useState('')
    const [retypePassword, setRetypePassword] = useState('')
    const navigate = useNavigate()
    const { token } = useParams()

    const handleResetPassword = async (e) => {
        e.preventDefault()
        try {
            await resetPassword(token, newPassword, retypePassword)
            navigate('/')
            toast.success("Password Reset Successful.")
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
        >
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
                Reset Password
            </h2>
            <form onSubmit={handleResetPassword}>
                <Input
                    icon={Lock}
                    type='password'
                    placeholder='New Password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                    icon={Lock}
                    type='text'
                    placeholder='Re-type Password'
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
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
                    {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Submit"}
                </motion.button>
            </form>

        </motion.div>
  )
}

export default ResetPasswordPage