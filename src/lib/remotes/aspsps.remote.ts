import { getRequestEvent, query } from '$app/server';
import { createEBJWT } from '$lib/server/utils';
import type { EBGetAspspsResponse } from '$lib/types/enablebanking';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getAspsps = query(v.string(), async (country) => {
	const { fetch } = getRequestEvent();

	const response = await fetch(`https://api.enablebanking.com/aspsps?country=${country}`, {
		headers: {
			Authorization: `Bearer ${createEBJWT()}`
		}
	}).catch((err) => {
		console.error('Error fetching ASPSPs data from Enable Banking API:', err);
		error(500, 'Failed to retrieve ASPSPs data');
	});
	if (!response.ok) {
		console.error(
			`Error fetching ASPSPs data from Enable Banking API (Code: ${response.status}): ${await response.text()}`
		);
		error(500, 'Failed to retrieve ASPSPs data');
	}

	const aspspsData: EBGetAspspsResponse = await response.json();
	return aspspsData.aspsps;
});
