class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentPage: "WELCOME" };
    }

    render() {
        const currentPage = this.state.currentPage;

        let page = <h1 className="font-weight-bold text-uppercase text-center mt-4 mx-4">"{currentPage}" PAGE COMING SOON</h1>;
        if (currentPage == "WELCOME") page = <h1 className="font-weight-bold text-uppercase text-center mt-4 mx-4">Welcome to the DLEH Admin App</h1>;
        if (currentPage == "STATUS MONITOR") page = <Page pageName="STATUS MONITOR" type={StatusMonitor} />;

        return (
            <div id="wrapper">
                <NavBar currentPage={currentPage} changePage={(newPage) => this.setState({ currentPage: newPage })} />

                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content" style={{ display: "grid", height: "100%" }}>
                        {page}
                    </div>
                </div>
            </div>
        );
    }
}

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.pageContent = React.createRef();

        this.updatePage = this.updatePage.bind(this);
        this.state = { loading: false, lastUpdated: "Not Updated - Please Refresh" };
    }

    async updatePage() {
        await this.pageContent.current.update();
        this.setState({ loading: false, lastUpdated: new Date().toLocaleString() });
    }

    render() {
        const loading = this.state.loading;
        const lastUpdated = this.state.lastUpdated;

        return (
            <div>
                <nav className="navbar navbar-expand navbar-light bg-white shadow justify-content-between mb-4">
                    <a className="navbar-brand font-weight-bold text-uppercase" style={{ cursor: "default" }}>{this.props.pageName}</a>

                    {onlyShowOnBig(
                        <form className="form-inline">
                            <span className="navbar-text mr-4">
                                <div className="font-weight-bold text-uppercase">
                                    {"LAST UPDATED: "}
                                    <br></br>
                                    {lastUpdated}
                                </div>
                            </span>
                            <button type="button" className={"btn btn-primary btn-icon-split btn-lg " + (loading ? "disabled" : "")} onClick={() => (!loading) ? this.setState({ loading: true }, this.updatePage) : null}>
                                <span className="icon text-white-50"><i className="fas fa-download"></i></span>
                                <span className="text text-white">{loading ? "Loading..." : "Refresh"}</span>
                            </button>
                        </form>
                    )}
                </nav>

                <div className="container-fluid">
                    {onlyShowOnBig(
                        React.createElement(this.props.type, { props: null, ref: this.pageContent })
                    )}
                    {onlyShowOnSmall(
                        <h2 className="font-weight-bold text-uppercase text-center mt-2">
                            {"Use a Larger Screen to View"}
                        </h2>
                    )}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));