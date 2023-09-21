import Center from "@/components/Center";
import Header from "@/components/Header";
import axios from "axios";
import { useState } from "react";
import { styled } from "styled-components";

const Title = styled.h2`
    text-align: center;
`;

const StyledFrom = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    width: 400px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
`;

const StyledInput = styled.input`
    width: 100%;
    padding: 12px 24px;
    border: none;
    border-radius: 50px;
    outline: none; 
    background: #EAEEED;

    &:focus{
        opacity: 0.7;
    }
`;

const StyledButton = styled.button`
    width: 100%;
    padding: 12px 48px;
    border-radius: 50px;
    border: none;
    outline: none;
    color: #fff;
    background: #1A1B27;
    cursor: pointer;

    &:hover{
        opacity: 0.8;
    }
`;

export default function ImportEmployees(){

    const [sheetsId, setSheetsId] = useState('')

    const onSubmit = (ev) => {
        ev.preventDefault();

        if(sheetsId.length === 0){
            return alert('Вставте посилання на таблицю')
        }

        const regex = /\/d\/([^/]+)/;
        const match = sheetsId.match(regex);

        if(match == null){
            return alert('Невірний формат посилання')
        }
        
        const documentId = match[1];

        axios.get(`http://localhost:5000/importEmployees/${documentId}`).then(
            setSheetsId('')
        )
    }

    return(
        <>
            <Header />
            <Center>
                <StyledFrom onSubmit={onSubmit}>
                    <Title>Імпортувати працівників</Title>
                    <StyledInput placeholder="Посилання на гугл таблицю" value={sheetsId || ''} onChange={ev => setSheetsId(ev.target.value)} required />
                    <StyledButton type="submit">Імпортувати</StyledButton>
                </StyledFrom>
            </Center>
        </>
    )
}