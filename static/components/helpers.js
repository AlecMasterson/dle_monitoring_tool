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
        card({
            type: "primary",
            size: "6",
            header: (
                <div className="font-weight-bold text-uppercase text-primary">LAST UPDATED</div>
            ),
            content: (
                <div>
                    <h5 className="font-weight-bold text-uppercase mb-2">{props.lastUpdated}</h5>

                    <button className={"btn btn-primary btn-icon-split btn-lg " + (props.isLoading ? "disabled" : "")} onClick={() => props.updateTable()}>
                        <span className="icon text-white-50"><i className="fas fa-download"></i></span>
                        <span className="text text-white">{props.isLoading ? "Loading..." : "Refresh"}</span>
                    </button>
                </div>
            )
        })
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

function getSectionTitle(name) {
    return <h2 className="font-weight-bold text-uppercase mt-2">{name}</h2>;
}

function onlyShowOnSmall(content) {
    return <div className="d-none d-block d-sm-block d-md-block d-lg-none">{content}</div>;
}

function onlyShowOnBig(content) {
    return <div className="d-none d-sm-none d-md-none d-lg-block">{content}</div>;
}

function getAlerts() {
    return (
        <div className="mb-4">
            <div className="alert alert-warning" role="alert">
                WARNING: This tool is currently in development. Please use kind words when critiquing! Please contact am790d regarding any bugs found.
            </div>
            <div className="alert alert-danger pb-0" role="alert">
                ALERTS:
                <ul>
                    <li>Columns can be sorted. I know the "sorting arrows" aren't there. I'm working on it!</li>
                </ul>
            </div>
        </div>
    );
}