export enum socketEvent {
    join_room = 'join_room',
    exit_room = 'exit_room',
    receive_message = 'receive_message',
    send_message = 'send_message'
}
export interface IUserInfo {
    nickname: String,
    avatarNum: number
}
export interface IMessage {
    type: 'join' | 'leave' | 'chat' | 'myChat',
    content?: IMessageContent
}
export interface IMessageContent {
    text?: string,
    sender?: IUserInfo
}
export interface IDataState {
    user: IUserInfo;
    chatroomMode: 'Create' | 'Select';
}