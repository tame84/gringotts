<script lang="ts">
	import { resolve } from '$app/paths';
	import { getSessionAccounts } from '$lib/remotes/session.remote';
	import { getAccountUsageDisplayName, getCountryDisplayName } from '$lib/utils.js';

	let { data } = $props();
</script>

<header>
	<h1>{data.aspsp.name} - {getCountryDisplayName('fr', data.aspsp.country)}</h1>
	<nav>
		<a href={resolve('/banques')}>Mes banques</a>
	</nav>
</header>

<ul>
	{#each await getSessionAccounts(data.sessionId) as account (account.iban)}
		{console.log(account)}

		<li>
			<a href={resolve('/banques')}>
				<div>
					{#if account.usage}
						<span>{getAccountUsageDisplayName(account.usage)}</span>
					{/if}
					<h3>{account.holder.name}</h3>
					{#if account.iban}
						<span>{account.iban}</span>
					{/if}
				</div>
				<p>{account.balance.amount} {account.balance.curreny}</p>
			</a>
		</li>
	{/each}
</ul>
