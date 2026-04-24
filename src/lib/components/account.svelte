<script lang="ts">
	import { resolve } from '$app/paths';
	import type { getAccountBalances, getAccountDetails } from '$lib/remotes/account.remote';
	import type { EBASPSP } from '$lib/types/enablebanking';
	import { getAccountUsageDisplayName, getCountryDisplayName } from '$lib/utils';

	interface Props {
		details: Awaited<ReturnType<typeof getAccountDetails>>;
		balances: Awaited<ReturnType<typeof getAccountBalances>>;
		aspsp?: {
			name: EBASPSP['name'];
			country: EBASPSP['country'];
		} | null;
	}

	let { details, balances, aspsp }: Props = $props();
</script>

<li>
	<a href={resolve('/banques')}>
		<div>
			{#if details?.usage}
				<span>{getAccountUsageDisplayName(details?.usage)}</span>
			{/if}
			<h3>{details?.holder.name}</h3>
			<p>
				{[
					aspsp ? `${aspsp.name} - ${getCountryDisplayName('fr', aspsp.country)}` : null,
					details?.iban
				]
					.filter(Boolean)
					.join(' • ')}
			</p>
		</div>
		<p>{balances?.amount} {balances?.currency}</p>
	</a>
</li>
