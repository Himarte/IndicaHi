import { Discord, Google } from 'arctic';
import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_CLIENT_REDIRECT_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CLIENT_REDIRECT_URL
} from '$env/static/private';

// Discord OAuth client
export const discord = new Discord(
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_CLIENT_REDIRECT_URL
);

// Google OAuth client
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CLIENT_REDIRECT_URL
);
