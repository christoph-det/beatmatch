export function AlertDialogView(props) {
    return (
        <dialog id="alertDialog" open={props.isOpen}>
            <p>{props.dialogMessage}</p>
            { props.showAcceptButton ? <button className="btn btn-primary" onClick={onAcceptClickACB} id="close">Yes</button> : null}
            <button className="btn btn-secondary" onClick={onCloseClickACB} id="close">Close</button>
      </dialog>
    );

    function onAcceptClickACB() {
        props.onAcceptDialog();
    }

    function onCloseClickACB() {
        props.onCloseDialog();
    }
  
}
