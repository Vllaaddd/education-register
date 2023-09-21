import Center from "@/components/Center";
import Header from "@/components/Header";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { useAuth } from "@/AuthContext";
import { debounce } from "lodash";

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

const Wrapper = styled.div`
    width: 370px;
    margin: 8px 0 30px;
`;

const Search = styled.div`
    position: relative;

    input{
        height: 52px;
        width: 100%;
        font-size: 17px;
        padding: 0 15px 0 43px;
        outline: none;
        border: 1px solid #b3b3b3;
        border-radius: 5px;
    }

    svg{
        position: absolute;
        top: 16px;
        left: 15px;
        width: 20px;
        color: #999;
    }
`;

const Options = styled.ul`
    margin-top: 10px;
    max-height: 400px;
    overflow-y: auto;

    &::-webkit-scrollbar{
        width: 7px;
    }

    &::-webkit-scrollbar-track{
        background: #fff;
        border-radius: 25px;
    }

    &::-webkit-scrollbar-thumb{
        background: #ccc;
        border-radius: 25px;
    }

    li{
        height: 50px;
        border-radius: 5px;
        display: flex;
        cursor: pointer;
        align-items: center;
        padding: 0 13px;
        font-size: 21px;
        gap: 5px;
    }

    li:hover{
        background: #fff;
    }

    li.selected{
        border: 1px solid black;
    }
`;

export default function LoginPage(){
    const { setAuthStatus } = useAuth();

    const [email, setEmail] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [originalEmployees, setOriginalEmployees] = useState([]);
    const [name, setName] = useState('')

    const onSubmitForm = async (ev) => {
        ev.preventDefault();
      
        if (!selectedEmployeeId) {
          return;
        }
      
        try {
          const response = await axios.get(`http://localhost:5000/employees/${selectedEmployeeId}`);
          const employeeData = response.data;
          setEmail(employeeData.email);
      
          const loginResponse = await axios.post('http://localhost:5000/auth/login/', {
            email: employeeData.email,
          });
      
          const matchingEmployee = employees.find((employee) => employee.email === employeeData.email);
          if (matchingEmployee) {
            setAuthStatus(true, matchingEmployee);
            window.location.href = '/';
          } else {
            console.log('Employee not found');
          }
        } catch (err) {
          console.error(err);
        }
    };

    useEffect(() => {
        axios
          .get("http://localhost:5000/employees")
          .then((res) => {
            setEmployees(res.data);
            setOriginalEmployees(res.data)
          })
          .catch((error) => {
            console.error("Помилка при отриманні працівників:", error);
          });
    }, []);

    const debouncedSearchEmployee = useCallback(
        debounce((searchName) => {
          const formattedSearchName = searchName.toLowerCase();
          if (formattedSearchName === '') {
            setEmployees(originalEmployees);
          } else {
            axios.get(`http://localhost:5000/employeesByName/${formattedSearchName}`).then(res => {
              setEmployees(res.data);
            });
          }
        }, 250),
        [originalEmployees]
    );

    const handleNameChange = (ev) => {
        const newName = ev.target.value;
        setName(newName);
        debouncedSearchEmployee(newName);
    };

    const handleEmployeeSelect = (event) => {
        const selectedEmployeeId = event.currentTarget.getAttribute("value");
        setSelectedEmployeeId(selectedEmployeeId);
    };

    return(
        <>
            <Header />
            <Center>
                <FormWrapper>
                    <StyledForm onSubmit={onSubmitForm}>
                        <div>
                            <Title>Вхід</Title>
                            <StyledLabel>Увійти як:</StyledLabel>
                            <Wrapper>
                            <Search>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                                </svg>
                                <input
                                type="text"
                                placeholder="Шукати"
                                onChange={handleNameChange}
                                ></input>
                            </Search>
                            <Options>
                                {employees.map((employee) => {
                                const employeeId = employee._id;

                                return (
                                    <li
                                    key={employeeId}
                                    onClick={(ev) => handleEmployeeSelect(ev)}
                                    value={employeeId}
                                    className={selectedEmployeeId === employeeId ? "selected" : ""}
                                    >
                                    <span>{employee.fullName}</span>
                                    </li>
                                );
                                })}
                            </Options>
                            <StyledButton type="submit">Увійти</StyledButton>
                            </Wrapper>
                        </div>
                    </StyledForm>
                </FormWrapper>
            </Center>
        </>
    )
}