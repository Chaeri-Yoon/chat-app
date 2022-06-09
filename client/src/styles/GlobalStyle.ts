import { createGlobalStyle } from "styled-components";
import styles from "./styles";
const GlobalStyle = createGlobalStyle`
    /* http://meyerweb.com/eric/tools/css/reset/ 
    v2.0 | 20110126
    License: none (public domain)
    */

    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video, button {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    /* Customizing */
    *{
        box-sizing: border-box;
        color: ${styles.textGrey};
    }
    body{
        width: 100%;
        height: 100vh;
        & > div{
            width: 100%;
            height: 100%;
        }
    }
    button, input, textarea, select{
        border: none;
        outline: none;
        border-radius: 3px;
    }
    input, textarea{
        padding: 8px;
        color: ${styles.textGrey};
        &::placeholder{
            color: ${styles.lightGrey};
        }
    }
    button{
        background-color: transparent;
        transition: all 0.1s ease-in-out;
    }
    button:not(:disabled){
        cursor: pointer;
    }
    button:not(:disabled):hover{
        transform: scale(1.02);
    }
    button:not(:disabled):active{
        transform: scale(0.98);
    }
`;

export default GlobalStyle;