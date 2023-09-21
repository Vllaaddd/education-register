import Center from "@/components/Center";
import Header from "@/components/Header";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

const FormWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30vw;
    padding-bottom: 30px;
    border-radius: 12px;
    box-shadow: rgba(50, 50, 93, 0,25) 0px 13px 27px -5px,
     rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
     background-color: #fff;
`;

const StyledLabel = styled.h2`
    font-family: Nunito, sans-serif;
    padding-left: 16px;
    opacity: 0.75;
    font-weight: 500;
    font-size: 16px;
`;

const StyledInput = styled.input`
    font-family: Nunito, sans-serif;
    display: flex;
    border-radius: 50px;
    border-style: none;
    outline: none;
    margin-top: 8px;
    padding: 12px 24px;
    width: 370px;
    background-color: #EAEEED;
    margin-bottom: 30px;

    &:focus{
        opacity: 0.7;
    }
`;

const StyledButton = styled.button`
    font-family: Nunito, sans-serif;
    padding: 12px 48px;
    border-radius: 50px;
    color: #fff;
    margin-top: 1rem;
    cursor: pointer;
    outline: none;
    border-width: 0;
    background-color: #1A1B27;
    font-weight: 600;
    width: 370px;

    &:hover{
        opacity: 0.8;
    }
`;

const Title = styled.h2`
    font-family: Nunito, sans-serif;
    margin: 1.5rem 0 2rem 0;
    text-align: center;
`;

export default function EditEmployee(){

    const [employee, setEmployee] = useState({})
    const [fullName, setFullName] = useState('')
    const [leader, setLeader] = useState('')
    const [profession, setProfession] = useState('')
    const [schedule, setSchedule] = useState('')
    const [status, setStatus] = useState('')
    const [startOfWork, setStartOfWork] = useState('')
    const [allEducations, setAllEducations] = useState([])

    const router = useRouter()
    const { query } = router;
    const { id } = query;

    useEffect(() => {
        axios.get(`http://localhost:5000/employees/${id}`)
            .then(res => {
                const data = res.data;
                setEmployee(data);
                setFullName(data.fullName);
                setLeader(data.leader);
                setProfession(data.profession);
                setSchedule(data.schedule);
                setStatus(data.status);
                setStartOfWork(data.startofWork);
                setAllEducations(data.allEducations);
            })
    }, [id]);
    
    const onSubmitHandle = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:5000/employees/${id}`, {
            fullName,
            leader,
            profession,
            schedule,
            status,
            startOfWork,
            allEducations,
        }).then(res => {
            router.push('/employees');
        });
    }

    return(
        <>
            <Header />
            <Center>
                <FormWrapper>
                    <StyledForm onSubmit={(event) => onSubmitHandle(event)}>
                        <Title>Оновити працівника</Title>
                        <StyledLabel>Ім'я</StyledLabel>
                        <StyledInput value={fullName} onChange={ev => setFullName(ev.target.value)}></StyledInput>
                        <StyledLabel>Керівник</StyledLabel>
                        <StyledInput value={leader} onChange={ev => setLeader(ev.target.value)}></StyledInput>
                        <StyledLabel>Професія</StyledLabel>
                        <StyledInput value={profession} onChange={ev => setProfession(ev.target.value)}></StyledInput>
                        <StyledLabel>Графік</StyledLabel>
                        <StyledInput value={schedule} onChange={ev => setSchedule(ev.target.value)}></StyledInput>
                        <StyledLabel>Статус</StyledLabel>
                        <StyledInput value={status} onChange={ev => setStatus(ev.target.value)}></StyledInput>

                        <StyledButton type="submit">Оновити</StyledButton>
                    </StyledForm>
                </FormWrapper>
            </Center>
        </>
    )
}