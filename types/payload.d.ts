import type {EbayConditions} from "#types/ebay";

type Card = {
    name: string;
    number: string;
    set: string;
    language: string;
    images: string[];
    isGraded: boolean;
    grade?: number;
    gradeCompany?: string;
    startPrice?: number;
    price?: number;
    condition?: EbayConditions;
    quantity?: number;
    minimumBestOfferAmount?: number;
};

export type {
    Card
}



