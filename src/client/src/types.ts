export type MessageType = 'Join' | 'Leave' | 'Chat' | 'MyChat';
export type RoomJoinModeType = 'Create' | 'Select';
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
export interface IMessage {
    type: MessageType;
    content: IMessageContent;
}
interface IMessageContent {
    text: string;
    sender: IUserInfo;
}