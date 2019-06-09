class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = { page: "statusMonitor" };
    }

    render() {
        const statusMonitorHeaders = [
            { name: "ag", filter: { type: "TextFilter" } },
            { name: "service", filter: { type: "TextFilter" } },
            { name: "run", filter: { type: "NumberFilter" } },
            { name: "start", filter: null },
            { name: "end", filter: null },
            { name: "status", filter: { type: "TextFilter" } }
        ];

        const techsLoadedHeaders = [
            { name: "ag", filter: { type: "TextFilter" } },
            { name: "technicianId", filter: { type: "TextFilter" } },
            { name: "capacity", filter: { type: "NumberFilter" } },
            { name: "geoGrp", filter: { type: "TextFilter" } }
        ];

        const jobsLoadedHeaders = [
            { name: "wrid", filter: { type: "TextFilter" } },
            { name: "jobType", filter: { type: "TextFilter" } },
            { name: "estTechDur", filter: { type: "NumberFilter" } },
            { name: "geoGrp", filter: { type: "TextFilter" } }
        ];

        const techAssignmentsHeaders = [
            { name: "ag", filter: { type: "TextFilter" } },
            { name: "techId", filter: { type: "TextFilter" } },
            { name: "type", filter: { type: "TextFilter" } },
            { name: "geoGroup", filter: null }
        ];

        const reportHeaders = [
            { name: "DATE", filter: { type: "TextFilter" } },
            { name: "AG", filter: { type: "TextFilter" } },
            { name: "NUM_TECHS", filter: null },
            { name: "NUM_JOBS", filter: null },
            { name: "JPT", filter: null },
            { name: "HPC", filter: null },
            { name: "MPD", filter: null },
            { name: "PERC_TECHS_BULKED", filter: { type: "NumberFilter" } },
            { name: "PERC_JOBS_BULKED", filter: { type: "NumberFilter" } }
        ];

        const configHeaders = [
            { name: "ag", filter: { type: "TextFilter" } },
            { name: "agRouting", filter: { type: "TextFilter" } },
            { name: "actual_time", filter: null },
            { name: "overtime", filter: null },
            { name: "durations", filter: null }
        ];

        return (
            <div>
                <ReactBootstrap.Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
                    <ReactBootstrap.Navbar.Brand href="#statusMonitor">DLEH Admin App</ReactBootstrap.Navbar.Brand>
                    <ReactBootstrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <ReactBootstrap.Navbar.Collapse id="responsive-navbar-nav">
                        <ReactBootstrap.Nav className="mr-auto" defaultActiveKey="statusMonitor" onSelect={e => this.setState({ page: e })}>
                            <ReactBootstrap.Nav.Link eventKey="statusMonitor">Status Monitor</ReactBootstrap.Nav.Link>
                            <ReactBootstrap.Nav.Link eventKey="techsLoaded">Techs Loaded</ReactBootstrap.Nav.Link>
                            <ReactBootstrap.Nav.Link eventKey="jobsLoaded">Jobs Loaded</ReactBootstrap.Nav.Link>
                            <ReactBootstrap.Nav.Link eventKey="techAssignments">Tech Assignments</ReactBootstrap.Nav.Link>
                            <ReactBootstrap.Nav.Link eventKey="report">Report</ReactBootstrap.Nav.Link>
                            <ReactBootstrap.Nav.Link eventKey="config">Universal Config</ReactBootstrap.Nav.Link>
                            <ReactBootstrap.Nav.Link eventKey="contact">Contact</ReactBootstrap.Nav.Link>
                        </ReactBootstrap.Nav>
                    </ReactBootstrap.Navbar.Collapse>
                </ReactBootstrap.Navbar>

                <div className="container">
                    <div className="alert alert-warning alert-dismissible fade show d-none d-sm-none d-md-none d-lg-block mt-4" role="alert">
                        Dorting functionality works, but the arrows are missing. I know.<br></br>
                        Timestamp Format: GMT/UTC<br></br>
                        Displaying Date: {new Date().toISOString().slice(0, 10)}
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>

                {(this.state.page == "statusMonitor") ? <Page pageName="Status Monitor" headers={statusMonitorHeaders} api="http://localhost:5000/api/statusMonitor" /> : null}
                {(this.state.page == "techsLoaded") ? <Page pageName="Techs Loaded" headers={techsLoadedHeaders} api="http://localhost:5000/api/techsLoaded" /> : null}
                {(this.state.page == "jobsLoaded") ? <Page pageName="Jobs Loaded" headers={jobsLoadedHeaders} api="http://localhost:5000/api/jobsLoaded" /> : null}
                {(this.state.page == "techAssignments") ? <Page pageName="Tech Assignments" headers={techAssignmentsHeaders} api="http://localhost:5000/api/techAssignments" /> : null}
                {(this.state.page == "report") ? <Page pageName="Report" headers={reportHeaders} api="http://localhost:5000/api/report" /> : null}
                {(this.state.page == "config") ? <Page pageName="Universal Config" headers={configHeaders} api="http://localhost:5000/api/config" /> : null}
                {(this.state.page == "contact") ? <h1 className="text-center">Contact Coming Soon</h1> : null}
            </div>
        );
    }
}

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.handleLoadData = this.handleLoadData.bind(this);
        this.getData = this.getData.bind(this);
        this.state = { data: null, isLoading: false };
    }

    handleLoadData() {
        this.setState({ isLoading: true }, () => this.getData());
    }

    async getData() {
        const response = await fetch(this.props.api);
        const data = await response.json();
        this.setState({ data: data, isLoading: false });
    }

    render() {
        return (
            <ReactBootstrap.Container className="col-md-10">
                <ReactBootstrap.Card className="my-4">

                    <ReactBootstrap.Card.Header>
                        <ReactBootstrap.Card.Title>
                            <h1 className="text-center">
                                {this.props.pageName}
                                <ReactBootstrap.Button
                                    className="d-none d-sm-none d-md-none d-lg-block"
                                    style={{ position: "absolute", top: 8, right: 8 }}
                                    variant="secondary"
                                    size="lg"
                                    disabled={this.state.isLoading}
                                    onClick={!this.state.isLoading ? this.handleLoadData : null}
                                >Refresh</ReactBootstrap.Button>
                            </h1>
                        </ReactBootstrap.Card.Title>
                    </ReactBootstrap.Card.Header>

                    <ReactBootstrap.Card.Body>
                        <Table name={this.props.pageName} data={this.state.data} headers={this.props.headers} />
                    </ReactBootstrap.Card.Body>

                </ReactBootstrap.Card>
            </ReactBootstrap.Container>
        );
    }
}

class Table extends React.Component {
    render() {
        return (
            <div>
                <BootstrapTable className="d-none d-sm-none d-md-none d-lg-block" data={this.props.data} keyField={this.props.headers[0]["name"]} pagination hover condensed striped>
                    {this.props.headers.map((item) =>
                        <TableHeaderColumn
                            dataField={item["name"]}
                            key={item["name"]}
                            dataSort
                            filter={(item["filter"] != null) ? { type: item["filter"]["type"] } : null}
                            headerAlign="center"
                            dataAlign="center"
                        >{item["name"].toUpperCase()}</TableHeaderColumn>
                    )}
                </BootstrapTable>
                <h2 className="d-none d-block d-sm-block d-md-block d-lg-none text-center">
                    Use a Larger Screen to View the Table
                </h2>
            </div>
        );
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));