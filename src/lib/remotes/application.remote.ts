import { getRequestEvent, query } from '$app/server';
import { createEBJWT } from '$lib/server/utils';
import type { EBGetApplicationResponse } from '$lib/types/enablebanking';
import { getCountryDisplayName } from '$lib/utils';
import { error } from '@sveltejs/kit';

const getApplication = query(async () => {
	const { fetch } = getRequestEvent();

	const response = await fetch('https://api.enablebanking.com/application', {
		headers: {
			Authorization: `Bearer ${createEBJWT()}`
		}
	}).catch((err) => {
		console.error('Error fetching application data from Enable Banking API:', err);
		error(500, 'Failed to retrieve application data');
	});
	if (!response.ok) {
		console.error(
			`Error fetching application data from Enable Banking API (Code: ${response.status}): ${await response.text()}`
		);
		error(500, 'Failed to retrieve application data');
	}

	const applicationData: EBGetApplicationResponse = await response.json();
	return applicationData;
});

export const getApplicationCountries = query(async () => {
	const application = await getApplication();

	const countries = application.countries
		.map((country) => ({
			code: country,
			name: getCountryDisplayName('fr', country)
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	return countries;
});
