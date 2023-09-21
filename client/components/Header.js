import Link from "next/link";
import { useRouter } from "next/router";
import { styled } from "styled-components"
import Center from "./Center";
import { useAuth } from "@/AuthContext";

const StyledHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 15px 30px;
    border-bottom: 1px solid #555;
    margin-bottom: 30px;
    background: #111;
`;

const LinksWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const ProfileWrapper = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #fff;
    font-weight: bold;
    position: relative;

    &.active:after{
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #fff;
    }
`;

const Title = styled.h2`
    margin-right: auto;
    color: #fff;
`;

export default function Header(){

    const { setAuthStatus, isAuth } = useAuth();

    const router = useRouter()
    const {pathname} = router;

    const onClick = () => {
        if (typeof window !== 'undefined') {
            setAuthStatus(false);
        }
    }

    return(
        <StyledHeader className="flex px-2 gap-2 m-2">
            <Title>Title</Title>
            <LinksWrapper>
                <StyledLink href="/" className={pathname === '/' ? 'active' : ''}>Головна</StyledLink>
                <StyledLink href="/employees" className={pathname.includes('/employees') ? 'active' : ''}>Всі працівники</StyledLink>
                <StyledLink href="/importEmployees" className={pathname.includes('/importEmployees') ? 'active' : ''}>Імпортувати працівників</StyledLink>
                <StyledLink href="/addEducation" className={pathname.includes('/addEducation') ? 'active' : ''}>Додати навчання</StyledLink>
                <StyledLink href="/educations" className={pathname.includes('/educations') ? 'active' : ''}>Всі навчання</StyledLink>
            </LinksWrapper>
            
            <ProfileWrapper>
                {isAuth ? (
                    <StyledLink suppressHydrationWarning={true} href="/" onClick={onClick}>Вийти</StyledLink>
                ) : (
                    <StyledLink suppressHydrationWarning={true} href='/login' className={pathname.includes('/login') ? 'active' : ''}>Увійти</StyledLink>
                )}    
            </ProfileWrapper>
        </StyledHeader>
    )
}