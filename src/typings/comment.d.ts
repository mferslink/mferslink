interface CommentItemType {
    id: string;
    type?: string;
    commenterProfileImage?: string;
    commenterName: string;
    likes: number,
    liked: boolean,
    comments: number,
    createdTime: string,
    resourceContent?: string[];
    content?: string;
    contentType: string;
    fromContentId: string;
};
interface CommentListType {
    list: CommentItemType[];
};
export {
    CommentListType,
    CommentItemType
}