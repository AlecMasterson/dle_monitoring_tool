class Root extends React.Component {
    constructor(props) {
        super(props);

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.changePage = this.changePage.bind(this);

        this.state = { sidebarToggled: false, page: "Status Monitor" };

        this.statusMonitorHeaders = [
            { name: "ag", filter: { type: "TextFilter" } },
            { name: "service", filter: { type: "TextFilter" } },
            { name: "run", filter: { type: "NumberFilter" } },
            { name: "start", filter: null },
            { name: "end", filter: null },
            { name: "status", filter: { type: "TextFilter" } }
        ];

        this.techsLoadedHeaders = [
            { name: "ag", filter: { type: "TextFilter" } },
            { name: "technicianId", filter: { type: "TextFilter" } },
            { name: "capacity", filter: { type: "NumberFilter" } },
            { name: "geoGrp", filter: { type: "TextFilter" } }
        ];

        this.jobsLoadedHeaders = [
            { name: "wrid", filter: { type: "TextFilter" } },
            { name: "jobType", filter: { type: "TextFilter" } },
            { name: "estTechDur", filter: { type: "NumberFilter" } },
            { name: "geoGrp", filter: { type: "TextFilter" } }
        ];

        this.techAssignmentsHeaders = [
            { name: "ag", filter: { type: "TextFilter" } },
            { name: "techId", filter: { type: "TextFilter" } },
            { name: "geoGroup", filter: null }
        ];

        this.reportHeaders = [
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

        this.configHeaders = [
            { name: "ag", filter: { type: "TextFilter" } },
            { name: "agRouting", filter: { type: "TextFilter" } },
            { name: "actual_time", filter: null },
            { name: "overtime", filter: null },
            { name: "durations", filter: null }
        ];
    }

    toggleSidebar() {
        this.setState({ sidebarToggled: !this.state.sidebarToggled });
    }

    changePage(newPage) {
        this.setState({ page: newPage });
    }

    render() {
        return (
            < div id="wrapper" >
                <ul className={"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" + (this.state.sidebarToggled ? " toggled" : "")} id="mainSidebar">

                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href="">
                        <div className="sidebar-brand-icon">D<sup>2</sup></div>
                        <div className="sidebar-brand-text mx-3">DLEH Admin App</div>
                    </a>

                    <hr className="sidebar-divider" />
                    <div className="sidebar-heading">Debug</div>

                    <NavItem name="Status Monitor" classes="fas fa-fw fa-table" active={this.state.page == "Status Monitor"} handler={this.changePage} />

                    <hr className="sidebar-divider" />
                    <div className="sidebar-heading">Database Viewer</div>

                    <li className={"nav-item" + ((this.state.page == "TECHS" || this.state.page == "JOBS" || this.state.page == "REF_TABLE") ? " active" : "")}>
                        <a className="nav-link collapsed" href="" data-toggle="collapse" data-target="#loadDataSidebar" aria-expanded="true" aria-controls="loadDataSidebar">
                            <i className="fas fa-fw fa-folder"></i>
                            <span>Load Data</span>
                        </a>
                        <div id="loadDataSidebar" className="collapse" aria-labelledby="headingTwo" data-parent="#mainSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Load Data Tables</h6>
                                <a className="collapse-item" onClick={() => this.changePage("TECHS")} style={{ cursor: "pointer" }}>TECHS</a>
                                <a className="collapse-item" onClick={() => this.changePage("JOBS")} style={{ cursor: "pointer" }}>JOBS</a>
                                <a className="collapse-item" onClick={() => this.changePage("REF_TABLE")} style={{ cursor: "pointer" }}>REF_TABLE</a>
                            </div>
                        </div>
                    </li>

                    <NavItem name="Distance Matrix" classes="fas fa-fw fa-table" active={this.state.page == "Distance Matrix"} handler={this.changePage} />
                    <NavItem name="Tech Assignments" classes="fas fa-fw fa-table" active={this.state.page == "Tech Assignments"} handler={this.changePage} />
                    <NavItem name="Report" classes="fas fa-fw fa-chart-area" active={this.state.page == "Report"} handler={this.changePage} />
                    <NavItem name="Universal Config" classes="fas fa-fw fa-cog" active={this.state.page == "Universal Config"} handler={this.changePage} />

                    <hr className="sidebar-divider" />
                    <div className="sidebar-heading">Other</div>

                    <NavItem name="Contact Me" classes="fas fa-fw fa-user" active={this.state.page == "Contact Me"} handler={this.changePage} />

                    <hr className="sidebar-divider d-none d-md-block" />

                    <div className="text-center d-none d-md-inline">
                        <button className="rounded-circle border-0" id="sidebarToggle" onClick={this.toggleSidebar}></button>
                    </div>
                </ul>
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        {(this.state.page == "Status Monitor") ? <Page pageName="Status Monitor" headers={this.statusMonitorHeaders} api="/api/statusMonitor" /> : null}
                        {(this.state.page == "TECHS") ? <Page pageName="Techs Loaded" headers={this.techsLoadedHeaders} api="/api/techsLoaded" /> : null}
                        {(this.state.page == "JOBS") ? <Page pageName="Jobs Loaded" headers={this.jobsLoadedHeaders} api="/api/jobsLoaded" /> : null}
                        {(this.state.page == "REF_TABLE") ? <Page pageName="Ref Table" /> : null}
                        {(this.state.page == "Distance Matrix") ? <Page pageName="Distance Matrix" /> : null}
                        {(this.state.page == "Tech Assignments") ? <Page pageName="Tech Assignments" /> : null}
                        {(this.state.page == "Report") ? <Page pageName="Report" /> : null}
                        {(this.state.page == "Universal Config") ? <Page pageName="Universal Config" headers={this.configHeaders} api="/api/config" /> : null}
                        {(this.state.page == "Contact Me") ? <Page pageName="Contact Me" /> : null}
                    </div>
                </div>
            </div >
        );
    }
}

class NavItem extends React.Component {
    render() {
        return (
            <li className={"nav-item" + (this.props.active ? " active" : "")}>
                <a className="nav-link" onClick={() => this.props.handler(this.props.name)} style={{ cursor: "pointer" }}>
                    <i className={this.props.classes}></i>
                    <span>{this.props.name}</span>
                </a>
            </li>
        );
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));