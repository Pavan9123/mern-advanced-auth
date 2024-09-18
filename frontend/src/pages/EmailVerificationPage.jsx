import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'



const EmailVerificationPage = () => {

  
  const inputRefs = useRef([])
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const {verifyEmail, isLoading, error} = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if(code.every((digit) => digit !== "")){
      handleSubmit(new Event("Submit"))
    }
  }, [code])

  const handleChange = (index, value) => {
    
    if (value !== "") {
      if (index < code.length) {
        if (value.length > 1 && index === 0) {
          const newCode = [...code]
          const pastedCode = value.slice(0, 6).split("");
          for (let i = 0; i < 6; i++) {
            newCode[i] = pastedCode[i] || "";
          }
          setCode(newCode);

          // Focus on the last non-empty input or the first empty one
          const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
          const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
          inputRefs.current[focusIndex].focus();
        } else {
          const newCode = [...code]
          newCode[index] = value
          setCode(newCode)
          inputRefs.current[index + 1].focus()
        }

      }
    }


  }

  const handleKeyDown = (index, e) => {
    
    if (e.key === "Backspace" && index < code.length && index >= 0) {
      const newCode = [...code]
      newCode[index] = ""
      setCode(newCode)
      inputRefs.current[index - 1].focus()
    } else {
      const newCode = [...code]
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const verificationCode = code.join("")
      await verifyEmail(verificationCode)
      navigate('/')
      toast.success("Email Verified Sucessfully")
    } catch (error) {
      console.log(error)
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
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
          Verify Your Email
        </h2>
        <p className='text-center text-sm text-gray-300 mb-6'>Enter the 6-digit code sent to your email address</p>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex justify-between'>
            {code.map((digit, index) => (
              <input
                key={index}
                type='text'
                ref={(e) => (inputRefs.current[index] = e)}
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
              />
            ))}
          </div>
          {error && <p className='text-read-500 font-semibold mt-2'>{error}</p> }
          <motion.button
            whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type='submit'
						disabled={isLoading || code.some((digit) => !digit)}
						className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
          >
            {isLoading ? <Loader className='animate-spin mx-auto' size={24}/>: "Verify Email"}
          </motion.button>
        </form>
        
      </div>

    </motion.div>
  )
}

export default EmailVerificationPage