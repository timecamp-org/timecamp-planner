import { colors } from "../css";

type LinkConfig = {
    text: string,
    url: string,
    color?: string,
    style?: string,
}

const generateLinkHTMLString = ({ text, url, color = colors.linkColor, style }: LinkConfig): string => {
    return `<a href=${url} target="_blank" style="color:${color}${style ? style : ''}">${text}</a>`
}

export default generateLinkHTMLString