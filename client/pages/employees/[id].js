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

    P{
      margin-bottom: 10px;
    }
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const StyledTable = styled.table`
    border-collapse: collapse;
    width: 100%;

    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #fff;
    }
`;

export default function EmployeePage(){

  const [employee, setEmployee] = useState({})
  const [educations, setEducations] = useState([])

  const router = useRouter()
  const { query } = router;
  const { id } = query;
  
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/employees/${id}`)
        .then(res => {
          setEmployee(res.data);
        }).catch(error => {
          console.error(error);
        });
    }
  }, [id]);

  const {fullName, allEducations} = employee; 

  useEffect(() => {
    if (Array.isArray(allEducations)) {
      allEducations.map(educationId => {
        try {
          axios.get(`http://localhost:5000/education/${educationId}`).then(res => {
            const education = res.data;
            if (education) {
              setEducations((prevEducations) => [...prevEducations, education]);
            } else {
              console.log('Немає навчання з таким id');
            }
          }).catch(err => {
            console.log('Навчання не знайдено');
          });
        } catch (error) {
          console.log('Навчання не знайдено');
        }
      });
    }
  }, [allEducations]);

  return(
      <>
          <Header />
          <Center>
              <Wrapper>
                  <Title>{fullName}</Title>
                  <p>Пройдені навчання: </p>
                  {educations.length === 0 && (
                    <p>Немає пройдених навчань</p>
                  )}
                  {educations && educations.length > 0 && (
                    <StyledTable>
                    <tr>
                      <th>Назва навчання</th>
                      <th>Хто проводив</th>
                      <th>Дата</th>
                      <th>Початок</th>
                      <th>Кінець</th>
                    </tr>
                    {educations.map(education => (
                      <tr key={education._id}>
                        <td>{education.name}</td>
                        <td>{education.instructor}</td>
                        <td>{education.date}</td>
                        <td>{education.startTime}</td>
                        <td>{education.endTime}</td>
                      </tr>
                    ))}
                  </StyledTable>
                  )}
              </Wrapper>
          </Center>
      </>
    )
}