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

	// Generate a random ID once on component mount
	useEffect(() => {
		const random = Math.round(Math.random() * 1000000000000000000000000)
		setRandomId(random)
	}, [])

	useEffect(() => {
		const fetchUsers = async () => {
			setIsFetchingUsers(true)
			try {
				const response = await fetch(
					'https://marsgoup-1.onrender.com/api/users'
				)
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

		try {
			// Creating the user data object to be sent
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

			// Send registration request
			const response = await fetch(
				'https://marsgoup-1.onrender.com/api/users',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(userData),
				}
			)

			// Handle response
			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Registration failed')
			}

			const createdUser = await response.json()

			// Set user data in localStorage (properly stringified)
			localStorage.setItem('user', JSON.stringify(createdUser))

			// Set authentication status
			localStorage.setItem('isAuth', 'true')

			// Important: Use the login function passed as prop to set auth state in App
			// This is the key change that allows auto-login after registration
			login(createdUser)

			// Navigate to dashboard on success
			navigate('/dashboard')
		} catch (err) {
			setError(err.message || 'Registration failed. Please try again.')
			console.error('Registration error:', err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='max-w-[390px] h-screen px-[24px] py-[12px] flex flex-col gap-[24px]'>
			<div className='flex flex-col gap-[8px]'>
				<h1 className='font-[Montserrat] font-[700] text-[#1a1a1a] text-[32px] leading-[100%] tracking-[-5%]'>
					Create your account
				</h1>
				<p className='font-[Montserrat] font-[400] text-[16px] text-[#808080] leading-[140%] tracking-[0%]'>
					Join our community today.
				</p>
			</div>
			<div className='flex flex-col justify-between h-[100vh]'>
				<div className='flex flex-col gap-[10px]'>
					<div className='flex flex-col gap-[16px]'>
						{/* Full Name */}
						<div className='flex flex-col gap-[4px]'>
							<p className='font-[Montserrat] font-[500] text-[#1a1a1a] text-[16px]'>
								Full Name
							</p>
							<div
								className={`flex items-center justify-between px-[22px] py-[17px] border rounded-[10px] ${borderName}`}
							>
								<input
									className='outline-none w-[100%] font-[Montserrat] font-[400] text-[16px] text-[#1A1A1A] placeholder:text-[#999999] tracking-[-4%]'
									type='text'
									placeholder='Enter your full name'
									value={nameInput}
									onChange={handleNameChange}
									onBlur={validateName}
								/>
							</div>
						</div>
						{/* Email */}
						<div className='flex flex-col gap-[4px]'>
							<p className='font-[Montserrat] font-[500] text-[#1a1a1a] text-[16px]'>
								Email
							</p>
							<div
								className={`flex items-center justify-between px-[22px] py-[17px] border rounded-[10px] ${borderEmail}`}
							>
								<input
									className='outline-none w-[100%] font-[Montserrat] font-[400] text-[16px] text-[#1A1A1A] placeholder:text-[#999999] tracking-[-4%]'
									type='text'
									placeholder='Enter your email address'
									value={emailInput}
									onChange={handleEmailChange}
									onBlur={validateEmail}
								/>
								{emailStatus && (
									<img
										src={emailStatus}
										alt='Email status'
										className='w-[20px]'
									/>
								)}
							</div>
						</div>
						{/* Password */}
						<div className='flex flex-col gap-[4px]'>
							<p className='font-[Montserrat] font-[500] text-[#1a1a1a] text-[16px]'>
								Password
							</p>
							<div
								className={`flex items-center justify-between px-[22px] py-[17px] border rounded-[10px] ${borderPassword}`}
							>
								<input
									className='outline-none w-[100%] font-[Montserrat] font-[400] text-[16px] text-[#1A1A1A] placeholder:text-[#999999] tracking-[-4%]'
									type={eye === password1 ? 'password' : 'text'}
									placeholder='Create a password'
									value={passwordInput}
									onChange={handlePasswordChange}
									onBlur={validatePassword}
								/>
								<button onClick={toggleEye}>
									<img
										className='w-[20px]'
										src={eye}
										alt='Toggle password visibility'
									/>
								</button>
							</div>
						</div>
						{error && <p className='text-[#ED1010]'>{error}</p>}
					</div>
					<div className='flex flex-col gap-[20px]'>
						<button
							onClick={handleRegister}
							className={`w-[100%] h-[54px] rounded-[10px] bg-[black] font-[Montserrat] font-[500] text-[white] text-[16px] flex items-center justify-center ${
								isDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
							}`}
							disabled={isDisabled || isLoading}
						>
							{isLoading ? 'Registering...' : 'Create Account'}
						</button>
						<div className='flex items-center gap-[8px]'>
							<hr className='text-[#E6E6E6] w-[45%]' />
							<p className='font-[Montserrat] font-[400] text-[14px] text-[#808080]'>
								Or
							</p>
							<hr className='text-[#E6E6E6] w-[45%]' />
						</div>
						<div className='flex flex-col gap-[16px]'>
							<button
								onClick={() => alert('Google registration not implemented yet')}
								className='w-[100%] border border-[#CCCCCC] rounded-[10px] h-[54px] flex items-center justify-center gap-[10px] font-[Montserrat] font-[500] text-[black] text-[16px]'
							>
								<img src={google} alt='Google' />
								Register with Google
							</button>
							<button
								onClick={() =>
									alert('Facebook registration not implemented yet')
								}
								className='w-[100%] bg-[#1877F2] h-[54px] rounded-[10px] flex items-center justify-center gap-[10px] font-[Montserrat] font-[500] text-[white] text-[16px]'
							>
								<img src={facebook} alt='Facebook' />
								Register with Facebook
							</button>
						</div>
					</div>
				</div>
				<div className='flex items-center justify-center'>
					<p className='font-[Montserrat] font-[400] text-[#1a1a1a] text-[16px] flex items-center gap-[5px]'>
						Already have an account?
						<NavLink to='/login' className='underline text-[black] font-[500]'>
							Login
						</NavLink>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Register
