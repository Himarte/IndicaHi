import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';

// Generate random ID function (replacing Lucia's generateId)
export function generateId(length: number): string {
	const bytes = new Uint8Array(Math.ceil(length * 0.6)); // Base32 is ~60% efficient
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes).slice(0, length);
}
