import bcrypt from 'bcrypt';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

import { db } from './db.server';

//* Login user
export async function login({ username, password }) {
	const user = await db.user.findUnique({
		where: {
			username,
		},
	});

	if (!user) return null;

	//* Check password
	const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

	if (!isCorrectPassword) return null;

	return user;
}

//* Get session secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
	throw new Error('No Session secret');
}

//* Create session storage
const storage = createCookieSessionStorage({
	cookie: {
		name: 'remixblog.session',
		secure: process.env.NODE_ENV === 'production',
		secrets: [sessionSecret],
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 60,
		httpOnly: true,
	},
});

//* Create session
export async function createUserSession(userId: string, redirectTo: string) {
	const session = await storage.getSession();
	session.set('userId', userId);
	return redirect(redirectTo, {
		headers: {
			'Set-Cookie': await storage.commitSession(session),
		},
	});
}
