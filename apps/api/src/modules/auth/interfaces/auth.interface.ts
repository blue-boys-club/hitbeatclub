export interface IAuthHash {
    salt?: string;
    hash?: string;
    expired?: Date;
    hashCreated?: Date;
}
