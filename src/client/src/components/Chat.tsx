import styled from "styled-components";
import styles from "../styles/styles";
import { IMessage } from "../types";
import AvatarContainer from "./AvatarContainer";

const Message = styled.div`
    margin-top: 3px;
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: x-small;
`;
const Container = styled.li<{ messageType: string }>`
    align-self: ${props => props.messageType === 'chat' ? 'flex-start' : 'flex-end'};
    width: 50%;
    display: flex;
    justify-content: ${props => props.messageType === 'chat' ? 'flex-start' : 'flex-end'};
    align-items: flex-start;
    & > ${Message}{
        align-items: ${props => props.messageType === 'chat' ? 'flex-start' : 'flex-end'};
    }
`;
const Nickname = styled.span`
    margin-bottom: 8px;
`;
const Text = styled.span`
    border: 1px solid ${styles.lightGrey};
    padding: 8px;
`;
export default ({ type, content }: IMessage) => {
    return (
        <Container messageType={type}>
            {type === 'Chat' && <AvatarContainer index={content?.sender.avatarNum || 0} />}
            <Message>
                {type === 'Chat' && <Nickname>{content?.sender.nickname}</Nickname>}
                <Text>{content?.text}</Text>
            </Message>
        </Container>
    )
}