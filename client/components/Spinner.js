import SyncLoader from "react-spinners/SyncLoader";
import { styled } from "styled-components";

const Wrapper = styled.div`
    ${props => props.fullwidth ? `
        display: flex;
        justify-content: center;
        margin: 20px 0;
    ` : ``}
`;

export default function Spinner({fullwidth}){
    return(
        <Wrapper fullwidth={fullwidth}>
            <SyncLoader speedMultiplier={1} color={'#555'}/>
        </Wrapper>
       
    )
}