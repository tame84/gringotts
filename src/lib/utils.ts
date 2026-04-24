import type { EBPSUType, EBUsage } from './types/enablebanking';

export const getCountryDisplayName = (locale: string, countryCode: string): string => {
	return new Intl.DisplayNames([locale], { type: 'region' }).of(countryCode) || countryCode;
};

export const getPsuTypeDisplayName = (psuType: EBPSUType): 'Entreprise' | 'Particulier' => {
	switch (psuType) {
		case 'business':
			return 'Entreprise';
		case 'personal':
			return 'Particulier';
	}
};

export const getAccountUsageDisplayName = (usage: EBUsage): 'Professionnel' | 'Personnel' => {
	switch (usage) {
		case 'ORGA':
			return 'Professionnel';
		case 'PRIV':
			return 'Personnel';
	}
};
