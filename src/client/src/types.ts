export const socketEvent = {
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    UPDATE_ROOMLIST: 'update_rooms',
    RECEIVE_MESSAGE: 'receive_message',
    SEND_MESSAGE: 'send_message'
}
export interface IUserInfo {
    nickname: String;
    avatarNum: number;
}
export type MessageType = 'join' | 'leave' | 'chat' | 'myChat';
export interface IMessage {
    type: MessageType;
    content: IMessageContent;
}
export interface IMessageContent {
    text: string;
    sender: string;
}
export interface IDataState {
    user: IUserInfo;
    room: string;
    roomList: string[];
    chatroomMode: 'Create' | 'Select';
}