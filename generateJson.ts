import fs from 'fs';
import EbayService from "#services/EbayService";
import type { EbayItem, EbayItemDetailResponse, EbayLocalizedAspect } from "#types/ebay";
import type { Card } from "#types/payload";

type BaseInfo = {
    keyword: string;
    images: string[];
};

const baseInfos: BaseInfo[] = [
    {
        keyword: '55/102',
        images: [
            'IMG_3018.jpg',
            'IMG_3019.jpg',
        ]
    }
];

const ebayItems: Card[] = [];

for (const baseInfo of baseInfos) {
    const items: EbayItem[] | undefined = await EbayService.findSimilarItems(baseInfo.keyword);
    if (items) {
        for (const item of items) {
            const itemId: string = item.itemId[0];
            const details: EbayItemDetailResponse | undefined = await EbayService.findItemDetails(itemId);
            if (details) {
                const ebayItem: Card = {
                    name: details.localizedAspects.find((aspect: EbayLocalizedAspect): boolean => aspect.name === 'Personnage')?.value || '',
                    number: details.localizedAspects.find((aspect: EbayLocalizedAspect): boolean => aspect.name === 'Numéro de carte')?.value || '',
                    set: details.localizedAspects.find((aspect: EbayLocalizedAspect): boolean => aspect.name === 'Set')?.value || '',
                    language: details.localizedAspects.find((aspect: EbayLocalizedAspect): boolean => aspect.name === 'Langue')?.value || '',
                    images: baseInfo.images,
                    isGraded: false,
                    startPrice: 1,
                    condition: 'Lightly Played (Excellent)'
                };

                // Check if all necessary fields of ebayItem are filled
                if (ebayItem.name && ebayItem.number && ebayItem.set && ebayItem.language) {
                    ebayItems.push(ebayItem);
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
