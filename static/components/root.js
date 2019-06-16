class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal: true, currentPage: "WELCOME" };
    }

    render() {
        const modal = this.state.modal;
        const currentPage = this.state.currentPage;

        let page = <h1 className="font-weight-bold text-uppercase text-center mt-4">"{currentPage}" PAGE COMING SOON</h1>;
        if (currentPage == "WELCOME") page = <h1 className="text-center">Welcome to the DLEH Admin App</h1>;
        if (currentPage == "STATUS MONITOR") page = <StatusMonitor />;
        if (currentPage == "TECHS") page = <Structure pageName={currentPage} api="/api/techsLoaded" headers={["ag", "technicianId", "geoGrp", "capacity"]} />;
        if (currentPage == "JOBS") page = <Structure pageName={currentPage} api="/api/jobsLoaded" headers={["ag", "wrid", "jobType", "geoGrp", "estTechDur"]} />;
        if (currentPage == "UNIVERSAL CONFIG") page = <Structure pageName={currentPage} api="/api/config" headers={["ag", "agRouting", "actual_time", "overtime", "durations"]} />;

        return (
            <div id="wrapper">
                {modal ? null : <NavBar currentPage={currentPage} changePage={(newPage) => this.setState({ currentPage: newPage })} />}

                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content" style={{ display: "grid", height: "100%" }}>
                        <div style={{ margin: "auto" }}>
                            <Modal handler={() => this.setState({ modal: false })} title="WARNING" body={
                                "This tool is currently in development. Please use kind words when critiquing! Please contact am790d regarding any bugs found."
                            } />
                        </div>
                        {modal ? null : page}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));