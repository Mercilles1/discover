import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
		fetch('https://marsgoup-1.onrender.com/api/users')
			.then(res => res.json())
			.then(data => setUsers(data))
			// .catch(err => setError('Failed to fetch users'))
	}, [])

	useEffect(() => {
		const authStatus = localStorage.getItem('isAuth')
		if (authStatus === 'true') {
			navigate('/dashboard')
		}
	}, [navigate])

	const handleLogin = () => {
		if (
			users.find(v => v.gmail === emailInput && v.password === passwordInput)
		) {
			const user = users.find(v => v.gmail === emailInput && v.password === passwordInput)
			delete user.password
			login(user)
			navigate('/dashboard')
		} else {
			setError('Parol yoki emailda xatolik mavjud!')
		}
	}

	const SearchForPassword = () => {
		// Check if the input is empty
		if (passwordInput.trim() === '') {
			setBorderPassword('border-[#E6E6E6]')
			setDisabled(true)
			return
		}

		// Check password length
		if (passwordInput.length > 3) {
			setBorderPassword('border-[#0C9409]')
			setDisabled(false)
		} else {
			setBorderPassword('border-[#ED1010]')
		}
	}

	// Improved email validation
	const SearchForEmail = () => {
		// Check if the input is empty
		if (emailInput.trim() === '') {
			setEmail(null)
			setBorderEmail('border-[#E6E6E6]')
			return
		}

		// Using regex to validate email format
		const emailRegex = /^[^\s@]+@gmail\.com$/i
		if (emailRegex.test(emailInput)) {
			setEmail(correct)
			setBorderEmail('border-[#0C9409]')
		} else {
			setEmail(mistake)
			setBorderEmail('border-[#ED1010]')
		}
	}

	// Handle email input change
	const handleEmailChange = e => {
		setEmailInput(e.target.value)
		SearchForEmail() // Removed setTimeout
	}

	// Handle password input change
	const handlePasswordChange = e => {
		setPasswordInput(e.target.value)
		SearchForPassword()
	}

	// Toggle eye function
	const toggleEye = () => {
		setEye(eye === password1 ? password2 : password1)
	}

	return (
		<div className='max-w-[390px] h-screen px-[24px] py-[12px] flex flex-col gap-[24px]'>
			<div className='flex flex-col gap-[8px]'>
				<h1 className='font-[Montserrat] font-[700] text-[#1a1a1a] text-[32px] leading-[100%] tracking-[-5%]'>
					Login to your account
				</h1>
				<p className='font-[Montserrat] font-[400] text-[16px] text-[#808080] leading-[140%] tracking-[0%]'>
					It's great to see you again.
				</p>
			</div>
			<div className='flex flex-col justify-between h-[100vh]'>
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
									className='outline-none w-[100%] font-[Montserrat] font-[400] text-[16px] text-[#1A1A1A] placeholder:text-[#999999] tracking-[-4%]'
									type='text'
									placeholder='Enter your email address'
									value={emailInput}
									onChange={handleEmailChange}
									onBlur={SearchForEmail}
								/>
								{email && <img src={email} alt='' className='w-[20px]' />}
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
									className='outline-none w-[100%] font-[Montserrat] font-[400] text-[16px] text-[#1A1A1A] placeholder:text-[#999999] tracking-[-4%]'
									type={eye === password1 ? 'password' : 'text'}
									placeholder='Enter your password'
									value={passwordInput}
									onChange={handlePasswordChange}
								/>
								<div className='flex items-center gap-[8px]'>
									<button onClick={toggleEye}>
										<img className='w-[20px]' src={eye} alt='' />
									</button>
								</div>
							</div>
						</div>
						{error && <p className='text-[#ED1010]'>{error}</p>}
					</div>
					<div className='flex flex-col gap-[20px]'>
						<p className='font-[Montserrat] font-[400] text-[#1a1a1a] text-[14px] flex items-center gap-[5px]'>
							Forgot your password?
							<a href='' className='underline text-[black] font-[500]'>
								Reset your password
							</a>
						</p>
						<button
							onClick={handleLogin}
							className='w-[100%] h-[54px] rounded-[10px] bg-[black] font-[Montserrat] font-[500] text-[white] text-[16px] flex items-center justify-center'
							disabled={disabled}
						>
							{' '}
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
							<button className='w-[100%] border border-[#CCCCCC] rounded-[10px] h-[54px] flex items-center justify-center gap-[10px] font-[Montserrat] font-[500] text-[black] text-[16px]'>
								<img src={google} alt='' />
								Login with Google
							</button>
							<button className='w-[100%] bg-[#1877F2] h-[54px] rounded-[10px] flex items-center justify-center gap-[10px] font-[Montserrat] font-[500] text-[white] text-[16px]'>
								<img src={facebook} alt='' />
								Login with Facebook
							</button>
						</div>
					</div>
				</div>
				<div className='flex items-center justify-center'>
					<p className='font-[Montserrat] font-[400] text-[#1a1a1a] text-[16px] flex items-center gap-[5px]'>
						Don’t have an account?
						<a href='' className='underline text-[black] font-[500]'>
							Join
						</a>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Login
