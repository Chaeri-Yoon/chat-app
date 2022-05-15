export enum socketEvent {
    enter_room = 'enter_room',
    exit_room = 'exit_room',
    receive_message = 'receive_message',
    send_message = 'send_message'
}
export interface IUserInfo {
    nickname: String,
    avatarNum: number
}
export interface IMessage {
    type: 'enter' | 'leave' | 'chat' | 'myChat',
    text?: string,
    sender?: IUserInfo
}