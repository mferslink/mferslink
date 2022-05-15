interface BaseInfoType {
    id: string;
    name: string;
    collectionImage: string;
    likes?: number;
    liked: boolean;
    items: number;
    owners: number;
    floorPrice: number;
    opensea?: string;
    discord?: string;
    twitter?: string;
    uploaderName: string;
    uploaderID: string;
    websiteStatus: SecurityBaseType;
    contractStatus: SecurityBaseType;
}
type SecurityBaseType = 'Verified' | 'Unknown' | 'Unverified';

export {
    BaseInfoType,
    SecurityBaseType
}
