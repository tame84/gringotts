import { resolve } from '$app/paths';
import { authorizeSession } from '$lib/remotes/session.remote';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	if (!state || !code) {
		return {
			error: 'Missing state or code'
		};
	}

	const session = await authorizeSession({ state, code });

	redirect(302, resolve('/banque/[slug]?new=true', { slug: session.slug }));
};
