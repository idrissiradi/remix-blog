import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';

import { db } from '../../utils/db.server';
import { login, createUserSession } from '../../utils/session.server';

function validateUsername(username) {
	if (typeof username !== 'string' || username.length < 3) {
		return 'Username must be at least 3 characters';
	}
}

function validatePassword(password) {
	if (typeof password !== 'string' || password.length < 6) {
		return 'Password must be at least 6 characters';
	}
}

function badRequest(data) {
	return json(data, { status: 400 });
}

export const action = async ({ request }) => {
	const form = await request.formData();
	const loginType = form.get('loginType');
	const username = form.get('username');
	const password = form.get('password');

	const fields = { loginType, username, password };

	const fieldErrors = {
		username: validateUsername(username),
		password: validatePassword(password),
	};

	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields });
	}

	switch (loginType) {
		case 'login': {
			//* Find user
			const user = await login({ username, password });
			//* Check  user
			if (!user) {
				return badRequest({
					fieldErrors: { username: 'Invalid credentials' },
					fields,
				});
			}
			//* Create user session
			return createUserSession(user.id, '/posts');
		}
		case 'register':
			return register(username, password);
		default:
			return badRequest({ fieldErrors, fields });
	}
};

function Login() {
	const actionData = useActionData();

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
								defaultChecked={
									!actionData?.fields?.loginType ||
									actionData.fields.loginType === 'login'
								}
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
						<input
							type='text'
							name='username'
							id='username'
							defaultValue={actionData?.fields?.username}
						/>
						<div className='error'>
							{actionData?.fieldErrors?.username &&
								actionData?.fieldErrors?.username}
						</div>
					</div>
					<div className='form-control'>
						<label htmlFor='password'>Password</label>
						<input
							type='password'
							name='password'
							id='password'
							defaultValue={actionData?.fields?.password}
						/>
						<div className='error'>
							{actionData?.fieldErrors?.password &&
								actionData?.fieldErrors?.password}
						</div>
					</div>

					<button type='submit' className='btn btn-block'>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
