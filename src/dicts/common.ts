export type LooseObj = {
    [key: string]: string;
};

export enum SortType {
    Popular = '(likes + comments)',
    New = 'createdTime'
}

export const SortTypeList = [
    {
        name: 'app.common.popular',
        value: SortType.Popular
    },
    {
        name: 'app.common.new',
        value: SortType.New
    }
];
