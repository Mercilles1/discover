import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import password1 from '../assets/Password1.svg'
import password2 from '../assets/Password2.svg'
import mistake from '../assets/Danger.svg'
import correct from '../assets/Correct.svg'
import google from '../assets/Google.svg'
import facebook from '../assets/Facebook.svg'

const Login = ({ login }) => {
	const [passwordInput, setPasswordInput] = useState('')
	const [emailInput, setEmailInput] = useState('')
	const [eye, setEye] = useState(password1)
	const [email, setEmail] = useState(null)
	const [borderPassword, setBorderPassword] = useState('border-[#E6E6E6]')
	const [borderEmail, setBorderEmail] = useState('border-[#E6E6E6]')
	const [error, setError] = useState('')
	const [users, setUsers] = useState([])
	const [disabled, setDisabled] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch('https://marsgoup-1.onrender.com/api/users')
				if (!response.ok) {
					throw new Error('Failed to fetch users')
				}
				const data = await response.json()
				setUsers(data)
			} catch (err) {
				setError('Failed to fetch users')
				console.error('Fetch error:', err)
			}
		}
		fetchUsers()
	}, [])

	useEffect(() => {
		const authStatus = localStorage.getItem('isAuth')
		if (authStatus === 'true') {
			navigate('/dashboard')
		}
	}, [navigate])

	const handleLogin = () => {
		const user = users.find(
			v => v.gmail === emailInput && v.password === passwordInput
		)
		if (user) {
			const userWithoutPassword = { ...user }
			delete userWithoutPassword.password
			login(userWithoutPassword)
			navigate('/dashboard')
		} else {
			setError('Incorrect email or password!')
		}
	}

	const SearchForPassword = () => {
		if (passwordInput.trim() === '') {
			setBorderPassword('border-[#E6E6E6]')
			setDisabled(true)
			return
		}
		if (passwordInput.length > 3) {
			setBorderPassword('border-[#0C9409]')
			setDisabled(false)
		} else {
			setBorderPassword('border-[#ED1010]')
		}
	}

	const SearchForEmail = () => {
		if (emailInput.trim() === '') {
			setEmail(null)
			setBorderEmail('border-[#E6E6E6]')
			return
		}
		const emailRegex = /^[^\s@]+@gmail\.com$/i
		if (emailRegex.test(emailInput)) {
			setEmail(correct)
			setBorderEmail('border-[#0C9409]')
		} else {
			setEmail(mistake)
			setBorderEmail('border-[#ED1010]')
		}
	}

	const handleEmailChange = e => {
		setEmailInput(e.target.value)
		SearchForEmail()
	}

	const handlePasswordChange = e => {
		setPasswordInput(e.target.value)
		SearchForPassword()
	}

	const toggleEye = () => {
		setEye(eye === password1 ? password2 : password1)
	}

	return (
		<div className='max-w-[390px] md:max-w-[500px] w-full h-screen px-[24px] py-[12px] flex flex-col gap-[24px] mx-auto'>
			<div className='flex flex-col gap-[8px] text-center md:text-left'>
				<h1 className='font-[Montserrat] font-[700] text-[#1a1a1a] text-[28px] md:text-[32px] leading-[100%] tracking-[-0.05em]'>
					Login to your account
				</h1>
				<p className='font-[Montserrat] font-[400] text-[16px] text-[#808080] leading-[140%] tracking-[0%]'>
					It's great to see you again.
				</p>
			</div>

			<div className='flex flex-col justify-between h-full'>
				<div className='flex flex-col gap-[10px]'>
					<div className='flex flex-col gap-[16px]'>
						<div className='flex flex-col gap-[4px]'>
							<p className='font-[Montserrat] font-[500] text-[#1a1a1a] text-[16px]'>
								Email
							</p>
							<div
								className={`flex items-center justify-between px-[22px] py-[17px] border rounded-[10px] ${borderEmail}`}
							>
								<input
									className='outline-none w-full font-[Montserrat] font-[400] text-[16px] text-[#1A1A1A] placeholder:text-[#999999] tracking-[-0.04em]'
									type='text'
									placeholder='Enter your email address'
									value={emailInput}
									onChange={handleEmailChange}
									onBlur={SearchForEmail}
								/>
								{email && <img src={email} alt='Email status' className='w-[20px]' />}
							</div>
						</div>

						<div className='flex flex-col gap-[4px]'>
							<p className='font-[Montserrat] font-[500] text-[#1a1a1a] text-[16px]'>
								Password
							</p>
							<div
								className={`flex items-center justify-between px-[22px] py-[17px] border rounded-[10px] ${borderPassword}`}
							>
								<input
									className='outline-none w-full font-[Montserrat] font-[400] text-[16px] text-[#1A1A1A] placeholder:text-[#999999] tracking-[-0.04em]'
									type={eye === password1 ? 'password' : 'text'}
									placeholder='Enter your password'
									value={passwordInput}
									onChange={handlePasswordChange}
								/>
								<button onClick={toggleEye} className='ml-2'>
									<img
										className='w-[20px]'
										src={eye}
										alt='Toggle password visibility'
									/>
								</button>
							</div>
						</div>

						{error && <p className='text-[#ED1010] text-sm'>{error}</p>}
					</div>

					<div className='flex flex-col gap-[20px]'>
						<p className='font-[Montserrat] font-[400] text-[#1a1a1a] text-[14px] flex flex-wrap items-center gap-[5px]'>
							Forgot your password?
							<a href='#' className='underline text-[black] font-[500]'>
								Reset your password
							</a>
						</p>
						<button
							onClick={handleLogin}
							className='w-full h-[54px] rounded-[10px] bg-[black] font-[Montserrat] font-[500] text-[white] text-[16px] flex items-center justify-center disabled:opacity-50'
							disabled={disabled}
						>
							Login
						</button>

						<div className='flex items-center gap-[8px]'>
							<hr className='text-[#E6E6E6] w-[45%]' />
							<p className='font-[Montserrat] font-[400] text-[14px] text-[#808080]'>
								Or
							</p>
							<hr className='text-[#E6E6E6] w-[45%]' />
						</div>

						<div className='flex flex-col gap-[16px]'>
							<button className='w-full border border-[#CCCCCC] rounded-[10px] h-[54px] flex items-center justify-center gap-[10px] font-[Montserrat] font-[500] text-[black] text-[16px]'>
								<img src={google} alt='Google' />
								Login with Google
							</button>
							<button className='w-full bg-[#1877F2] h-[54px] rounded-[10px] flex items-center justify-center gap-[10px] font-[Montserrat] font-[500] text-[white] text-[16px]'>
								<img src={facebook} alt='Facebook' />
								Login with Facebook
							</button>
						</div>
					</div>
				</div>

				<div className='flex items-center justify-center mt-[20px] text-center'>
					<p className='font-[Montserrat] font-[400] text-[#1a1a1a] text-[16px] flex items-center gap-[5px] flex-wrap justify-center'>
						Don’t have an account?
						<NavLink to='/register' className='underline text-[black] font-[500]'>
							Join
						</NavLink>
					</p>
				</div>
			</div>	
		</div>	
	)
}

export default Login
