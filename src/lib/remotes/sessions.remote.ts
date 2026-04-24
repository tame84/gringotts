import { query } from '$app/server';
import { db } from '$lib/server/db';
import { sessionsTable } from '$lib/server/db/schema';
import { lt } from 'drizzle-orm';

export const getSessions = query(async () => {
	const sessions = await db
		.select()
		.from(sessionsTable)
		.orderBy(lt(sessionsTable.createdAt, sessionsTable.validUntil), sessionsTable.aspsp);

	return sessions;
});
