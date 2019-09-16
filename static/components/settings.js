class Settings extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        /*
        <button type="button" className={"btn btn-secondary " + (loading ? "disabled" : "")} style={{ cursor: (loading ? "default" : "pointer") }} onClick={() => (!loading) ? this.setState({ loading: true }, this.setState({ loading: true }, () => this.update())) : null}>
                                    <span className="icon text-white-50 mr-1"><i className="fas fa-download"></i></span>
                                    <span className="text text-white mr-1">{loading ? "Loading..." : "Refresh"}</span>
                                </button>
        */
        let test = (
            <div>
                <div className="row">
                    <h2 className="font-weight-bold text-uppercase"><u>{"Data Sync"}</u></h2>
                </div>
                <div className="row">
                    <p className="font-weight-bold text-uppercase">{"Last Updated: Please Refresh"}</p>
                </div>
                <div className="row">
                </div>
                <div className="row mt-4">
                    <h2 className="font-weight-bold text-uppercase"><u>{"Data Time"}</u></h2>
                </div>
                <div className="row">
                    <ul className="nav nav-pills nav-fill text-center text-uppercase">
                        <li className="nav-item">
                            <a className="nav-link active" href="">Night</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" href="">09:30AM</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" href="">11:30AM</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" href="">01:30PM</a>
                        </li>
                    </ul>
                </div>
            </div>
        );

        return <Page sidebar={<div></div>} body={test} />;
    }
}