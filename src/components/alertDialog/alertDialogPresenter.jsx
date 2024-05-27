import { observer } from "mobx-react-lite";
import { AlertDialogView } from "./alertDialogView";


const AlertDialog = observer(             
    function alertDialogRender(props){

        return <AlertDialogView 
            isOpen={props.model.isDialogOpen}    
            dialogMessage={props.model.dialogMessage}
            onCloseDialog={closeDialogACB}
            onAcceptDialog={acceptDialogACB}
            showAcceptButton={props.model.onAccpetDialogRunACB != null}
        />;

        function acceptDialogACB() {
            props.model.closeDialog(true);
        }

        function closeDialogACB() {
            props.model.closeDialog(false);
        }
    }
);

export { AlertDialog };