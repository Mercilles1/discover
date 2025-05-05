import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import password1 from '../assets/Password1.svg'
import password2 from '../assets/Password2.svg'
import mistake from '../assets/Danger.svg'
import correct from '../assets/Correct.svg'
import google from '../assets/Google.svg'
import facebook from '../assets/Facebook.svg'

const Register = ({ login }) => {
	const [nameInput, setNameInput] = useState('')
	const [randomId, setRandomId] = useState('')
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
		const random = Math.round(Math.random() * 1e24)
		setRandomId(random)
	}, [])

	useEffect(() => {
		const fetchUsers = async () => {
			setIsFetchingUsers(true)
			try {
				const response = await fetch('https://marsgoup-1.onrender.com/api/users')
				if (!response.ok) throw new Error(`Failed to fetch users`)
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
		setBorderName(nameInput.trim().length >= 2 ? 'border-[#0C9409]' : 'border-[#ED1010]')
	}
	const validatePassword = () => {
		setBorderPassword(passwordInput.length > 3 ? 'border-[#0C9409]' : 'border-[#ED1010]')
	}
	const validateEmail = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		const isValid = emailRegex.test(emailInput)
		setEmailStatus(isValid ? correct : mistake)
		setBorderEmail(isValid ? 'border-[#0C9409]' : 'border-[#ED1010]')
	}

	const handleRegister = async () => {
		setError('')
		setIsLoading(true)
		try {
			const userData = {
				id: randomId,
				fullname: nameInput,
				gmail: emailInput,
				password: passwordInput,
				favoriteItems: [],
				orders: [],
				historyOfOrders: [],
				creditCard: [],
				locations: [],
				notifications: [],
			}

			const response = await fetch('https://marsgoup-1.onrender.com/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Registration failed')
			}

			const createdUser = await response.json()
			localStorage.setItem('user', JSON.stringify(createdUser))
			localStorage.setItem('isAuth', 'true')
			login(createdUser)
			navigate('/dashboard')
		} catch (err) {
			setError(err.message || 'Registration failed.')
			console.error('Registration error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='w-full min-h-screen px-4 py-6 flex items-center justify-center'>
			<div className='w-full max-w-[480px] md:max-w-[550px] lg:max-w-[600px] bg-white p-6 md:p-10 rounded-[12px] shadow-lg flex flex-col gap-[24px]'>
				<div className='flex flex-col gap-[8px]'>
					<h1 className='font-[Montserrat] font-bold text-[#1a1a1a] text-[28px] md:text-[32px] leading-tight'>
						Create your account
					</h1>
					<p className='text-[#808080] text-[16px]'>Join our community today.</p>
				</div>

				<div className='flex flex-col gap-[16px]'>
					{/* Full Name */}
					<div className='flex flex-col gap-[4px]'>
						<p className='font-medium text-[#1a1a1a] text-[16px]'>Full Name</p>
						<div className={`flex items-center px-4 py-4 border rounded-[10px] ${borderName}`}>
							<input
								type='text'
								placeholder='Enter your full name'
								className='w-full outline-none text-[16px] placeholder:text-[#999]'
								value={nameInput}
								onChange={e => setNameInput(e.target.value)}
								onBlur={validateName}
							/>
						</div>
					</div>

					{/* Email */}
					<div className='flex flex-col gap-[4px]'>
						<p className='font-medium text-[#1a1a1a] text-[16px]'>Email</p>
						<div className={`flex items-center px-4 py-4 border rounded-[10px] ${borderEmail}`}>
							<input
								type='text'
								placeholder='Enter your email address'
								className='w-full outline-none text-[16px] placeholder:text-[#999]'
								value={emailInput}
								onChange={e => setEmailInput(e.target.value)}
								onBlur={validateEmail}
							/>
							{emailStatus && <img src={emailStatus} alt='status' className='w-[20px]' />}
						</div>
					</div>

					{/* Password */}
					<div className='flex flex-col gap-[4px]'>
						<p className='font-medium text-[#1a1a1a] text-[16px]'>Password</p>
						<div className={`flex items-center px-4 py-4 border rounded-[10px] ${borderPassword}`}>
							<input
								type={eye === password1 ? 'password' : 'text'}
								placeholder='Create a password'
								className='w-full outline-none text-[16px] placeholder:text-[#999]'
								value={passwordInput}
								onChange={e => setPasswordInput(e.target.value)}
								onBlur={validatePassword}
							/>
							<button onClick={() => setEye(prev => (prev === password1 ? password2 : password1))}>
								<img src={eye} alt='toggle eye' className='w-[20px]' />
							</button>
						</div>
					</div>

					{error && <p className='text-[#ED1010]'>{error}</p>}

					{/* Register Button */}
					<button
						onClick={handleRegister}
						disabled={isDisabled || isLoading}
						className={`w-full h-[54px] rounded-[10px] bg-black text-white font-medium text-[16px] flex items-center justify-center ${
							isDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
						}`}
					>
						{isLoading ? 'Registering...' : 'Create Account'}
					</button>

					{/* Or */}
					<div className='flex items-center gap-[8px]'>
						<hr className='text-[#E6E6E6] w-full' />
						<p className='text-[#808080] text-[14px]'>Or</p>
						<hr className='text-[#E6E6E6] w-full' />
					</div>

					{/* Google / Facebook */}
					<button
						onClick={() => alert('Google registration not implemented yet')}
						className='w-full border border-[#CCCCCC] rounded-[10px] h-[54px] flex items-center justify-center gap-[10px] text-black text-[16px]'
					>
						<img src={google} alt='Google' />
						Register with Google
					</button>
					<button
						onClick={() => alert('Facebook registration not implemented yet')}
						className='w-full bg-[#1877F2] text-white rounded-[10px] h-[54px] flex items-center justify-center gap-[10px] text-[16px]'
					>
						<img src={facebook} alt='Facebook' />
						Register with Facebook
					</button>
				</div>

				{/* Already have account */}
				<div className='text-center'>
					<p className='text-[16px] text-[#1a1a1a]'>
						Already have an account?{' '}
						<NavLink to='/login' className='underline font-medium'>
							Login
						</NavLink>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Register
