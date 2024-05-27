
export function PreviousPartiesView(props) {
    return (
      <div className="homePage-container container">
        <h2 className="mb-5">Existing parties</h2>
        <table className="table table-dark table-striped party-creation-table table-hover bg-opacity-85">
          <thead>
            <tr>
              <th scope="col" className="left-column column-title">Party Name</th>
              <th scope="col" className="left-column column-title d-none-xs">Party Code</th>
              <th scope="col" className="left-column column-title">Party Date</th>
              <th scope="col" className="left-column column-title"></th>
            </tr>
          </thead>
          <tbody>
            {props.showAllPrevious ? props.parties.map(renderPartyRowCB) : props.parties.slice(0, 5).map(renderPartyRowCB)}
          </tbody>
          {!props.showAllPrevious && props.parties.length > 5 && (
            <tfoot>
              <tr> 
                  <td colSpan="4" className="text-center">
                      <button className="votingButton btn btn-primary btn-xs " onClick={showAllPrevACB}>Show all previous parties</button>
                  </td>
              </tr>
            </tfoot>
          )}
        </table>

      </div>
    );

    function showAllPrevACB(){
      props.onShowAllPrev();
    }

    function renderPartyRowCB(party, index) {
        return (
          <tr key={party.partyID}>
            <td className="left-column">{party.name}</td>
            <td className="left-column d-none-xs">{party.partyID}</td>
            <td className="left-column">{party.date}</td>
            <td className="right-column"><button className="votingButton btn btn-primary btn-xs" onClick={viewPartyOnClickACB}>View</button><button className="votingButton btn btn-danger btn-xs ms-3" onClick={deletePartyOnClickACB} >Delete</button></td>
          </tr>
        );


      function viewPartyOnClickACB() {
        props.viewParty(party.partyID);
      }

      function deletePartyOnClickACB() {
        props.deleteParty(party.partyID);
      }


      }


  }
  