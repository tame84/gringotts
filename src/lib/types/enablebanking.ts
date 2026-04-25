export interface EBASPSP {
	name: string;
	country: string;
}

export interface EBASPSPData {
	name: string;
	country: string;
	logo: string;
	psu_types: EBPSUType[];
	auth_methods: EBAuthMethod[];
	maximum_consent_validity: number;
	sandbox?: {
		users: {
			username: string;
			password: string;
			otp: string;
		};
	}[];
	beta?: boolean;
	bic?: string;
	required_psu_headers?: string[];
	payments?: EBResponsePaymentType[];
	group: EBASPSPGroup;
}

interface EBASPSPGroup {
	name: string;
	logo: string;
}

interface EBAccess {
	accounts?: EBAccountIdentification[];
	balances?: boolean;
	transactions?: boolean;
	valid_until: string;
}

interface EBAccountIdentification {
	iban?: string;
	other?: EBGenericIdentification;
}

export interface EBAccountResource {
	account_id?: EBAccountIdentification;
	all_account_ids?: EBGenericIdentification[];
	account_servicer?: EBFinancialInstitutionIdentification;
	name?: string;
	details?: string;
	usage?: EBUsage;
	cash_account_type: EBCashAccountType;
	product?: string;
	currency: string;
	psu_status?: string;
	credit_limit?: EBAmountType;
	legal_age?: boolean;
	postal_address: EBPostalAddress;
	uid?: string;
	identification_hash: string;
	identification_hashes: string[];
}

type EBAddressType =
	| 'Business'
	| 'Correspondence'
	| 'DeliveryTo'
	| 'MailTo'
	| 'POBox'
	| 'Postal'
	| 'Residential'
	| 'Statement';

interface EBAmountType {
	currency: string;
	amount: string;
}

interface EBAuthMethod {
	name?: string;
	title?: string;
	psu_type: EBPSUType;
	credentials?: EBCredential[];
	approach?: EBAuthentificationApproach;
	hidden_method: boolean;
}

type EBAuthentificationApproach = 'DECOUPLED' | 'EMBEDDED' | 'REDIRECT';

export interface EBAuthorizeSessionResponse {
	session_id: string;
	accounts: EBAccountResource[];
	aspsp: EBASPSP;
	psu_type: EBPSUType;
	access: EBAccess;
}

interface EBBalanceResource {
	name: string;
	balance_amount: EBAmountType;
	balance_type: EBBalanceStatus;
	last_change_date_time?: string;
	reference_date?: string;
	last_committed_transaction?: string;
}

type EBBalanceStatus =
	| 'CLAV'
	| 'CLBD'
	| 'FWAV'
	| 'INFO'
	| 'ITAV'
	| 'ITBD'
	| 'OPAV'
	| 'OPBD'
	| 'OTHR'
	| 'PRCD'
	| 'VALU'
	| 'XPCD';

interface EBBankTransactionCode {
	description?: string;
	code?: string;
	sub_code?: string;
}

interface EBBeneficiary {
	creditor_agent?: EBFinancialInstitutionIdentification;
	creditor?: EBPartyIdentification;
	creditor_account: EBGenericIdentification;
	creditor_currency?: string;
}

type EBCashAccountType = 'CACC' | 'CARD' | 'CASH' | 'LOAN' | 'OTHR' | 'SVGS';

type EBCategoryPurposeCode =
	| 'BONU'
	| 'CASH'
	| 'CBLK'
	| 'CCRD'
	| 'CORT'
	| 'DCRD'
	| 'DIVI'
	| 'DVPM'
	| 'EPAY'
	| 'FCOL'
	| 'GOVT'
	| 'HEDG'
	| 'ICCP'
	| 'IDCP'
	| 'INTC'
	| 'INTE'
	| 'LOAN'
	| 'MP2B'
	| 'MP2P'
	| 'OTHR'
	| 'PENS'
	| 'RPRE'
	| 'RRCT'
	| 'RVPM'
	| 'SALA'
	| 'SECU'
	| 'SSBE'
	| 'SUPP'
	| 'TAXS'
	| 'TRAD'
	| 'TREA'
	| 'VATX'
	| 'WHLD';

type EBChargeBearerCode = 'CRED' | 'DEBT' | 'SHAR' | 'SLEV';

interface EBClearingSystemMemberIdentification {
	clearing_system_id?: string;
	member_id?: string;
}

interface EBContactDetails {
	email_address?: string;
	phone_number?: string;
}

interface EBCreatePaymentRequest {
	payment_type: EBPaymentType;
	payment_request: EBPaymentRequestResource;
	aspsp: EBASPSP;
	state: string;
	redirect_url: string;
	psu_type: EBPSUType;
	auth_method?: string;
	credentials?: object;
	language?: string;
	webhook_url?: string;
	psu_id?: string;
}

interface EBCreatePaymentResponse {
	payment_id: string;
	status: EBPaymentStatus;
	url: string;
	psu_id_hash: string;
}

interface EBCredential {
	name: string;
	title: string;
	required: boolean;
	description?: string;
	template?: string;
}

type EBCreditDebitIndicator = 'CRDT' | 'DBIT';

interface EBCreditTransferTransaction {
	instructed_amount: EBAmountType;
	beneficiary: EBBeneficiary;
	payment_id?: EBPaymentIdentification;
	request_execution_date?: EBRequestedExecutionDate;
	reference_number?: EBReferenceNumber;
	end_date?: EBEndDate;
	execution_rule?: EBExecutionRule;
	frequency?: EBFrequencyCode;
	ultimate_debtor?: EBPartyIdentification;
	ultimate_creditor?: EBPartyIdentification;
	regulatory_reporting?: EBRegulatoryReporting[];
	remittance_information?: EBUnstructuredRemittanceInformation;
}

interface EBCreditTransferTransactionDetails {
	instructed_amount: EBAmountType;
	beneficiary: EBBeneficiary;
	payment_id?: EBPaymentIdentification;
	request_execution_date?: EBRequestedExecutionDate;
	reference_number?: EBReferenceNumber;
	end_date?: EBEndDate;
	execution_rule?: EBExecutionRule;
	frequency?: EBFrequencyCode;
	ultimate_debtor?: EBPartyIdentification;
	ultimate_creditor?: EBPartyIdentification;
	regulatory_reporting?: EBRegulatoryReporting[];
	remittance_information?: EBUnstructuredRemittanceInformation;
	transaction_id?: string;
	transaction_status?: EBPaymentStatus;
}

type EBCurrencyCode = string; // ISO 4217 standard

type EBEndDate = string; // YYYY-MM-DD

type EBEnvironment = 'PRODUCTION' | 'SANDBOX';

interface EBErrorResponse {
	message: string;
	code?: number;
	error?: string;
	detail?: any;
}

interface EBExchangeRate {
	unit_currency?: EBCurrencyCode;
	exchange_rate?: string;
	rate_type?: EBRateType;
	contract_identification?: string;
	instructed_amount?: EBAmountType;
}

type EBExecutionRule = 'FWNG' | 'PREC';

interface EBFinancialInstitutionIdentification {
	bif_fi?: string;
	clearing_system_member_id?: EBClearingSystemMemberIdentification;
	name?: string;
}

type EBFrequencyCode = 'DAIL' | 'MNTH' | 'QUTR' | 'SEMI' | 'TOMN' | 'WEEK' | 'YEAR';

interface EBGenericIdentification {
	identification: string;
	scheme_name: EBSchemeName;
	issuer?: string;
}

export interface EBGetApplicationResponse {
	name: string;
	description?: string;
	kid: string;
	environment: EBEnvironment;
	redirect_urls: string[];
	active: boolean;
	countries: string[];
	services: EBService[];
}

export interface EBGetAspspsResponse {
	aspsps: EBASPSPData[];
}

interface EBGetPaymentResponse {
	payment_id: string;
	status: EBPaymentStatus;
	payment_details: EBPaymentRequestResourceDetails;
	payment_type: EBPaymentType;
	aspsp: EBASPSP;
	final_status: boolean;
	status_reason_information?: EBStatusReasonInformation;
	psu_id_hash: string;
}

interface EBGetPaymentTransactionResponse {
	payment_id: string;
	transaction_details: EBCreditTransferTransactionDetails;
}

export interface EBGetSessionResponse {
	status: EBSessionStatus;
	accounts: string[];
	accounts_data: EBSessionAccount[];
	aspsp: EBASPSP;
	psu_type: EBPSUType;
	psu_id_hash: string;
	access: EBAccess;
	created: string;
	authorized?: string;
	closed?: string;
}

export interface EBHalBalances {
	balances: EBBalanceResource[];
}

export interface EBHalTransactions {
	transactions: EBTransaction[];
	continuation_key?: string;
}

export type EBPSUType = 'business' | 'personal';

interface EBPartyIdentification {
	name?: string;
	postal_address?: EBPostalAddress;
	organisation_id?: EBGenericIdentification;
	private_id?: EBGenericIdentification;
	contact_details?: EBContactDetails;
}

interface EBPaymentIdentification {
	instruction_id?: string;
	end_to_end_id?: string;
}

type EBPaymentInformationId = string;

interface EBPaymentRequestResource {
	payment_information_id?: EBPaymentInformationId;
	payment_type_information?: EBPaymentTypeInformation;
	debtor?: EBPartyIdentification;
	debtor_account?: EBGenericIdentification;
	debtor_agent?: EBFinancialInstitutionIdentification;
	debtor_currency?: string;
	purpose?: EBCategoryPurposeCode;
	charge_bearer?: EBChargeBearerCode;
	credit_transfer_transaction: EBCreditTransferTransaction[];
}

interface EBPaymentRequestResourceDetails {
	payment_information_id?: EBPaymentInformationId;
	payment_type_information?: EBPaymentTypeInformation;
	debtor?: EBPartyIdentification;
	debtor_account?: EBGenericIdentification;
	debtor_agent?: EBFinancialInstitutionIdentification;
	debtor_currency?: string;
	purpose?: EBCategoryPurposeCode;
	charge_bearer?: EBChargeBearerCode;
	credit_transfer_transaction?: EBCreditTransferTransaction[];
}

type EBPaymentStatus =
	| 'ACCC'
	| 'ACCP'
	| 'ACCR'
	| 'ACPT'
	| 'ACSC'
	| 'ACSP'
	| 'ACTC'
	| 'ACWC'
	| 'ACWP'
	| 'CNCL'
	| 'NULL'
	| 'PACR'
	| 'PART'
	| 'PDCR'
	| 'PDNG'
	| 'RCVD'
	| 'RJCR'
	| 'RJCT';

type EBPaymentType =
	| 'BULK_DOMESTIC'
	| 'BULK_DOMESTIC_SE_GIRO'
	| 'BULK_SEPA'
	| 'CROSSBORDER'
	| 'DOMESTIC'
	| 'DOMESTIC_SE_GIRO'
	| 'INST_SEPA'
	| 'INTERNAL'
	| 'SEPA';

interface EBPaymentTypeInformation {
	instruction_priority?: EBPriorityCode;
	service_level?: EBServiceLevelCode;
	category_purpose?: EBCategoryPurposeCode;
	local_instrument: string;
}

interface EBPostalAddress {
	address_type?: EBAddressType;
	department?: string;
	sub_department?: string;
	street_name?: string;
	building_number?: string;
	post_code?: string;
	town_name?: string;
	country_sub_division?: string;
	country?: string;
	address_line?: string[];
}

type EBPriorityCode = 'EXPR' | 'HIGH' | 'NORM';

type EBPurposeCode = 'ACCT' | 'CASH' | 'COMC' | 'CPKC' | 'TRPT';

type EBRateType = 'AGRD' | 'SALE' | 'SPOT';

type EBReferenceNumber = string;

type EBReferenceNumberScheme = 'BERF' | 'FIRF' | 'INTL' | 'NORF' | 'SDDM' | 'SEBG';

interface EBRegulatoryAuthority {
	country: string;
	name: string;
}

interface EBRegulatoryReporting {
	authority: EBRegulatoryAuthority;
	details: EBRegulatoryReportingDetails;
}

interface EBRegulatoryReportingCode {
	value: string;
	description: string;
}

interface EBRegulatoryReportingDetails {
	amount?: EBAmountType;
	code?: string;
	information: string;
}

interface EBRemittanceInformationLineInfo {
	min_length?: number;
	max_length?: number;
	pattern?: string;
}

type EBRequestedExecutionDate = string; // YYYY-MM-DD

interface EBResponsePaymentType {
	payment_type: EBPaymentType;
	max_transactions?: number;
	currencies?: string[];
	debtor_account_required?: boolean;
	debtor_account_schemas?: EBSchemeName[];
	creditor_account_schemas?: EBSchemeName[];
	priority_codes?: EBPriorityCode[];
	charge_bearer_values?: EBChargeBearerCode[];
	creditor_country_required?: boolean;
	creditor_name_required?: boolean;
	creditor_postal_address_required?: boolean;
	remittance_information_required?: boolean;
	remittance_information_lines?: EBRemittanceInformationLineInfo[];
	debtor_currency_required?: boolean;
	debtor_contact_email_required?: boolean;
	debtor_contact_phone_required?: string;
	creditor_agent_bic_fi_required?: boolean;
	creditor_agent_clearing_system_member_id_required?: boolean;
	allowed_auth_methods?: string[];
	regulatory_reporting_codes?: EBRegulatoryReportingCode[];
	regulatory_reporting_code_required?: boolean;
	reference_number_supported?: boolean;
	referece_number_schemas?: EBReferenceNumberScheme[];
	requested_execution_date_supported?: boolean;
	requested_execution_date_max_period?: number;
	remittance_reference_supported?: boolean;
	final_successful_statuses?: EBPaymentStatus[];
	psu_type: EBPSUType;
}

interface EBSandboxInfo {
	users?: EBSandboxUser[];
}

interface EBSandboxUser {
	username?: string;
	password?: string;
	otp?: string;
}

type EBSchemeName =
	| 'ARNU'
	| 'BANK'
	| 'BBAN'
	| 'BGNR'
	| 'CCPT'
	| 'CHID'
	| 'COID'
	| 'CPAN'
	| 'CUSI'
	| 'CUST'
	| 'DRLC'
	| 'DUNS'
	| 'EMPL'
	| 'CS1G'
	| 'IBAN'
	| 'MIBN'
	| 'NIDN'
	| 'OAUT'
	| 'OTHC'
	| 'OTHI'
	| 'PGNR'
	| 'SOSE'
	| 'SREN'
	| 'SRET'
	| 'TXID';

type EBService = 'AIS' | 'PIS';

type EBServiceLevelCode =
	| 'BKTR'
	| 'G001'
	| 'G002'
	| 'G003'
	| 'G004'
	| 'NUGP'
	| 'NURG'
	| 'PRPT'
	| 'SDVA'
	| 'SEPA'
	| 'SVDE'
	| 'URGP'
	| 'URNS';

interface EBSessionAccount {
	uid: string;
	identification_hash: string;
	identifications_hashes: string[];
}

type EBSessionStatus =
	| 'AUTHORIZED'
	| 'CANCELLED'
	| 'CLOSED'
	| 'EXPIRED'
	| 'INVALID'
	| 'PENDING_AUTHORIZATION'
	| 'RETURNED_FROM_BANK'
	| 'REVOKED';

export interface EBStartAuthorizationRequest {
	access: EBAccess;
	aspsp: EBASPSP;
	state: string;
	redirect_url: string;
	psu_type?: EBPSUType;
	auth_method?: string;
	credentials?: object;
	credentials_autosubmit?: boolean;
	language?: string;
	psu_id?: string;
}

export interface EBStartAuthorizationResponse {
	url: string;
	authorization_id: string;
	psu_id_hash: string;
}

interface EBStatusReasonInformation {
	status_reason_code: string;
	status_reason_description: string;
}

interface EBSuccessResponse {
	message?: 'OK';
}

interface EBTransaction {
	entry_reference?: string;
	merchant_category_code?: string;
	transaction_amount: EBAmountType;
	creditor?: EBPartyIdentification;
	creditor_account?: EBAccountIdentification;
	creditor_agent?: EBFinancialInstitutionIdentification;
	debtor?: EBPartyIdentification;
	debtor_account?: EBAccountIdentification;
	debtor_agent?: EBFinancialInstitutionIdentification;
	bank_transaction_code?: EBBankTransactionCode;
	credit_debit_indicator: EBCreditDebitIndicator;
	status: EBTransactionStatus;
	booking_date?: string;
	value_date?: string;
	transaction_date?: string;
	balance_after_transaction?: EBAmountType;
	reference_number?: string;
	reference_number_schema?: EBReferenceNumberScheme;
	remittance_information?: string[];
	debtor_account_additional_identification?: EBGenericIdentification;
	creditor_account_additional_identification?: EBGenericIdentification;
	exchange_rate?: EBExchangeRate;
	note?: string;
	transaction_id?: string;
}

export type EBTransactionStatus = 'BOOK' | 'CNCL' | 'HOLD' | 'OTHR' | 'PDNG' | 'RJCT' | 'SCHD';

type EBTransactionsFetchStrategy = 'default' | 'longest';

type EBUnstructuredRemittanceInformation = string[];

export type EBUsage = 'ORGA' | 'PRIV';
