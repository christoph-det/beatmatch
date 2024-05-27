import { observer } from "mobx-react-lite";
import { LandingPageView } from "./landingPageView";


const LandingPage = observer(             
    function LandingPageRender(props){
        return <LandingPageView />;
    }
);

export { LandingPage };