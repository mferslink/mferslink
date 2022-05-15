export const collectionForm = [
    {
        labelName: 'app.collection.form.name',
        name: 'name',
        required: true,
        rules: [
            {required: true, message: 'please input collection name'}
        ]},
    {
        labelName: 'app.collection.form.contract',
        name: 'contractAddress',
        required: false,
        rules: [
            {required: false, message: 'please input smart contract'}
        ]},
    {
        labelName: 'app.collection.form.website',
        name: 'website', 
        required: true,
        rules: [
            {required: true, message: 'please input website url'},
            {type: 'url', message: 'please input correct website url'}
        ]},
    {
        labelName: 'app.collection.form.twitter',
        name: 'twitter',
        required: true,
        rules: [
            {required: true, message: 'please input twitter url'}
        ]},
    {
        labelName: 'app.collection.form.opensea',
        name: 'opensea',
        required: false,
        rules: [
            {required: false, type: 'url', message: 'please input correct opensea url'}
        ]},
    {
        labelName: 'app.collection.form.discord',
        name: 'discord',
        required: false,
        rules: [
            {required: false, type: 'url', message: 'please input correct discord url'}
        ]}
];

export const articleForm = [
    {
        labelName: 'app.article.modal.caption',
        name: 'title',
        required: true,
        rules: [
            {required: true, message: 'please input article title'}
        ]},
    {
        labelName: 'app.article.modal.desc',
        name: 'description',
        required: true,
        rules: [
            {required: true, message: 'please input article description'}
        ]
    },
    {
        labelName: 'app.article.modal.url',
        name: 'url',
        required: true,
        rules: [
            {required: true, message: 'please input article url'},
            {type: 'url', message: 'please input correct article url'}
        ]
    }
];