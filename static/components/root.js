class Root extends React.Component {
    constructor(props) {
        super(props);

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.changePage = this.changePage.bind(this);

        this.state = { sidebarToggled: false, currentPage: "STATUS MONITOR" };
    }

    toggleSidebar() {
        this.setState({ sidebarToggled: !this.state.sidebarToggled });
    }

    changePage(newPage) {
        this.setState({ currentPage: newPage });
    }

    render() {
        const sidebarToggled = this.state.sidebarToggled;
        const pageName = this.state.currentPage;

        let page = null;
        if (pageName == "STATUS MONITOR") {
            page = <StatusMonitor />
        }
        if (pageName == "TECHS") {
            page = <Structure pageName="TECHS LOADED" api="/api/techsLoaded" headers={["ag", "technicianId", "geoGrp", "capacity"]} />
        }
        if (pageName == "JOBS") {
            page = <Structure pageName="JOBS LOADED" api="/api/jobsLoaded" headers={["ag", "wrid", "jobType", "geoGrp", "estTechDur"]} />
        }
        if (pageName == "UNIVERSAL CONFIG") {
            page = <Structure pageName="UNIVERSAL CONFIG" api="/api/config" headers={["ag", "agRouting", "actual_time", "overtime", "durations"]} />
        }
        if (page == null) {
            page = <h1 className="font-weight-bold text-uppercase text-center mt-4">"{pageName}" PAGE COMING SOON</h1>;
        }

        return (
            < div id="wrapper" >
                <ul className={"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" + (sidebarToggled ? " toggled" : "")} id="mainSidebar">

                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href="">
                        <div className="sidebar-brand-icon">D<sup>2</sup></div>
                        <div className="sidebar-brand-text mx-3">DLEH Admin App</div>
                    </a>

                    <hr className="sidebar-divider" />
                    <div className="sidebar-heading">TOOLS</div>

                    <NavItem name="STATUS MONITOR" classes="fas fa-fw fa-table" active={pageName == "STATUS MONITOR"} handler={this.changePage} />

                    <hr className="sidebar-divider" />
                    <div className="sidebar-heading">DATABASE VIEWER</div>

                    <li className={"nav-item" + ((pageName == "TECHS" || pageName == "JOBS" || pageName == "REF_TABLE") ? " active" : "")}>
                        <a className="nav-link collapsed" href="" data-toggle="collapse" data-target="#loadDataSidebar" aria-expanded="true" aria-controls="loadDataSidebar">
                            <i className="fas fa-fw fa-folder"></i>
                            <span>LOAD DATA</span>
                        </a>
                        <div id="loadDataSidebar" className="collapse" aria-labelledby="headingTwo" data-parent="#mainSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">LOAD DATA TABLES</h6>
                                <a className="collapse-item" onClick={() => this.changePage("TECHS")} style={{ cursor: "pointer" }}>TECHS</a>
                                <a className="collapse-item" onClick={() => this.changePage("JOBS")} style={{ cursor: "pointer" }}>JOBS</a>
                                <a className="collapse-item" onClick={() => this.changePage("REF_TABLE")} style={{ cursor: "pointer" }}>REF_TABLE</a>
                            </div>
                        </div>
                    </li>

                    <NavItem name="DISTANCE MATRID" classes="fas fa-fw fa-table" active={pageName == "DISTANCE MATRIX"} handler={this.changePage} />
                    <NavItem name="TECH ASSIGNMENTS" classes="fas fa-fw fa-table" active={pageName == "TECH ASSIGNMENTS"} handler={this.changePage} />
                    <NavItem name="REPORT" classes="fas fa-fw fa-chart-area" active={pageName == "REPORT"} handler={this.changePage} />
                    <NavItem name="UNIVERSAL CONFIG" classes="fas fa-fw fa-cog" active={pageName == "UNIVERSAL CONFIG"} handler={this.changePage} />

                    <hr className="sidebar-divider" />
                    <div className="sidebar-heading">OTHER</div>

                    <NavItem name="CONTACT ME" classes="fas fa-fw fa-user" active={pageName == "CONTACT ME"} handler={this.changePage} />

                    <hr className="sidebar-divider d-none d-md-block" />

                    <div className="text-center d-none d-md-inline">
                        <button className="rounded-circle border-0" id="sidebarToggle" onClick={this.toggleSidebar}></button>
                    </div>
                </ul>
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        {page}
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