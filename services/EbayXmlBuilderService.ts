import {Card} from "#types/payload";
import type {EbayLocalizedAspect, EbayXmlConditionDescriptor, EbayXmlConditionDetails} from "#types/ebay";
import EbayService from "#services/EbayService";
import ImageUploadService from "#services/ImageUploadService";

export default class EbayXmlBuilderService {
    /* UTILS */
    private static computeTitle(card: Card): string {
        return `${card.name} ${card.number} - ${card.set} Carte Pokémon ${card.language}`;
    }

    private static getCardQuantity(card: Card): number {
        if(card.startPrice) {
            return 1
        }
        return card.quantity || 1
    }

    /* BUILDS */
    public static buildRequesterCredentialsXML(): string {
        const ebayAuthToken: string = EbayService.EBAY_AUTH_TOKEN;
        return `<RequesterCredentials>\n<eBayAuthToken>${ebayAuthToken}</eBayAuthToken>\n</RequesterCredentials>\n`;
    }

    public static async buildPictureDetailsXML(card: Card): Promise<string> {
        let pictureDetailsXML: string = '<PictureDetails>\n';

        // Check if there are images in the card
        if (card.images && card.images.length > 0) {
            // Download images to Imgur
            const uploadedImageURLs: string[] = await ImageUploadService.uploadMultipleImages(card.images);

            // Constructs the <PictureURL> tag for each uploaded image URL
            uploadedImageURLs.forEach((imageURL: string): void => {
                pictureDetailsXML += `<PictureURL>${imageURL}</PictureURL>\n`;
            });
        }

        pictureDetailsXML += '</PictureDetails>\n';
        return pictureDetailsXML;
    }

    public static buildTitleXML(card: Card): string {
        return `<Title>${this.computeTitle(card)}</Title>`;
    }

    public static buildConditionXML(card: Card): string {
        const conditionDetails: EbayXmlConditionDetails = EbayService.getConditionDetails(card);
        let conditionXML: string = `<ConditionID>${conditionDetails.ConditionID}</ConditionID>\n`;

        if (conditionDetails.ConditionDescriptors.length > 0) {
            conditionXML += `<ConditionDescriptors>\n`;
            conditionDetails.ConditionDescriptors.forEach((descriptor: EbayXmlConditionDescriptor) => {
                conditionXML += `<ConditionDescriptor>\n`;
                conditionXML += `<Name>${descriptor.Name}</Name>\n`;
                conditionXML += `<Value>${descriptor.Value}</Value>\n`;
                conditionXML += `</ConditionDescriptor>\n`;
            });
            conditionXML += `</ConditionDescriptors>\n`;
        }

        return conditionXML;
    }

    public static buildItemSpecificsXML(specifics: EbayLocalizedAspect[]): string {
        let itemSpecificsXML: string = '<ItemSpecifics>\n';

        specifics.forEach((specific: EbayLocalizedAspect) => {
            itemSpecificsXML += `    <NameValueList>\n`;
            itemSpecificsXML += `        <Name>${specific.name}</Name>\n`;
            itemSpecificsXML += `        <Value>${specific.value}</Value>\n`;
            itemSpecificsXML += `    </NameValueList>\n`;
        });

        itemSpecificsXML += '</ItemSpecifics>\n';
        return itemSpecificsXML;
    }

    public static buildDescriptionXML(card: Card): string {
        const titleDescription: string = this.computeTitle(card);
        const contactInfo: string = "Pour plus d'informations, n'hésitez pas à me contacter sur eBay ou sur mon adresse mail : dibopokemon@gmail.com";

        let descriptionXML: string = `<Description>\n`;
        descriptionXML += `<![CDATA[\n`;
        descriptionXML += `${titleDescription}\n`;
        descriptionXML += `${contactInfo}\n`;
        descriptionXML += `]]>\n`;
        descriptionXML += `</Description>\n`;

        return descriptionXML;
    }

    public static buildListingDetailsXML(card: Card): string {
        let listingDetailsXML: string = '';
        if (card.startPrice) {
            const listingDuration: string = 'Days_7';
            const listingType: string = 'Chinese';
            listingDetailsXML += `<ListingDuration>${listingDuration}</ListingDuration>\n`;
            listingDetailsXML += `<ListingType>${listingType}</ListingType>\n`;
            listingDetailsXML += `<StartPrice currencyID="EUR">${card.startPrice}</StartPrice>\n`;

            if (card.price && card.price !== card.startPrice) {
                listingDetailsXML += `<BuyItNowPrice>${card.price}</BuyItNowPrice>\n`;
            }
        } else if (card.price) {
            const listingDuration: string = 'GTC';
            const listingType: string = 'FixedPriceItem';
            listingDetailsXML += `<ListingDuration>${listingDuration}</ListingDuration>\n`;
            listingDetailsXML += `<ListingType>${listingType}</ListingType>\n`;
            listingDetailsXML += `<StartPrice currencyID="EUR">${card.price}</StartPrice>\n`;
        }

        // Add the quantity
        listingDetailsXML += `<Quantity>${this.getCardQuantity(card)}</Quantity>\n`;

        // Add the best offer option
        const isAuctionWithBuyItNow: boolean = card.startPrice !== undefined && card.price !== undefined;
        if(!isAuctionWithBuyItNow) {
            listingDetailsXML += `<BestOfferDetails>\n<BestOfferEnabled>true</BestOfferEnabled>\n</BestOfferDetails>\n`;

            if(card.minimumBestOfferAmount) {
                listingDetailsXML += `<ListingDetails>\n<MinimumBestOfferPrice>${card.minimumBestOfferAmount}</MinimumBestOfferPrice>\n</ListingDetails>\n`;
            }
        }

        return listingDetailsXML;
    }

    public static replaceSpecialXmlCharacters(input: string): string {
        return input
            .replace(/&/g, "&amp;")
    }

    public static formattedCard(card: Card): Card {
        // Limit name to 80 characters
        let formattedName = card.name.slice(0, 80);
        // Replaces special characters for 'name' and 'set'
        formattedName = this.replaceSpecialXmlCharacters(formattedName);
        const formattedSet = this.replaceSpecialXmlCharacters(card.set);

        return {
            ...card,
            name: formattedName,
            set: formattedSet,
        };
    }


    public static async buildAddItemXML(card: Card): Promise<string> {
        const formattedCard: Card = this.formattedCard(card);
        const requesterCredentialsXML: string = this.buildRequesterCredentialsXML();
        const pictureDetailsXML: string = await this.buildPictureDetailsXML(formattedCard);
        const titleXML: string = this.buildTitleXML(formattedCard);
        const conditionXML: string = this.buildConditionXML(formattedCard);
        const cardSpecifics: EbayLocalizedAspect[] | null = await EbayService.findCardSpecifics(formattedCard);

        let itemSpecificsXML: string = '';

        if (cardSpecifics) {
            itemSpecificsXML = this.buildItemSpecificsXML(cardSpecifics);
        }

        const descriptionXML: string = this.buildDescriptionXML(formattedCard);
        const listingDetailsXML: string = this.buildListingDetailsXML(formattedCard);

        const additionalXML = `
<Country>FR</Country>
<Currency>EUR</Currency>
<DispatchTimeMax>5</DispatchTimeMax>
<PostalCode>35000</PostalCode>
<ReturnPolicy>
    <ReturnsAcceptedOption>ReturnsNotAccepted</ReturnsAcceptedOption>
</ReturnPolicy>
<ShippingDetails>
    <ShippingType>Flat</ShippingType>
    <ShippingServiceOptions>
        <ShippingServicePriority>1</ShippingServicePriority>
        <ShippingServiceCost currencyID="EUR">1.80</ShippingServiceCost>
        <ShippingService>FR_PostOfficeLetter</ShippingService>
    </ShippingServiceOptions>
    <ShippingServiceOptions>
        <ShippingServicePriority>2</ShippingServicePriority>
        <ShippingServiceCost currencyID="EUR">2.35</ShippingServiceCost>
        <ShippingService>FR_PostOfficeLetterFollowed</ShippingService>
    </ShippingServiceOptions>
</ShippingDetails>
`;

        // Assemble the complete XML
        return `<?xml version="1.0" encoding="utf-8"?>
<AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    ${requesterCredentialsXML}
    <ErrorLanguage>en_US</ErrorLanguage>
    <WarningLevel>High</WarningLevel>
    <Item>
        <Site>France</Site>
        ${pictureDetailsXML}
        ${titleXML}
        <PrimaryCategory>
            <CategoryID>183454</CategoryID>
        </PrimaryCategory>
        ${conditionXML}
        ${itemSpecificsXML}
        ${descriptionXML}
        ${listingDetailsXML}
        ${additionalXML}
    </Item>
</AddItemRequest>`;
    }
}
