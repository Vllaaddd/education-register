import Center from "@/components/Center"
import EducationsGrid from "@/components/EducationsGrid"
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

export default function Educations() {
    const [originalEducations, setOriginalEducations] = useState([]);
    const [educations, setEducations] = useState([]);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      setIsLoading(true);
      axios.get('http://localhost:5000/education').then(res => {
        setOriginalEducations(res.data);
        setEducations(res.data);
        setIsLoading(false);
      });
    }, []);
  
    const debouncedSearchEducation = useCallback(
        debounce((searchName) => {
          const formattedSearchName = searchName.toLowerCase();
          if (formattedSearchName === '') {
            setEducations(originalEducations);
          } else {
            setIsLoading(true);
            axios(`http://localhost:5000/educationByName/${formattedSearchName}`).then(res => {
              setEducations(res.data);
              setIsLoading(false);
            });
          }
        }, 250),
        [originalEducations]
      );
  
    const handleNameChange = (ev) => {
      const newName = ev.target.value;
      setName(newName);
      debouncedSearchEducation(newName);
    };
  
    return (
        <>
            <Header />
            <Center>
                <StyledInput
                    placeholder="Назва навчання"
                    onChange={handleNameChange}
                />
                {isLoading && (
                    <Spinner fullwidth="true" />
                )}
                {!isLoading && educations.length !== 0 && (
                    <EducationsGrid educations={educations} />
                )}
                {!isLoading && educations.length == 0 &&(
                    <StyledParagraph>Немає жодного навчання</StyledParagraph>
                )}
            </Center>
        </>
    )
}