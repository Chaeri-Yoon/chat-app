import styled from "styled-components";
import styles from "../styles/styles";

const Button = styled.button`
    width: 50px;
`;
const AvatarContainer = styled.div`
    margin-right: 10px;
    aspect-ratio: 1 / 1;
    border-radius: 10px;
    background-color: ${styles.darkGrey};
`;
const Avatar = styled.img<{ index: number }>`
    width: 100%;
    aspect-ratio: 1 / 1;
    background-image: url(/avatars/avatar_${props => props.index}.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    border-radius: 10px;
`;
interface IAvatarContainer {
    index: number,
    clickHandler?: () => any
}
export default ({ index, clickHandler }: IAvatarContainer) => {
    return (
        <Button type="button" disabled={!clickHandler} onClick={clickHandler}>
            <AvatarContainer>
                <Avatar index={index} />
            </AvatarContainer>
        </Button>
    )
}