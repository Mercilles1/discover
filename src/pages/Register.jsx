import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import password1 from '../assets/Password1.svg'
import password2 from '../assets/Password2.svg'
import mistake from '../assets/Danger.svg'
import correct from '../assets/Correct.svg'
import google from '../assets/Google.svg'
import facebook from '../assets/Facebook.svg'

const Register = () => {
	const [nameInput, setNameInput] = useState('')
	const [passwordInput, setPasswordInput] = useState('')
	const [emailInput, setEmailInput] = useState('')
	const [eye, setEye] = useState(password1)
	const [emailStatus, setEmailStatus] = useState(null)
	const [borderName, setBorderName] = useState('border-[#E6E6E6]')
	const [borderPassword, setBorderPassword] = useState('border-[#E6E6E6]')
	const [borderEmail, setBorderEmail] = useState('border-[#E6E6E6]')
	const [error, setError] = useState('')
	const [users, setUsers] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [isFetchingUsers, setIsFetchingUsers] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchUsers = async () => {
			setIsFetchingUsers(true)
			try {
				const response = await fetch('https://marsgoup-1.onrender.com/api/users')
				if (!response.ok) {
					throw new Error(`Failed to fetch users: ${response.statusText}`)
				}
				const data = await response.json()
				setUsers(data)
			} catch (err) {
				setError('Failed to load user data. Please try again.')
				console.error('Fetch error:', err)
			} finally {
				setIsFetchingUsers(false)
			}
		}
		fetchUsers()
	}, [])

	useEffect(() => {
		const authStatus = localStorage.getItem('isAuth')
		if (authStatus === 'true' && window.location.pathname !== '/dashboard') {
			navigate('/dashboard', { replace: true })
		}
	}, [navigate])

	const isDisabled =
		nameInput.trim().length < 2 ||
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput) ||
		passwordInput.length <= 3

	const validateName = () => {
		const trimmed = nameInput.trim()
		setBorderName(trimmed.length >= 2 ? 'border-[#0C9409]' : 'border-[#ED1010]')
	}

	const validatePassword = () => {
		setBorderPassword(
			passwordInput.length > 3 ? 'border-[#0C9409]' : 'border-[#ED1010]'
		)
	}

	const validateEmail = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		const isValid = emailRegex.test(emailInput)
		setEmailStatus(isValid ? correct : mistake)
		setBorderEmail(isValid ? 'border-[#0C9409]' : 'border-[#ED1010]')
	}

	const handleNameChange = e => setNameInput(e.target.value)
	const handleEmailChange = e => setEmailInput(e.target.value)
	const handlePasswordChange = e => setPasswordInput(e.target.value)

	const toggleEye = () => {
		setEye(prev => (prev === password1 ? password2 : password1))
	}

	const handleRegister = async () => {
		setError('')
		setIsLoading(true)
		if (isFetchingUsers) {
			setError('Please wait while user data is loading.')
			setIsLoading(false)
			return
		}
		try {
			const emailExists = users.some(user => user.gmail === emailInput)
			const passwordExists = users.some(user => user.password === passwordInput)
			if (emailExists && passwordExists) {
				setIsLoading(false)
				setError('This email and password is already registered!')
			}
			if (emailExists) {
				setError('This email is already registered!')
				setIsLoading(false)
				return
			}
			if (passwordExists) {
				setError('This password is already in use!')
				setIsLoading(false)
				return
			}
			const response = await fetch('https://marsgoup-1.onrender.com/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fullname: nameInput,
					gmail: emailInput,
					password: passwordInput,
					favoriteItems: [],
					orders: [],
					historyOfOrders: [],
					creditCard: '',
					locations: [],
					notifications: [],
				}),
			})
			const userData = await response.json()
			if (!response.ok || !userData._id) {
				throw new Error('Registration failed. Please try again.')
			}
			localStorage.setItem('isAuth', 'true')
			localStorage.setItem('user', JSON.stringify({
				id: userData._id,
				fullname: userData.fullname,
				gmail: userData.email,
				favoriteItems: [],
				orders: [],
				historyOfOrders: [],
				creditCard: [],
				locations: [],
				notifications: [],
			}))
			window.location.reload()
		} catch (err) {
			console.error('❌ Error:', err)
			setError(err.name === 'AbortError' ? '⏳ Registration request timed out.' : err.message || 'Registration failed. Please try again.')
			setIsLoading(false)
		}
	}

	return (
		<div className='max-w-[450px] w-full h-screen px-6 py-4 flex flex-col gap-6 mx-auto md:max-w-[600px] lg:max-w-[800px]'>
			<div className='flex flex-col gap-2'>
				<h1 className='font-bold text-3xl text-[#1a1a1a] leading-tight'>Create your account</h1>
				<p className='text-[#808080] text-base'>Join our community today.</p>
			</div>
			<div className='flex flex-col justify-between h-full'>
				<div className='flex flex-col gap-3'>
					<div className='flex flex-col gap-4'>
						<div className='flex flex-col gap-1'>
							<p className='font-medium text-[#1a1a1a] text-base'>Full Name</p>
							<div className={`flex items-center px-5 py-4 border rounded-lg ${borderName}`}>
								<input className='w-full outline-none text-base placeholder:text-[#999999]' type='text' placeholder='Enter your full name' value={nameInput} onChange={handleNameChange} onBlur={validateName} />
							</div>
						</div>
						<div className='flex flex-col gap-1'>
							<p className='font-medium text-[#1a1a1a] text-base'>Email</p>
							<div className={`flex items-center px-5 py-4 border rounded-lg ${borderEmail}`}>
								<input className='w-full outline-none text-base placeholder:text-[#999999]' type='text' placeholder='Enter your email address' value={emailInput} onChange={handleEmailChange} onBlur={validateEmail} />
								{emailStatus && <img src={emailStatus} alt='Email status' className='w-5' />}
							</div>
						</div>
						<div className='flex flex-col gap-1'>
							<p className='font-medium text-[#1a1a1a] text-base'>Password</p>
							<div className={`flex items-center px-5 py-4 border rounded-lg ${borderPassword}`}>
								<input className='w-full outline-none text-base placeholder:text-[#999999]' type={eye === password1 ? 'password' : 'text'} placeholder='Create a password' value={passwordInput} onChange={handlePasswordChange} onBlur={validatePassword} />
								<button onClick={toggleEye}><img className='w-5' src={eye} alt='Toggle password visibility' /></button>
							</div>
						</div>
						{error && <p className='text-red-500'>{error}</p>}
					</div>
					<div className='flex flex-col gap-5'>
						<button onClick={handleRegister} disabled={isDisabled || isLoading} className={`w-full h-14 rounded-lg bg-black text-white font-medium text-base flex items-center justify-center ${isDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
							{isLoading ? 'Registering...' : 'Create Account'}
						</button>
						<div className='flex items-center gap-2'>
							<hr className='flex-grow border-gray-300' />
							<p className='text-[#808080] text-sm'>Or</p>
							<hr className='flex-grow border-gray-300' />
						</div>
						<div className='flex flex-col gap-4'>
							<button onClick={() => alert('Google registration not implemented yet')} className='w-full border border-[#CCCCCC] rounded-lg h-14 flex items-center justify-center gap-3 font-medium text-black text-base'>
								<img src={google} alt='Google' />
								Register with Google
							</button>
							<button onClick={() => alert('Facebook registration not implemented yet')} className='w-full bg-[#1877F2] rounded-lg h-14 flex items-center justify-center gap-3 font-medium text-white text-base'>
								<img src={facebook} alt='Facebook' />
								Register with Facebook
							</button>
						</div>
					</div>
				</div>
				<div className='flex items-center justify-center'>
					<p className='text-[#1a1a1a] text-base flex items-center gap-1'>Already have an account? <NavLink to='/login' className='underline font-semibold'>Login</NavLink></p>
				</div>
			</div>
		</div>
	)
}

export default Register
