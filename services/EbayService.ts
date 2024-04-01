import {configDotenv} from "dotenv";
import {
    EbayEbayFindItemsByKeywordsResponse,
    EbayItem,
    EbayItemDetailResponse,
    EbayLocalizedAspect,
    EbayOAuthTokenResponse,
    EbayXmlConditionDescriptor,
    EbayXmlConditionDetails
} from "#types/ebay";
import type {Card} from "#types/payload";
import {conditionDescriptor} from "#constants/conditionDescriptors";
import {graders} from "#constants/graders";
import {grades} from "#constants/grades";
import {ungradedConditions} from "#constants/ungradedConditions";


configDotenv()

type EbayEnv = 'sandbox' | 'production';

export default class EbayService {
    /* SANDBOX */
    static EBAY_API_URL_SANDBOX: string = 'https://api.sandbox.ebay.com/ws/api.dll';
    static EBAY_APP_ID_SANDBOX: string = process.env.EBAY_APP_ID_SANDBOX || '';
    static EBAY_DEV_ID_SANDBOX: string = process.env.EBAY_DEV_ID_SANDBOX || '';
    static EBAY_CERT_ID_SANDBOX: string = process.env.EBAY_CERT_ID_SANDBOX || '';
    static EBAY_AUTH_TOKEN_SANDBOX: string = process.env.EBAY_AUTH_TOKEN_SANDBOX || '';

    /* PRODUCTION */
    static EBAY_API_URL_PROD: string = 'https://api.ebay.com/ws/api.dll';
    static EBAY_APP_ID_PROD: string = process.env.EBAY_APP_ID_PROD || '';
    static EBAY_DEV_ID_PROD: string = process.env.EBAY_DEV_ID_PROD || '';
    static EBAY_CERT_ID_PROD: string = process.env.EBAY_CERT_ID_PROD || '';
    static EBAY_AUTH_TOKEN_PROD: string = process.env.EBAY_AUTH_TOKEN_PROD || '';

    // SANDBOX OR PRODUCTION
    static EBAY_ENV: EbayEnv = 'production';

    /* COMPUTED ENV WITH EBAY ENV */
    static EBAY_API_URL: string = this.EBAY_ENV === 'sandbox' ? this.EBAY_API_URL_SANDBOX : this.EBAY_API_URL_PROD;
    static EBAY_APP_ID: string = this.EBAY_ENV === 'sandbox' ? this.EBAY_APP_ID_SANDBOX : this.EBAY_APP_ID_PROD;
    static EBAY_DEV_ID: string = this.EBAY_ENV === 'sandbox' ? this.EBAY_DEV_ID_SANDBOX : this.EBAY_DEV_ID_PROD;
    static EBAY_CERT_ID: string = this.EBAY_ENV === 'sandbox' ? this.EBAY_CERT_ID_SANDBOX : this.EBAY_CERT_ID_PROD;
    static EBAY_AUTH_TOKEN: string = this.EBAY_ENV === 'sandbox' ? this.EBAY_AUTH_TOKEN_SANDBOX : this.EBAY_AUTH_TOKEN_PROD


    static EBAY_OAUTH_TOKEN: string | undefined = undefined;

    public static setEnv(env: EbayEnv): void {
        this.EBAY_ENV = env;
    }

    public static async addItem(xmlData: string): Promise<void> {
        const response: Response = await fetch(this.EBAY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml',
                'X-EBAY-API-SITEID': '71',
                'X-EBAY-API-CALL-NAME': 'AddItem',
                'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
                'X-EBAY-API-APP-NAME': this.EBAY_APP_ID,
                'X-EBAY-API-DEV-NAME': this.EBAY_DEV_ID,
                'X-EBAY-API-CERT-NAME': this.EBAY_CERT_ID,
            },
            body: xmlData,
        });

        const textResponse: string = await response.text();
        const hasError: boolean = !textResponse.includes('Fees');

        if(hasError) {
            console.error("Failed to add item to Ebay", textResponse);
        } else {
            console.log("Ebay Item Added Successfully");
        }
    }

    public static async getOAuthToken(): Promise<string | undefined> {
        const credentials: string = Buffer.from(`${this.EBAY_APP_ID}:${this.EBAY_CERT_ID}`).toString('base64');
        const url: string = 'https://api.ebay.com/identity/v1/oauth2/token';

        try {
            const response: Response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`,
                },
                body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
            });

            const data: EbayOAuthTokenResponse = await response.json();
            if (data.access_token) {
                console.log('OAuth Token obtained successfully');
                return data.access_token;
            } else {
                console.error('Failed to obtain OAuth Token', data);
                return undefined;
            }
        } catch (error) {
            console.error('Error while fetching OAuth Token:', error);
            return undefined;
        }
    }

    public static async setOAuthToken(): Promise<void> {
        if (!this.EBAY_OAUTH_TOKEN) {
            this.EBAY_OAUTH_TOKEN = await this.getOAuthToken();
        }
    }

    public static async findSimilarItems(keywords: string): Promise<EbayItem[] | undefined> {
        const encodedKeywords: string = encodeURIComponent(keywords);

        const endpoint: string = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${this.EBAY_APP_ID}&GLOBAL-ID=EBAY-FR&keywords=${encodedKeywords}&RESPONSE-DATA-FORMAT=JSON`;

        const response: Response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const jsonResponse: EbayEbayFindItemsByKeywordsResponse = await response.json();
        return jsonResponse.findItemsByKeywordsResponse[0].searchResult[0].item
    }

    public static async findItemDetails(itemId: string): Promise<EbayItemDetailResponse | undefined> {
        if (!this.EBAY_OAUTH_TOKEN) {
            await this.setOAuthToken();
        }

        const url: string = `https://api.ebay.com/buy/browse/v1/item/v1|${itemId}|0?fieldgroups=ADDITIONAL_SELLER_DETAILS`;
        const response: Response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.EBAY_OAUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Failed to get item details', await response.text());
            return undefined;
        }

        return await response.json();
    }

    public static async findCardSpecifics(card: Card): Promise<EbayLocalizedAspect[] | null> {
        const keywords: string[] = [
            `${card.name} ${card.number} ${card.set} ${card.language}`,
            (`${card.set} ${card.number}`).toLowerCase(),
            (`${card.name} ${card.set}`).toLowerCase(),
            `pokemon ${card.number}`
        ];


        let items: EbayItem[] | undefined;

        for (const keyword of keywords) {
            items = await this.findSimilarItems(keyword);

            console.log(`Using keywords "${keyword}", found ${items?.length || 0} items`);
        }


        if (!items || items.length === 0) {
            console.error('Failed to find similar items');
            return null;
        }

        // Limit the search to the first 3 listings or fewer
        const limit: number = Math.min(items.length, 1);

        await this.setOAuthToken();

        const detailsList: EbayItemDetailResponse[] = [];
        let foundGameSpecific: boolean = false;


        for (let i = 0; i < items.length; i++) {
            const item: EbayItem = items[i];
            const itemId: string = item.itemId[0];
            const details: EbayItemDetailResponse | undefined = await this.findItemDetails(itemId);

            if (details && details.localizedAspects) {
                detailsList.push(details);

                // Check if 'Game' is among the aspects and mark as found
                const hasGameSpecifics: boolean = details.localizedAspects.some(aspect => aspect.name === 'Jeu');
                foundGameSpecific = foundGameSpecific || hasGameSpecifics;

                // If 'Game' is found and the limit is reached or exceeded, stop the loop
                if (foundGameSpecific && i >= (limit - 1)) {
                    break;
                }
            }
        }

        if (detailsList.length === 0) {
            console.error('Failed to find item details for any of the items');
            return null;
        }

        // Merge all 'localizedAspects' avoiding duplicates
        const allLocalizedAspects: EbayLocalizedAspect[] = [];
        const aspectNames: Set<string> = new Set();

        detailsList.forEach(detail => {
            if(detail.localizedAspects) {
                detail.localizedAspects.forEach(aspect => {
                    const aspectNameWithoutSpaces: string = aspect.name.replace(/\s/g, '');
                    if (!aspectNames.has(aspectNameWithoutSpaces)) {
                        allLocalizedAspects.push(aspect);
                        aspectNames.add(aspectNameWithoutSpaces);
                    }
                });
            }
        });

        return allLocalizedAspects;
    }

    public static getGradedConditionDetails(card: Card): EbayXmlConditionDetails {
        const conditionDescriptors: EbayXmlConditionDescriptor[] = []

        const grader: number | undefined = card.gradeCompany ? graders[card.gradeCompany] : undefined;
        const grade: number | undefined = card.grade ? grades[card.grade] : undefined;

        if(grader) {
            conditionDescriptors.push({ Name: conditionDescriptor.ProfessionalGrader, Value: grader });
        }

        if(grade) {
            conditionDescriptors.push({ Name: conditionDescriptor.Grade, Value: grade });
        }


        return {
            ConditionID: 2750,
            ConditionDescriptors: conditionDescriptors
        };
    }


    public static getUngradedConditionDetails(card: Card): EbayXmlConditionDetails {
        const conditionDescriptors: EbayXmlConditionDescriptor[] = []

        const ungradedCondition: number | undefined = card.condition ? ungradedConditions[card.condition] : undefined;

        if(ungradedCondition) {
            conditionDescriptors.push({ Name: conditionDescriptor.CardCondition, Value: ungradedCondition });
        }

        return {
            ConditionID: 4000,
            ConditionDescriptors: conditionDescriptors
        };
    }

    public static getConditionDetails(card: Card): EbayXmlConditionDetails {
        if (card.isGraded) {
            return this.getGradedConditionDetails(card);
        } else {
            return this.getUngradedConditionDetails(card);
        }
    }
}
