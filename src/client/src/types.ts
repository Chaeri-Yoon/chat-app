export const socketEvent = {
    JOIN_ROOM: 'join_room',
    EXIT_ROOM: 'exit_room',
    UPDATE_ROOMLIST: 'update_rooms',
    RECEIVE_MESSAGE: 'receive_message',
    SEND_MESSAGE: 'send_message'
}
export interface IUserInfo {
    nickname: String;
    avatarNum: number;
}
export interface IMessage {
    type: 'join' | 'leave' | 'chat' | 'myChat';
    content?: IMessageContent;
}
export interface IMessageContent {
    text: string;
    sender: IUserInfo;
}
export interface IDataState {
    user: IUserInfo;
    room: string;
    roomList: string[];
    chatroomMode: 'Create' | 'Select';
}