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
