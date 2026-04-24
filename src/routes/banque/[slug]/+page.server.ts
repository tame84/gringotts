import { db } from '$lib/server/db/index.js';
import { sessionsTable } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load = async ({ params, url }) => {
	const slug = params.slug;
	const isNew = url.searchParams.get('new') === 'true';

	const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.slug, slug));

	return {
		isNew,
		session: {
			id: session.id,
			validUntil: session.validUntil,
			linkedAccountsCount: session.linkedAccountsCount
		},
		aspsp: {
			name: session.aspsp.name,
			country: session.aspsp.country
		}
	};
};
