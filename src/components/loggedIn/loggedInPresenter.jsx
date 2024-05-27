import { LoggedInView } from "./loggedInView";
import { observer } from "mobx-react-lite";


const LoggedIn = observer(             
    function LoggedInRender(props){
        return <LoggedInView />;
    });

export { LoggedIn}