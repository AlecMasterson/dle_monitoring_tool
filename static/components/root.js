class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentPage: "MONITOR" };
    }

    render() {
        const currentPage = this.state.currentPage;

        let page = <h1 className="font-weight-bold text-uppercase text-center mt-4 mx-4">"{currentPage}" PAGE COMING SOON</h1>;
        if (currentPage == "MONITOR") page = <StatusMonitor />;

        return (
            <div>
                <nav className="navbar navbar-dark navbar-expand-lg py-3" style={{ backgroundColor: "#2A68A9" }}>
                    <a className="navbar-brand" href="#">DLE Monitoring Tool</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNavBar" aria-controls="mainNavBar" aria-expanded="false" aria-label="Toggle Navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div id="mainNavBar" className="collapse navbar-collapse justify-content-between">
                        <div></div>
                        <ul className="navbar-nav">
                            {mainNavBarItem({ name: "MONITOR", icon: "fa-wrench", active: (currentPage == "MONITOR"), changePage: (newPage) => this.setState({ currentPage: newPage }) })}
                            {mainNavBarItem({ name: "REPORTING", icon: "fa-chart-bar", active: (currentPage == "REPORTING"), changePage: (newPage) => this.setState({ currentPage: newPage }) })}
                            {mainNavBarItem({ name: "CONTACT", icon: "fa-user", active: (currentPage == "CONTACT"), changePage: (newPage) => this.setState({ currentPage: newPage }) })}
                        </ul>
                    </div>
                </nav>

                {page}
            </div>
        );
    }
}

function mainNavBarItem(props) {
    return (
        <li className={"nav-item " + (props.active ? "active" : "")} style={{ cursor: "pointer" }} onClick={() => props.changePage(props.name)}>
            <a className="nav-link">
                <i className={"mr-1 fas fa-fw " + props.icon}></i>
                <span>{props.name}</span>
            </a>
        </li>
    );
}

ReactDOM.render(<Root />, document.getElementById('root'));