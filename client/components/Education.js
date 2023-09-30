import axios from "axios";
import { indexOf } from "lodash";
import Link from "next/link";
import { styled } from "styled-components"

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    border: none;
    border-radius: 10px;
    padding: 10px;
    background: #fff;
    position: relative;
`;

const StyledLink = styled(Link)`
    padding: 10px 0 0;
    text-decoration: none;
    color: #111;
`;

const StyledList = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

const EditWrapper = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;

    svg{
        width: 20px;
        height: 20px;
    }
`;

const StyledLine = styled.hr`
    width: 100%;
    color: #999;
    border: 1ps solid #999;
    margin-top: 5px;
`;

const DeleteButton = styled.button`
    border: none;
    background: none;
    outline: none;
    cursor: pointer;
`;

export default function Education({_id, name, date, startTime, endTime, employees, instructor}){

    const handleDelete = id => {
        try {
            axios.delete(`http://localhost:5000/education/${id}`).then(res => {
                axios.get(`http://localhost:5000/employees`).then(res => {
                    const employees = res.data;
                    employees.map(employee => {
                        if(employee.allEducations.includes(id)){
                            const updatedEducations = employee.allEducations.filter(educationId => educationId !== id)
                            axios.put(`http://localhost:5000/employees/${employee._id}`, {
                                fullName: employee.fullName,
                                leader: employee.leader,
                                schedule: employee.schedule,
                                status: employee.status,
                                startOfWork: employee.startOfWork,
                                profession: employee.profession,
                                allEducations: updatedEducations,
                            }).then(res => {
                                window.location.reload()
                            })
                        }
                    })
                })
            })
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    return(
        <>
            <Wrapper>
                <p>{name}</p>
                <p>{date}</p>
                <p>{startTime}</p>
                <p>{endTime}</p>
                <p>Проводив навчання: {instructor}</p>
                <p>Пройшло {employees.length} працівників</p>
                <StyledLine />
                <StyledLink href={`/educations/${_id}`}>
                    <span>Переглянути більше</span>
                </StyledLink>
                
                <EditWrapper>
                    <DeleteButton onClick={() => handleDelete(_id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </DeleteButton>
                </EditWrapper>
            </Wrapper>
        </>
        
    )
}