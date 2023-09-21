import Center from "@/components/Center";
import Header from "@/components/Header";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { styled } from "styled-components";
import { useAuth } from "@/AuthContext";

const FormWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30vw;
    height: 70vh;
    border-radius: 12px;
    box-shadow: rgba(50, 50, 93, 0,25) 0px 13px 27px -5px,
     rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
     background-color: #fff;
`;

const Title = styled.h2`
    font-family: Nunito, sans-serif;
    margin: 1.5rem 0 2rem 0;
    text-align: center;
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
    width: 250px;
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
    width: 100%;

    &:hover{
        opacity: 0.8;
    }
`;

const BottomForm = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 3rem;
`;

const StyledLink = styled(Link)`
    font-family: Nunito, sans-serif;
    padding-left: 5px;
    text-decoration: none;
    cursor: pointer;
    color: #21D4FD;

    &:hover{
        opacity: 0.8;
    }
`;

export default function RegisterPage(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')

    const { setAuthStatus } = useAuth();

    const onSubmitForm = (ev) => {
        ev.preventDefault();

        axios.post('http://localhost:5000/auth/register/', {
            email: username,
            password,
            fullName,
        }).then(res => {
            setUsername('')
            setPassword('')
            setFullName('')
            
            axios.post('http://localhost:5000/auth/login/', {
                email: username,
                password,
            }).then(res => {
                setAuthStatus(true)
            }
            )

        }
        ).catch( err => {
            console.log(err);
        })


    }
    return(
        <>
            <Header />
            <Center>
                <FormWrapper>
                    <StyledForm onSubmit={onSubmitForm}>
                        <div>
                            <Title>Зареєструватись</Title>
                            <StyledLabel>Ім'я</StyledLabel>
                            <StyledInput value={fullName} onChange={ev => setFullName(ev.target.value)} />
                            <StyledLabel>Email</StyledLabel>
                            <StyledInput value={username} onChange={ev => setUsername(ev.target.value)} />
                            <StyledLabel>Пароль</StyledLabel>
                            <StyledInput value={password} onChange={ev => setPassword(ev.target.value)} />
                            <div>
                                <StyledButton>Зареєструватись</StyledButton>
                            </div>
                        </div>
                        <BottomForm>
                            <div>Вже маєте акаунт?</div>
                            <StyledLink href='/login'>Увійти</StyledLink>
                        </BottomForm>
                    </StyledForm>
                </FormWrapper>
            </Center>
        </>
    )
}