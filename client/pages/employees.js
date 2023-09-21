import Center from "@/components/Center"
import EmployeesGrid from "@/components/EmployeesGrid"
import Header from "@/components/Header"
import Spinner from "@/components/Spinner"
import axios from "axios"
import { debounce } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { styled } from "styled-components"

const StyledInput = styled.input`
    width: 200px;
    padding: 12px 24px;
    border: none;
    border-radius: 50px;
    outline: none; 
    background: #fff;
`;

const StyledParagraph = styled.p`
    text-align: center;
`;

export default function Employees() {
    const [originalEmployees, setOriginalEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      setIsLoading(true);
      axios.get('http://localhost:5000/employees').then(res => {
        setOriginalEmployees(res.data);
        setEmployees(res.data);
        setIsLoading(false);
      });
    }, []);
  
    const debouncedSearchEmployee = useCallback(
        debounce((searchName) => {
          const formattedSearchName = searchName.toLowerCase();
          if (formattedSearchName === '') {
            setEmployees(originalEmployees);
          } else {
            setIsLoading(true);
            axios.get(`http://localhost:5000/employeesByName/${formattedSearchName}`).then(res => {
              setEmployees(res.data);
              setIsLoading(false);
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
  
    return (
        <>
            <Header />
            <Center>
                <StyledInput
                    placeholder="Ім'я працівника"
                    onChange={handleNameChange}
                />
                <EmployeesGrid employees={employees} />
                {isLoading && (
                    <Spinner fullwidth="true" />
                )}
                {!isLoading && employees.length == 0 &&(
                    <StyledParagraph>Немає жодного працівника</StyledParagraph>
                )}
            </Center>
        </>
    )
}