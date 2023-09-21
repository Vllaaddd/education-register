import { styled } from "styled-components";
import Link from "next/link";
import axios from "axios";

const Title = styled.h2`
    text-align: center;
    margin-bottom: 15px;
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

    svg{
        width:20px;
        height: 20px;
    }

    thead{
        background-color: #fff;
    }
`;

const StyledLink = styled(Link)`
    color: #111;
`;

const Edit = styled.td`
    display: flex;
    justify-content: center;
    align-content: center;
    cursor: pointer;
`;

const Delete = styled.td`
    display: flex;
    justify-content: center;
    align-content: center;
    cursor: pointer;
`;

export default function EmployeesGrid({employees}){

    const handleDelete = (idToDelete) => {
        axios.delete(`http://localhost:5000/employeeDelete/${idToDelete}`).then(res => {
            window.location.reload()
        })
    }

    return(
        <>
            <Title>Всі працівники</Title>
            {employees && employees.length > 0 && (
                <StyledTable>
                    <thead>
                        <tr>
                            <th>Ім'я</th>
                            <th>Професія</th>
                            <th>Статус</th>
                            <th>Графік роботи</th>
                            <th>Кількість пройдених навчань</th>
                            <th colSpan="3">Детальна інформація</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee._id}>
                                <td>{employee.fullName}</td>
                                <td>{employee.profession}</td>
                                <td>{employee.status}</td>
                                <td>{employee.schedule}</td>
                                <td>{employee.allEducations.length}</td>
                                <td><StyledLink href={`/employees/${employee._id}`}>Переглянути більше</StyledLink></td>
                                <Edit>
                                    <StyledLink href={`/editEmployee/${employee._id}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </StyledLink>
                                </Edit>
                                <Delete onClick={() => handleDelete(employee._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </Delete>
                            </tr>
                        ))}
                    </tbody>
            </StyledTable>
            )}
        </>
        
    )
}