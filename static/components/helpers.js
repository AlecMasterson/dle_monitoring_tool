function card(props) {
    return (
        <div className={"mb-4 col-md-" + props.size}>
            <div className={"card shadow border-left-" + props.type}>
                {props.header != null ? <div className="card-header">{props.header}</div> : null}
                <div className="card-body">
                    {props.content}
                </div>
            </div>
        </div>
    );
}

function infoCard(props) {
    return (
        card({
            type: props.type,
            size: "6 col-xl-3",
            header: (
                <div className={"font-weight-bold text-uppercase text-" + props.type}>{props.title}</div>
            ),
            content: (
                <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                        <h5 className="font-weight-bold text-uppercase mb-0 mr-3 text-gray-800">{props.value}</h5>
                    </div>
                    {props.extra != null ? <div className="col">{props.extra}</div> : null}
                </div>
            )
        })
    );
}

function filterCard(props) {
    return (
        card({
            type: "primary",
            size: "6",
            header: (
                <div className="font-weight-bold text-uppercase text-primary">{props.filterName}</div>
            ),
            content: (
                <ul className="list-group">
                    {props.filters.map((item) =>
                        filterItem({ name: item.name, active: item.active, count: item.count, clickHandler: item.clickHandler })
                    )}
                </ul>
            )
        })
    );
}

function filterItem(props) {
    return (
        <li key={props.name} className={"list-group-item font-weight-bold text-uppercase d-flex justify-content-between align-items-center " + (props.active ? "active" : "")} style={{ cursor: "pointer" }} onClick={() => props.clickHandler(props.name)}>
            {props.name}
            <span className={"badge badge-pill " + (props.active ? "badge-light" : "badge-primary")}>{props.count}</span>
        </li>
    );
}

function refresh(props) {
    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar justify-content-between mb-4 static-top shadow">
            <a className="navbar-brand font-weight-bold text-uppercase" style={{ cursor: "default" }}>{props.pageName}</a>

            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars"></i>
            </button>

            <form className="form-inline">
                <span className="navbar-text mr-4">
                    <div className="font-weight-bold text-uppercase">
                        LAST UPDATED:
                        <br></br>
                        {props.lastUpdated}
                    </div>
                </span>
                <button className={"btn btn-primary btn-icon-split btn-lg " + (props.isLoading ? "disabled" : "")} type="button" onClick={() => props.updateTable()}>
                    <span className="icon text-white-50"><i className="fas fa-download"></i></span>
                    <span className="text text-white">{props.isLoading ? "Loading..." : "Refresh"}</span>
                </button>
            </form>
        </nav>
    );
}

function table(props) {
    return (
        <div>
            {onlyShowOnBig(
                card({
                    type: "primary",
                    size: "12",
                    content: (
                        <BootstrapTable data={props.data} keyField={props.headers[0]} pagination hover condensed striped>
                            {props.headers.map((item) =>
                                <TableHeaderColumn
                                    dataField={item}
                                    key={item}
                                    dataSort
                                    headerAlign="center"
                                    dataAlign="center"
                                >{item.toUpperCase()}</TableHeaderColumn>
                            )}
                        </BootstrapTable>
                    )
                })
            )}
            {onlyShowOnSmall(
                card({
                    type: "primary",
                    size: "12",
                    content: (
                        <h2 className="font-weight-bold text-uppercase text-center mt-2">
                            Use a Larger Screen to View the Table
                        </h2>
                    )
                })
            )}
        </div>
    );
}

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
        this.state = { show: true };
    }

    close() {
        this.setState({ show: false }, () => this.props.handler());
    }

    render() {
        const show = this.state.show;

        return (
            <div className={"modal fade " + show ? "show" : ""} style={{ display: show ? "block" : "none" }} aria-modal={show ? "true" : "false"} aria-hidden={show ? "false" : "true"}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                        </div>
                        <div className="modal-body">
                            {this.props.body}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={() => this.close()}>OKAY</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function getSectionTitle(name) {
    return <h2 className="font-weight-bold text-uppercase mt-2">{name}</h2>;
}

function onlyShowOnSmall(content) {
    return <div className="d-none d-block d-sm-block d-md-block d-lg-none">{content}</div>;
}

function onlyShowOnBig(content) {
    return <div className="d-none d-sm-none d-md-none d-lg-block">{content}</div>;
}

function getAlert() {
    return (
        <div className="alert alert-danger mb-4" role="alert">
            ALERT: Columns can be sorted. I know the \"sorting arrows\" aren't there. I'm working on it!
        </div>
    );
}