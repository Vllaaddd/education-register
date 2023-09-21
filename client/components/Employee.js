import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { styled } from "styled-components"

const Wrapper = styled.div`
    display: flex;
    align-items:center;
    justify-content: center;
    gap: 30px;
    border: none;
    border-radius: 10px;
    padding: 10px;
    background: #fff;

    p{
        position: relative;
    }

    p:after{
        content: '';
        position: absolute;
        top: 0;
        right: -15px;
        border: 1px solid #999;
        height: 100%;
    }
`;

const StyledParagraph = styled.span`
    text-align: center;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #111;
`;

export default function Employee({_id, fullName, status, startOfWork, profession, allEducations, schedule}){

    const [educations, setEducations] = useState([])

    useEffect(() => {
        allEducations.map(educationId => {
            try {
                axios.get(`http://localhost:5000/education/${educationId}`).then(res => {
                    const education = res.data;
                    if(education){
                        setEducations((prevEducations) => [...prevEducations, education])
                    }else{
                        console.log('Немає навчання з таким id');
                    }
                }).catch(err => {
                    console.log('Навчання не знайдено');
                })
            } catch (error) {
                console.log('Навчання не знайдено');
            }
            
        }) 
    }, [])
    
    const workStatus = status === true ? 'Працює' : 'Не працює'

    return(
        <>
            <StyledLink href={`/employees/${_id}`}>
                <Wrapper>
                    <p>{fullName}</p>
                    <p>{workStatus}</p>
                    <p>{profession}</p>
                    <p>{schedule}</p>
                    {educations.length > 0 && (
                        <ul>
                            {educations.map((education, i) => (
                                <li key={i}>{education.name}</li>
                            ))}
                        </ul>
                    )}
                    {educations.length === 0 && (
                        <StyledParagraph>Не пройшов жодного навчання</StyledParagraph>
                    )}
                </Wrapper>
            </StyledLink>
        </>
        
    )
}