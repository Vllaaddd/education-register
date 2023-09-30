import Center from "@/components/Center";
import Header from "@/components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
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
    padding-bottom: 50px;
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
    width: 100%;

    &:hover{
        opacity: 0.8;
    }
`;

const Wrapper = styled.div`
    width: 370px;
    margin: 8px 0 30px;
`;

const SelectBtn = styled.div`
    background: #EAEEED;
    height: 65px;
    padding: 0 20px;
    border-radius: 7px;
    font-size: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    
    svg{
        width: 20px;
        transition: transform 0.3s linear;
    }

    ${props => props.isopen === 'true' ? `
        svg{
            transform: rotate(180deg);
        }
    ` : ``}
`;

const Content = styled.div`
    background: #fff;
    margin-top: 15px;
    padding: 50px 20px 20px;
    border-radius: 7px;
    max-height: 80vh;
    width: 50%;
    position: fixed;
    z-index: 1;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    overflow-y: auto;
    border: 1px solid black;

    &::-webkit-scrollbar{
        padding-top:5px;
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

    button:nth-child(1){
        width: 30px;
        height: 30px;
        outline: none;
        background: none;
        border: none;
        position: absolute;
        top: 10px;
        right: 20px;
        cursor: pointer;
    }

    ${props => props.isopen === 'false' ? `
        display: none;
    ` : `
        display: block;
    `}
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

    button{
      width: 30px;
      height: 30px;
      outline: none;
      background: none;
      border: none;
      position: absolute;
      top: 10px;
      right: 20px;
      cursor: pointer;
    }
`;

const MyEmployees = styled.button`
  height: 50px;
  border-radius: 5px;
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 0 13px;
  font-size: 21px;
  gap: 5px;
  outline: none;
  background: none;
  margin-top: 10px;

  ${props => props.active === true ? `
    border: 1px solid black
  ` : `
    border: none;
  `}
`;

const SelectedEmployee = styled.li`
    margin: 5px 0;
`;

export default function AddEmployee() {
    const [name, setName] = useState("");
    const [date, setDate] = useState("")
    const [instructor, setInstructor] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [employees, setEmployees] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [selectedEmployeesIds, setSelectedEmployeesIds] = useState([]);
    const [isopen, setisopen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isMyEmployeesSelected, setIsMyEmployeesSelected] = useState(false)
    const [selectedEmployees, setSelectedEmployees] = useState([])

    const { setAuthStatus, isAuth, user } = useAuth();
  
    useEffect(() => {
      axios
        .get("http://localhost:5000/employees")
        .then((res) => {
          setEmployees(res.data);
          const dateNow = (new Date).toLocaleDateString().toString();
          setDate(dateNow)
  
          setEmployeeOptions(
            res.data.map((employee) => (
              <li key={employee._id} value={employee._id}>
                {employee.fullName}
              </li>
            ))
          );
        })
        .catch((error) => {
          console.error("Помилка при отриманні працівників:", error);
        });
    }, []);
  
    useEffect(() => {
      setEmployeeOptions(
        employees
          .filter((employee) =>
            employee.fullName.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((employee) => (
            <li key={employee._id} value={employee._id}>
              {employee.fullName}
            </li>
          ))
      );
    }, [searchText, employees]);
  
    const isEmployeeSelected = (employeeId) => {
      return selectedEmployeesIds.includes(employeeId);
    };
  
    const handleEmployeeSelect = (event) => {
      const selectedEmployeeId = event.currentTarget.getAttribute("value");
      const updatedSelectedEmployeesIds = [...selectedEmployeesIds];
  
      if (isEmployeeSelected(selectedEmployeeId)) {
        const index = updatedSelectedEmployeesIds.indexOf(selectedEmployeeId);
        if (index !== -1) {
          updatedSelectedEmployeesIds.splice(index, 1);
        }
      } else {
        updatedSelectedEmployeesIds.push(selectedEmployeeId);
      }
  
      setSelectedEmployeesIds(updatedSelectedEmployeesIds);
    };
  
    const selectBtnHandler = () => {
      setisopen(!isopen);
    };

    const myEmployeesHandler = () => {
      if (isMyEmployeesSelected) {
        const updatedSelectedEmployeesIds = selectedEmployeesIds.filter(
          (employeeId) => !user.employees.includes(employeeId)
        );
        setSelectedEmployeesIds(updatedSelectedEmployeesIds);
      } else {
        const updatedSelectedEmployeesIds = [
          ...new Set([...selectedEmployeesIds, ...user.employees]),
        ];
        setSelectedEmployeesIds(updatedSelectedEmployeesIds);
      }
    
      setIsMyEmployeesSelected(!isMyEmployeesSelected);
      console.log(selectedEmployeesIds);
    };

    useEffect(() => {
      const updatedSelectedEmployees = [];
      selectedEmployeesIds.forEach(employeeId => {
        axios.get(`http://localhost:5000/employees/${employeeId}`)
          .then(res => {
            updatedSelectedEmployees.push(res.data);
            setSelectedEmployees(updatedSelectedEmployees);
          })
          .catch(error => {
            console.error(`Error fetching employee with ID: ${employeeId}`, error);
          });
      });
    }, [selectedEmployeesIds]);
  
    const onSubmitForm = (ev) => {
      ev.preventDefault();

      if(selectedEmployeesIds.length === 0){
        return
      }
  
      axios
        .post("http://localhost:5000/education", {
          name,
          instructor,
          startTime,
          endTime,
          date,
          employees: selectedEmployeesIds,
        })
        .then((res) => {
          const newEducationId = res.data.doc._id;
  
          selectedEmployeesIds.forEach((employeeId) => {
            axios
              .get(`http://localhost:5000/employees/${employeeId}`)
              .then((res) => {
                const employee = res.data;
  
                employee.allEducations.push(newEducationId);
  
                axios
                  .put(`http://localhost:5000/employees/${employeeId}`, employee)
                  .catch((error) => {
                    console.error(
                      `Помилка при оновленні працівника з ID: ${employeeId}`,
                      error
                    );
                  });
              });
          });
        })
        .catch((err) => {
          console.log(err);
        });
  
      setName("");
      setInstructor("");
      setStartTime("");
      setEndTime("");
      setSelectedEmployeesIds([]);
    };
  
    return (
      <>
        <Header />
        <Center>
          <FormWrapper>
            <StyledForm onSubmit={onSubmitForm}>
              <div>
                <Title>Додати навчання</Title>
                <StyledLabel>Назва</StyledLabel>
                <StyledInput
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  required
                />
                <StyledLabel>Хто проводить</StyledLabel>
                <StyledInput
                  value={instructor}
                  onChange={(ev) => setInstructor(ev.target.value)}
                  required
                />
                <StyledLabel>Вибрати працівників</StyledLabel>
                <Wrapper>
                  <SelectBtn
                    isopen={isopen === true ? "true" : "false"}
                    onClick={() => selectBtnHandler()}
                  >
                    <span>Вибрати працівників</span>
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
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </SelectBtn>
                  <Content
                    isopen={isopen === true ? "true" : "false"}
                  >
                    <button type="button" onClick={() => selectBtnHandler()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
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
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      ></input>
                    </Search>
                    {isAuth ? (
                      <MyEmployees type="button" suppressHydrationWarning={true} onClick={() => myEmployeesHandler()} active={isMyEmployeesSelected}>Вибрати моїх працівників</MyEmployees>
                    ) : (
                      <p suppressHydrationWarning={true}></p>
                    )}
                    <Options>
                      {employeeOptions.map((employee, i) => {
                        const employeeId = employee.props.value;
                        const isSelected = isEmployeeSelected(employeeId);
  
                        return (
                          <li
                            key={i}
                            onClick={(ev) => handleEmployeeSelect(ev)}
                            value={employeeId}
                          >
                            {isSelected ? (
                              <svg
                                key={employeeId}
                                width="20px"
                                height="20px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                                  fill="#080341"
                                />
                                <circle cx="12" cy="12" r="5.25" fill="#080341" />
                              </svg>
                            ) : (
                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                            <span>{employee.props.children}</span>
                          </li>
                        );
                      })}
                    </Options>
                    <StyledButton onClick={() => selectBtnHandler()} type="button">Вибрати</StyledButton>
                  </Content>
                </Wrapper>
                {selectedEmployeesIds.length > 0 && (
                  <>
                    <StyledLabel>Вибрані працівники</StyledLabel>
                    <ul suppressHydrationWarning={true}>
                      {selectedEmployeesIds.map((employeeId) => {
                        const employee = employees.find((e) => e._id === employeeId);
                        return (
                          <SelectedEmployee key={employeeId} suppressHydrationWarning={true}>
                            {employee ? employee.fullName : "Працівник не знайдений"}
                          </SelectedEmployee>
                        );
                      })}
                    </ul>
                  </>
                )}
                <StyledLabel>Дата</StyledLabel>
                <StyledInput
                  value={date}
                  onChange={(ev) => setDate(ev.target.value)}
                  required
                />
                <StyledLabel>Початок</StyledLabel>
                <StyledInput
                  value={startTime}
                  onChange={(ev) => setStartTime(ev.target.value)}
                  required
                />
                <StyledLabel>Кінець</StyledLabel>
                <StyledInput
                  value={endTime}
                  onChange={(ev) => setEndTime(ev.target.value)}
                  required
                />
                <div>
                  <StyledButton type="submit">Додати</StyledButton>
                </div>
              </div>
            </StyledForm>
          </FormWrapper>
        </Center>
      </>
    );
  }