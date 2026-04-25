<script lang="ts">
	import { resolve } from '$app/paths';
	import type { getAccountBalances, getAccount } from '$lib/remotes/account.remote';
	import type { EBASPSP } from '$lib/types/enablebanking';
	import { getAccountUsageDisplayName, getCountryDisplayName } from '$lib/utils';

	interface Props {
		account: Awaited<ReturnType<typeof getAccount>>;
		balances: Awaited<ReturnType<typeof getAccountBalances>>;
		aspsp?: {
			name: EBASPSP['name'];
			country: EBASPSP['country'];
		};
	}

	let { account, balances, aspsp }: Props = $props();
</script>

{#if account}
	<li>
		<a href={resolve('/compte/[id]', { id: account.id })}>
			<div>
				{#if account?.usage}
					<span>{getAccountUsageDisplayName(account?.usage)}</span>
				{/if}
				<h3>{account?.holder.name}</h3>
				<p>
					{[
						aspsp ? `${aspsp.name} - ${getCountryDisplayName('fr', aspsp.country)}` : null,
						account?.iban
					]
						.filter(Boolean)
						.join(' • ')}
				</p>
			</div>
			<p>{balances?.amount} {balances?.currency}</p>
		</a>
	</li>
{/if}
