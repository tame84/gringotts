import { query } from '$app/server';
import { db } from '$lib/server/db';
import { accountsTable, sessionsTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAccounts = query(async () => {
	const accounts = await db
		.select({ id: accountsTable.id, aspsp: sessionsTable.aspsp })
		.from(accountsTable)
		.leftJoin(sessionsTable, eq(accountsTable.sessionId, sessionsTable.id));
	return accounts;
});
