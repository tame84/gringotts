import { ENABLE_BANKING_APP_ID, ENABLE_BANKING_PRIVATE_KEY } from '$env/static/private';
import jwt from 'jsonwebtoken';

export const createEBJWT = (): string => {
	const nowSeconds = Math.floor(Date.now() / 1000);

	const payload = {
		iss: 'enablebanking.com',
		aud: 'api.enablebanking.com',
		iat: nowSeconds,
		exp: nowSeconds + 60 * 60 * 12
	};

	const token = jwt.sign(payload, ENABLE_BANKING_PRIVATE_KEY, {
		algorithm: 'RS256',
		header: {
			typ: 'JWT',
			alg: 'RS256',
			kid: ENABLE_BANKING_APP_ID
		}
	});

	return token;
};
