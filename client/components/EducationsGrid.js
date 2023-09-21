import { styled } from "styled-components";
import Education from "./Education.js";

const StyledEducationsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;

    @media screen and (min-width: 768px){
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 15px;
`;

export default function EducationsGrid({educations}){

    return(
        <>
            <Title>Всі навчання</Title>
            <StyledEducationsGrid>
                {educations.length > 0 && educations.map((education, i) => (
                    <Education key={i} {...education} />
                ))}
            </StyledEducationsGrid>
        </>
        
    )
}