function login() {
	return (
		<div className='auth-container'>
			<div className='page-header'>
				<h1>Login</h1>
			</div>

			<div className='page-content'>
				<form method='POST'>
					<fieldset>
						<legend>Login or Register</legend>
						<label>
							<input
								type='radio'
								name='loginType'
								value='login'
							/>{' '}
							Login
						</label>
						<label>
							<input
								type='radio'
								name='loginType'
								value='register'
							/>{' '}
							Register
						</label>
					</fieldset>

					<div className='form-control'>
						<label htmlFor='username'>Username</label>
						<input type='text' name='username' id='username' />
						<div className='error'></div>
					</div>
					<div className='form-control'>
						<label htmlFor='password'>Password</label>
						<input type='password' name='password' id='password' />
						<div className='error'></div>
					</div>

					<button type='submit' className='btn btn-block'>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default login;
