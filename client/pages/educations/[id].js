import Header from "@/components/Header";
import axios from "axios"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Center from "@/components/Center";
import { styled } from "styled-components";
import Link from "next/link";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding: 12px 24px;
    border-radius: 10px;
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ListItem = styled(Link)`
  color: #999;
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
    width: 300px;

    &:hover{
        opacity: 0.8;
    }
`;

export default function EducationPage(){

    const [education, setEducation] = useState({})
    const [employees, setEmployees] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false);

    const router = useRouter()
    const { query } = router;
    const { id } = query;
    
    useEffect(() => {
        if (id) {
          axios.get(`http://localhost:5000/education/${id}`)
            .then(res => {
              setEducation(res.data);
              setEmployees(res.data.employees)
              setDataLoaded(true);
            })
            .catch(error => {
              console.error(error);
            });
        }
      }, [id]);

    const {name, date, instructor, startTime, endTime} = education;
    
    const [newEmployees, setNewEmployees] = useState([])
    useEffect(() => {
        const promises = employees.map(employeeId => {
        return axios.get(`http://localhost:5000/employees/${employeeId}`)
            .then((res) => res.data)
            .catch((error) => {
                console.error(`Помилка при отриманні працівника з ID ${employeeId}:`, error);
                return null;
            });
        });
    
        Promise.all(promises)
            .then((employeeDataArray) => {
                const filteredEmployees = employeeDataArray.filter((employeeData) => employeeData !== null);
                setNewEmployees(filteredEmployees);
            })
            .catch((error) => {
                console.error("Помилка при виконанні запитів на отримання працівників:", error);
            });
    }, [employees]);

    async function generateWordDocument() {
      try {
        const dataToSend = {
          name: name,
          instructor: instructor,
          employees: newEmployees,
          date: date,
        };

        const response = await fetch('http://localhost:5000/createDocument', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend)
        })
        if (response.ok) {
          const blob = await response.blob();
    
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'document.docx';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          console.error('Failed to generate the document');
        }
      } catch (error) {
        console.error(error);
      }
    }

    return(
        <>
            <Header />
            <Center>
                <Wrapper>
                    <p>Назва навчання: {name}</p>
                    <p>Проводив навчання: {instructor}</p>
                    <p>Дата: {date}</p>
                    <p>Початок: {startTime}</p>
                    <p>Кінець: {endTime}</p>
                    {employees.length === 0 && (
                      <p>Жоден працівник не пройшов це навчання</p>
                    )}
                    {!employees.length !== 0 && newEmployees.length !== 0 && (
                      <StyledList>Працівники які пройшли це навчання: 
                        {newEmployees.length > 0 && newEmployees.map((employee, i) => (
                          <ListItem href={`/employees/${employee._id}`} key={i}>{employee.fullName}</ListItem>
                        ))}
                      </StyledList>
                    )}
                    <StyledButton type="button" onClick={() => generateWordDocument()}>Створити документ</StyledButton>
                </Wrapper>
            </Center>
        </>
    )
}