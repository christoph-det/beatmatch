import { observer } from "mobx-react-lite";
import { FooterView } from "./footerView";


const Footer = observer(             
    function footerViewRender(props){
        return <FooterView />;
    }
);

export { Footer };