import { NavigationBar } from "./components/navigationbar/navigationbarPresenter";
import { HomePage } from "./components/homepage/homepagePresenter";
import { VotingPage } from "./components/votingpage/votingpagePresenter";
import { createHashRouter,  RouterProvider} from "react-router-dom";
import { Playlist } from "./components/playlist/playlistPresenter";
import { WelcomePage } from "./components/welcomepage/welcomepagePresenter";
import { LoggedIn } from "./components/loggedIn/loggedInPresenter";
import Favicon from "react-favicon";
import { LandingPage } from "./components/landingpage/landingPagePresenter";
import { ProfilePage } from "./components/profilepage/profilepagePresenter";
import { LoginPage } from "./components/login/loginPresenter";
import { RegisterPage } from "./components/register/registerPresenter";
import { Background } from "./components/background/backgroundPresenter";
import { PartyInfo } from "./components/partyInformation/partyInfoPresenter";
import { Footer } from "./components/footer/footerPresenter";
import { VotingDone } from "./components/votingdone/VotingDonePresenter";
import { AlertDialog } from "./components/alertDialog/alertDialogPresenter";
import { PreviousParty } from "./components/previousParty/previousPartyPresenter"

function Root(props) {


  return (
    <div>
      <div className="pb-5 main-container">
          <Favicon url="favicon.ico" />
          <NavigationBar model={props.model} />
          <RouterProvider router={makeRouter(props.model)}/>
          {<Background model={props.model}/>}
          <AlertDialog model={props.model}/>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}


function makeRouter(model) {
  return createHashRouter([
    {
        path: "/",
        element: <LandingPage model={model} />,

      },
    {
      path: "/welcome",
      element: <WelcomePage model={model} />,
    },
    {
      path: "/login",
      element: <LoginPage model={model} />,
    },
    {
      path: "/register",
      element: <RegisterPage model={model} />,
    },
    {
      path: "/profile",
      element: <ProfilePage model={model} />
    },
    ,
    {
      path: "/allplaylists",
      element: <HomePage model={model} />,
    },
    {
      path: "/voting",
      element: <VotingPage model={model}/>,
    },
    {
      path: "/home",
      element: < HomePage model={model}/>,
    },
    {
        path: "/playlist",
        element: <Playlist model={model}/>
    },
    {
        path: "/loggedin",
        element: <LoggedIn model={model}/>
    },
    {
        path: "/partyinfo",
        element: <PartyInfo model={model}/>
    },
    {
      path: "/votingdone",
      element: <VotingDone model={model}/>
    },
    {
      path: "/playlistview",
      element: <PreviousParty model={model}/>
    }
  ]);
}


export { Root };
