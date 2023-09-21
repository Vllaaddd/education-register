import Center from "@/components/Center";
import Header from "@/components/Header";
import styled from "styled-components";

const StyledTitle = styled.h1`
    text-align: center;
`;

export default function HomePage(){
    return(
        <>
            <Header />
            <Center>
                <StyledTitle>Реєстр навчань AJAX</StyledTitle>
            </Center>
        </>
    )
}