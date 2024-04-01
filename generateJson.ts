import fs from 'fs';
import EbayService from "#services/EbayService";
import type {EbayItem, EbayItemDetailResponse, EbayLocalizedAspect} from "#types/ebay";
import type {Card} from "#types/payload";

type BaseInfo = {
    keyword: string;
    images: string[];
};

const baseInfos: BaseInfo[] = [
    {
        keyword: 'Flobio 36/106',
        images: [
            'IMG_3142.jpg',
            'IMG_3143.jpg',
        ]
    },
    {
        keyword: 'Chuchmur 82/101',
        images: [
            'IMG_3144.jpg',
            'IMG_3145.jpg',
        ]
    },
    {
        keyword: '74/101',
        images: [
            'IMG_3146.jpg',
            'IMG_3147.jpg',
        ]
    },
    {
        keyword: 'Meditikka 65/101',
        images: [
            'IMG_3148.jpg',
            'IMG_3149.jpg',
        ]
    },
    {
        keyword: 'Doduo 60/101',
        images: [
            'IMG_3150.jpg',
            'IMG_3151.jpg',
        ]
    },
    {
        keyword: 'Spinda 48/101',
        images: [
            'IMG_3152.jpg',
            'IMG_3153.jpg',
        ]
    },
    {
        keyword: 'Excavateur de fossiles 111/123',
        images: [
            'IMG_3154.jpg',
            'IMG_3155.jpg',
        ]
    },
    {
        keyword: 'Keunotor 73/123',
        images: [
            'IMG_3156.jpg',
            'IMG_3157.jpg',
        ]
    },
    {
        keyword: 'Ymphect 59/123',
        images: [
            'IMG_3158.jpg',
            'IMG_3159.jpg',
        ]
    },
    {
        keyword: 'Mustébouée 72/130',
        images: [
            'IMG_3160.jpg',
            'IMG_3161.jpg',
        ]
    },
    {
        keyword: 'Ceriflor 45/130',
        images: [
            'IMG_3162.jpg',
            'IMG_3163.jpg',
        ]
    },
    {
        keyword: 'Blindalys 44/130',
        images: [
            'IMG_3164.jpg',
            'IMG_3165.jpg',
        ]
    },
    {
        keyword: 'Chaglam 83/130',
        images: [
            'IMG_3166.jpg',
            'IMG_3167.jpg',
        ]
    },
    {
        keyword: 'Chenipotte 104/130',
        images: [
            'IMG_3168.jpg',
            'IMG_3169.jpg',
        ]
    },
    {
        keyword: 'Germignon 51/115',
        images: [
            'IMG_3170.jpg',
            'IMG_3171.jpg',
        ]
    },
    {
        keyword: 'Melofée 53/115',
        images: [
            'IMG_3172.jpg',
            'IMG_3173.jpg',
        ]
    },
    {
        keyword: 'Lainergie 56/115',
        images: [
            'IMG_3174.jpg',
            'IMG_3175.jpg',
        ]
    },
    {
        keyword: 'Axoloto 79/115',
        images: [
            'IMG_3176.jpg',
            'IMG_3177.jpg',
        ]
    },
    {
        keyword: 'Limagma 73/115',
        images: [
            'IMG_3178.jpg',
            'IMG_3179.jpg',
        ]
    },
    {
        keyword: 'Porygon 69/115',
        images: [
            'IMG_3180.jpg',
            'IMG_3181.jpg',
        ]
    },
    {
        keyword: 'Héricendre 45/101',
        images: [
            'IMG_3184.jpg',
            'IMG_3185.jpg',
        ]
    },
    {
        keyword: 'Abo 47/101',
        images: [
            'IMG_3186.jpg',
            'IMG_3187.jpg',
        ]
    },
    {
        keyword: 'Wattouat 54/101',
        images: [
            'IMG_3188.jpg',
            'IMG_3189.jpg',
        ]
    },
    {
        keyword: 'Méthode d\'entraînement du Prof. Orme 79/101',
        images: [
            'IMG_3192.jpg',
            'IMG_3193.jpg',
        ]
    },
    {
        keyword: 'Recherches du professeur Chen 149/165',
        images: [
            'IMG_3194.jpg',
            'IMG_3195.jpg',
        ]
    },
    {
        keyword: 'Piafabec 81/112',
        images: [
            'IMG_3196.jpg',
            'IMG_3197.jpg',
        ]
    },
    {
        keyword: 'Roucool 73/112',
        images: [
            'IMG_3198.jpg',
            'IMG_3199.jpg',
        ]
    },
    {
        keyword: 'Salamèche 58/112',
        images: [
            'IMG_3200.jpg',
            'IMG_3201.jpg',
        ]
    },
    {
        keyword: 'Herbe sauveuse 93/112',
        images: [
            'IMG_3202.jpg',
            'IMG_3203.jpg',
        ]
    },
    {
        keyword: 'Super Ball 92/112',
        images: [
            'IMG_3204.jpg',
            'IMG_3205.jpg',
        ]
    },
];

const ebayItems: Card[] = [];

for (const baseInfo of baseInfos) {
    const items: EbayItem[] | undefined = await EbayService.findSimilarItems(baseInfo.keyword);
    console.log("START SEARCHING FOR: " + baseInfo.keyword)
    if (items) {
        console.log(`Found ${items.length} items for keyword: ${baseInfo.keyword}`)
        const ebayItem: Card = {
            name: '',
            number: '',
            set: '',
            language: '',
            images: baseInfo.images,
            isGraded: false,
            startPrice: 1,
            condition: 'Heavily Played (Poor)'
        };

        for (const item of items) {
            const isLastItem: boolean = item === items[items.length - 1];
            const itemId: string = item.itemId[0];
            const details: EbayItemDetailResponse | undefined = await EbayService.findItemDetails(itemId);


            console.log('LOCALIZED ASPECTS:', details?.localizedAspects);

            // Extract number from title (e.g. 'Nirondelle 80/107' -> '80/107')
            // Using a regular expression to find the first number in "xx/xx" format
            const numberInTitle: string | null = item.title[0].match(/\b\d+\/\d+\b/)?.[0] || null;

            if (details && details.localizedAspects) {
                console.log(`Found details for item ID: ${itemId} successfully!`)
                console.log(`Found ${details.localizedAspects.length} localized aspects for item ID: ${itemId} successfully!`)

                // Assign values to ebayItem
                if(!ebayItem.name) ebayItem.name = details.localizedAspects.find((aspect: EbayLocalizedAspect): boolean => aspect.name === 'Personnage')?.value || '';
                if(!ebayItem.number) {
                    ebayItem.number = details.localizedAspects.find((aspect: EbayLocalizedAspect): boolean =>
                        (aspect.name === 'Numéro de carte') || (aspect.name === 'Numéro de pièce fabricant'))
                        ?.value || numberInTitle || '';
                }
                if(!ebayItem.set) ebayItem.set = details.localizedAspects.find((aspect: EbayLocalizedAspect): boolean => aspect.name === 'Set')?.value || '';
                if(!ebayItem.language) ebayItem.language = details.localizedAspects.find((aspect: EbayLocalizedAspect): boolean => aspect.name === 'Langue')?.value || '';

                const missingFields: string[] = [];
                if (!ebayItem.name) missingFields.push('name');
                if (!ebayItem.number) missingFields.push('number');
                if (!ebayItem.set) missingFields.push('set');
                if (!ebayItem.language) missingFields.push('language');

                console.log(`Missing fields: ${missingFields.join(', ')}`);

                console.log('EBAY ITEM:', JSON.stringify(ebayItem, null, 4));

                if(isLastItem && !ebayItem.name) {
                    ebayItem.name = baseInfo.keyword.split(' ')[0]
                }

                // Check if all necessary fields of ebayItem are filled
                if (ebayItem.name && ebayItem.number && ebayItem.set && ebayItem.language) {
                    ebayItems.push(ebayItem);
                    console.log('RESULT EBAY ITEM:', JSON.stringify(ebayItem, null, 4));
                    break; // Stop the loop once a valid item is found
                }
            } else {
                console.log(`No details found for item ID: ${itemId}`);
            }
        }
    } else {
        console.log(`No items found for keyword: ${baseInfo.keyword}`);
    }
}


// Generate JSON file
fs.writeFileSync('items.json', JSON.stringify(ebayItems, null, 4));
