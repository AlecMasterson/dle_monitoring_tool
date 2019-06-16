class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.goHome = this.goHome.bind(this);
        this.state = { toggled: false };
    }

    goHome(event) {
        event.preventDefault();
        this.props.changePage("WELCOME");
    }

    render() {
        const toggled = this.state.toggled;

        return (
            <ul className={"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" + (toggled ? " toggled" : "")}>

                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="" style={{ cursor: "pointer" }} onClick={(event) => this.goHome(event)}>
                    <div className="sidebar-brand-icon">D<sup>2</sup></div>
                    <div className="sidebar-brand-text mx-3">DLEH Admin App</div>
                </a>

                {navDivider("TOOLS")}

                {navItem({ name: "STATUS MONITOR", icon: "fa-wrench", active: (this.props.currentPage == "STATUS MONITOR"), changePage: this.props.changePage })}

                {navDivider("PERFORMANCE")}

                {navItem({ name: "REPORT", icon: "fa-chart-area", active: (this.props.currentPage == "REPORT"), changePage: this.props.changePage })}

                {navDivider("DATABASE VIEWER")}

                {navItem({ name: "TECHS", icon: "fa-table", active: (this.props.currentPage == "TECHS"), changePage: this.props.changePage })}
                {navItem({ name: "JOBS", icon: "fa-table", active: (this.props.currentPage == "JOBS"), changePage: this.props.changePage })}
                {navItem({ name: "TECH ASSIGNMENTS", icon: "fa-table", active: (this.props.currentPage == "TECH ASSIGNMENTS"), changePage: this.props.changePage })}

                {navDivider("OTHER")}

                {navItem({ name: "UNIVERSAL CONFIG", icon: "fa-cog", active: (this.props.currentPage == "UNIVERSAL CONFIG"), changePage: this.props.changePage })}
                {navItem({ name: "CONTACT ME", icon: "fa-user", active: (this.props.currentPage == "CONTACT ME"), changePage: this.props.changePage })}

                <hr className="sidebar-divider d-none d-md-block" />

                <div className="text-center d-none d-md-inline">
                    <button id="sidebarToggle" className="rounded-circle border-0" onClick={() => this.setState({ toggled: !toggled })}></button>
                </div>
            </ul>
        );
    }
}

function navDivider(title) {
    return (
        <div>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">{title}</div>
        </div>
    );
}

function navItem(props) {
    return (
        <li className={"nav-item " + (props.active ? "active" : "")}>
            <a className="nav-link" style={{ cursor: "pointer" }} onClick={() => props.changePage(props.name)}>
                <i className={"fas fa-fw " + props.icon}></i>
                <span>{props.name}</span>
            </a>
        </li>
    );
}