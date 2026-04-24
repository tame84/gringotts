import { authorizeSession } from '$lib/remotes/session.remote';

export const load = async ({ url }) => {
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	if (!state || !code) {
		return {
			error: 'Missing state or code'
		};
	}

	const session = await authorizeSession({ state, code });
	return { session };
};
