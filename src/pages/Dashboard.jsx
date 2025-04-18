import React from 'react'

const Dashboard = ({ logout }) => {
	return (
		<div>
			Dashboard
			<button
				onClick={logout}
				className='w-[100%] h-[54px] bg-[black] text-[white]'
			>
				Logout
			</button>
		</div>
	)
}

export default Dashboard
