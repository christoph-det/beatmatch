import { observer } from "mobx-react-lite";
import { BackgroundView } from "./backgroundView.jsx"


const Background = observer(             
    function BackgroundRender(props){
        return <div className="background-container">
                <BackgroundView/>;
            </div>;
    }
);

export { Background };