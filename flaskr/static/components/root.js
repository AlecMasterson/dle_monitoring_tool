class Root extends React.Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.state = { page: "statusMonitor" };
    }

    changePage(newPage) {
        this.setState({ page: newPage });
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
        const statusMonitorAlert = <p>
            Sorting functionality works, but the arrows are missing. I know.<br></br>
            Timestamp Format: GMT/UTC<br></br>
            Displaying Date: {new Date().toISOString().slice(0, 10)}
        </p>

        const techsLoadedHeaders = [
            { name: "ag", filter: { type: "TextFilter" } },
            { name: "technicianId", filter: { type: "TextFilter" } },
            { name: "capacity", filter: { type: "NumberFilter" } },
            { name: "geoGrp", filter: { type: "TextFilter" } },
        ];

        const jobsLoadedHeaders = [
            { name: "wrid", filter: { type: "TextFilter" } },
            { name: "jobType", filter: { type: "TextFilter" } },
            { name: "estTechDur", filter: { type: "NumberFilter" } },
            { name: "geoGrp", filter: { type: "TextFilter" } },
        ];

        const page = this.state.page;

        let pageView = null;
        if (page == "statusMonitor") pageView = <Page pageName="Status Monitor" headers={statusMonitorHeaders} api="http://localhost:5000/api/statusMonitor" alert={statusMonitorAlert} />;
        if (page == "techsLoaded") pageView = <Page pageName="Techs Loaded" headers={techsLoadedHeaders} api="http://localhost:5000/api/techsLoaded" alert={null} />;
        if (page == "jobsLoaded") pageView = <Page pageName="Jobs Loaded" headers={jobsLoadedHeaders} api="http://localhost:5000/api/jobsLoaded" alert={null} />;

        return (
            <div>
                <ReactBootstrap.Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
                    <ReactBootstrap.Navbar.Brand href="#statusMonitor">DLEH Admin App</ReactBootstrap.Navbar.Brand>
                    <ReactBootstrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <ReactBootstrap.Navbar.Collapse id="responsive-navbar-nav">
                        <ReactBootstrap.Nav className="mr-auto" defaultActiveKey="statusMonitor" onSelect={e => this.changePage(e)}>
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
                {pageView}
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
                        {(this.props.alert == null) ? null :
                            <div className="alert alert-warning alert-dismissible fade show d-none d-sm-none d-md-none d-lg-block" role="alert">
                                {this.props.alert}
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        }

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
                            dataField={this.props.name + item["name"]}
                            key={this.props.name + item["name"]}
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