type EbayTaxJurisdiction = {
    region: {
        regionName: string;
        regionType: string;
    };
    taxJurisdictionId: string;
};

type EbayTax = {
    taxJurisdiction: EbayTaxJurisdiction;
    taxType: string;
    shippingAndHandlingTaxed: boolean;
    includedInPrice: boolean;
    ebayCollectAndRemitTax: boolean;
};

type EbayLocalizedAspect = {
    type: string;
    name: string;
    value: string;
};

type EbayPaymentMethodBrand = {
    paymentMethodBrandType: string;
};

type EbayPaymentMethod = {
    paymentMethodType: string;
    paymentMethodBrands: EbayPaymentMethodBrand[];
};

type EbayImage = {
    imageUrl: string;
    width: number;
    height: number;
};

type EbayItemLocation = {
    city: string;
    postalCode: string;
    country: string;
};

type EbayConditionDescriptorValue = {
    content: string;
    additionalInfo: string[];
};

type EbayConditionDescriptor = {
    name: string;
    values: EbayConditionDescriptorValue[];
};

type EbaySeller = {
    userId: string;
    username: string;
    feedbackPercentage: string;
    feedbackScore: number;
};

type EbayAvailability = {
    estimatedAvailabilityStatus: string;
    estimatedAvailableQuantity: number;
    estimatedSoldQuantity: number;
};

type EbayRegion = {
    regionName: string;
    regionType: string;
    regionId: string;
};

type EbayShipToLocations = {
    regionIncluded: EbayRegion[];
    regionExcluded: EbayRegion[];
};

type EbayReturnTerms = {
    returnsAccepted: boolean;
};

type EbayPrice = {
    value: string;
    currency: string;
    convertedFromValue?: string;
    convertedFromCurrency?: string;
};

type EbayItemDetailResponse = {
    itemId: string;
    title: string;
    price: EbayPrice;
    categoryPath: string;
    categoryIdPath: string;
    condition: string;
    conditionId: string;
    conditionDescriptors: EbayConditionDescriptor[];
    itemLocation: EbayItemLocation;
    image: EbayImage;
    additionalImages: EbayImage[];
    currentBidPrice: EbayPrice;
    material: string;
    ageGroup: string;
    itemCreationDate: string;
    itemEndDate: string;
    seller: EbaySeller;
    estimatedAvailabilities: EbayAvailability[];
    shipToLocations: EbayShipToLocations;
    returnTerms: EbayReturnTerms;
    taxes: EbayTax[];
    localizedAspects: EbayLocalizedAspect[];
    topRatedBuyingExperience: boolean;
    buyingOptions: string[];
    itemWebUrl: string;
    description: string;
    paymentMethods: EbayPaymentMethod[];
    minimumPriceToBid: EbayPrice;
    uniqueBidderCount: number;
    enabledForGuestCheckout: boolean;
    eligibleForInlineCheckout: boolean;
    lotSize: number;
    legacyItemId: string;
    priorityListing: boolean;
    adultOnly: boolean;
    categoryId: string;
    listingMarketplaceId: string;
};

type EbayOAuthTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
}


type EbayGetSingleItemResponse = {
    Ack: string;
    Item: EbayItemDetails;
}

type EbayItemDetails = {
    ItemID: string;
    Title: string;
    Description: string;
}

type EbayEbayFindItemsByKeywordsResponse = {
    findItemsByKeywordsResponse: EbayFindItemsByKeywords[]
}

type EbayFindItemsByKeywords = {
    ack: string[]
    version: string[]
    timestamp: string[]
    searchResult: EbaySearchResult[]
    paginationOutput: EbayPaginationOutput[]
    itemSearchURL: string[]
}

type EbaySearchResult = {
    "@count": string
    item?: EbayItem[]
}

type EbayItem = {
    itemId: string[]
    title: string[]
    globalId: string[]
    primaryCategory: EbayPrimaryCategory[]
    galleryURL: string[]
    viewItemURL: string[]
    autoPay: string[]
    postalCode?: string[]
    location: string[]
    country: string[]
    shippingInfo: EbayShippingInfo[]
    sellingStatus: EbaySellingStatus[]
    listingInfo: EbayListingInfo[]
    galleryPlusPictureURL?: string[]
    condition: EbayCondition[]
    isMultiVariationListing: string[]
    topRatedListing: string[]
}

type EbayPrimaryCategory = {
    categoryId: string[]
    categoryName: string[]
}

type EbayShippingInfo = {
    shippingServiceCost: EbayShippingServiceCost[]
    shippingType: string[]
    shipToLocations: string[]
}

type EbayShippingServiceCost = {
    "@currencyId": string
    __value__: string
}

type EbaySellingStatus = {
    currentPrice: EbayCurrentPrice[]
    convertedCurrentPrice: EbayConvertedCurrentPrice[]
    bidCount?: string[]
    sellingState: string[]
    timeLeft: string[]
}

type EbayCurrentPrice = {
    "@currencyId": string
    __value__: string
}

type EbayConvertedCurrentPrice = {
    "@currencyId": string
    __value__: string
}

type EbayListingInfo = {
    bestOfferEnabled: string[]
    buyItNowAvailable: string[]
    startTime: string[]
    endTime: string[]
    listingType: string[]
    gift: string[]
    watchCount?: string[]
}

type EbayCondition = {
    conditionId: string[]
    conditionDisplayName: string[]
}

type EbayPaginationOutput = {
    pageNumber: string[]
    entriesPerPage: string[]
    totalPages: string[]
    totalEntries: string[]
}

type EbayXmlConditionDescriptor = {
    Name: number | string
    Value: number | string
}

type EbayXmlConditionDetails = {
    ConditionID: number | string
    ConditionDescriptors: EbayXmlConditionDescriptor[]
}

type EbayConditions =  "Near Mint or Better" | "Excellent" | "Very Good" | "Poor" | "Lightly Played (Excellent)" | "Moderately Played (Very Good)" | "Heavily Played (Poor)"


export type {
    EbayConditions,
    EbayXmlConditionDescriptor,
    EbayXmlConditionDetails,
    EbayTaxJurisdiction,
    EbayTax,
    EbayLocalizedAspect,
    EbayPaymentMethodBrand,
    EbayPaymentMethod,
    EbayImage,
    EbayItemLocation,
    EbayConditionDescriptorValue,
    EbayConditionDescriptor,
    EbaySeller,
    EbayAvailability,
    EbayRegion,
    EbayShipToLocations,
    EbayReturnTerms,
    EbayPrice,
    EbayItemDetailResponse,
    EbayOAuthTokenResponse,
    EbayGetSingleItemResponse,
    EbayItemDetails,
    EbayEbayFindItemsByKeywordsResponse,
    EbayFindItemsByKeywords,
    EbaySearchResult,
    EbayItem,
    EbayPrimaryCategory,
    EbayShippingInfo,
    EbayShippingServiceCost,
    EbaySellingStatus,
    EbayCurrentPrice,
    EbayConvertedCurrentPrice,
    EbayListingInfo,
    EbayCondition,
    EbayPaginationOutput
}
