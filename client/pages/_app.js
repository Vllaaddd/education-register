import { createGlobalStyle } from "styled-components";
import { AuthProvider } from "@/AuthContext";

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');

    body{
        padding: 0;
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background-color: #eee;
        box-sizing: border-box;
    }

    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    hr{
        display: block;
        border: none;
        border-top: 1px solid #ccc;
    }

    a, ul{
        list-style: none;
        text-decoration: none;
    }
`;

export default function App({ Component, pageProps: {session, ...pageProps}}){
    return (
        <>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
            <GlobalStyles />
        </>
    )
}