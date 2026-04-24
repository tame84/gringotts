import { db } from '$lib/server/db/index.js';
import { sessionsTable } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const slug = params.slug;

	const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.slug, slug));

	return {
		sessionId: session.id,
		aspsp: {
			name: session.aspsp.name,
			country: session.aspsp.country
		}
	};
};
