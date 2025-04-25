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

		if (isFetchingUsers) {
			setError('Please wait while user data is loading.')
			setIsLoading(false)
			return
		}

		try {
			// Check if the email or password is already taken
			const emailExists = users.some(user => user.gmail === emailInput)
			const passwordExists = users.some(user => user.password === passwordInput)
			if ( emailExists && passwordExists) {
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
			

			// Send the registration request
			const response = await fetch(
				'https://marsgoup-1.onrender.com/api/users',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
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
				}
			)

			const userData = await response.json()

			// Ensure registration was successful
			if (!response.ok || !userData._id) {
				throw new Error('Registration failed. Please try again.')
			}

			// Save user info to localStorage
			localStorage.setItem('isAuth', 'true')
			localStorage.setItem(
				'user',
				JSON.stringify({
					id: userData._id,
					fullname: userData.fullname,
					gmail: userData.email,
					favoriteItems: [],
					orders: [],
					historyOfOrders: [],
					creditCard: [],
					locations: [],
					notifications: [],
				})
			)

			// Refresh the page to trigger PrivateRoute logic
			window.location.reload()
		} catch (err) {
			console.error('❌ Xatolik:', err)
			setError(
				err.name === 'AbortError'
					? '⏳ Registration request timed out.'
					: err.message || 'Registration failed. Please try again.'
			)
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
					<p className='font-[Montserrat] font-[400] text-[#1a1a1a] text-[16px] flex items-center gap:[5px]'>
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
