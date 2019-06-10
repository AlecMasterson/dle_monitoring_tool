class Table extends React.Component {
    constructor(props) {
        super(props);

        this.updateTable = this.updateTable.bind(this);
        this.state = { data: null, isLoading: false, lastUpdated: "Not Updated - Please Refresh" };
    }

    updateTable() {
        this.setState({ isLoading: true }, () => this.getData());
    }

    async getData() {
        const response = await fetch(this.props.api);
        const data = await response.json();
        this.setState({ data: data, isLoading: false, lastUpdated: new Date().toLocaleString() });
    }

    render() {
        return (
            <div>
                <div className="d-none d-sm-none d-md-none d-lg-block">
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h4>Last Updated: {this.state.lastUpdated}</h4>
                        <a className={"btn btn-primary btn-icon-split btn-lg" + (this.state.isLoading ? " disabled" : "")} onClick={() => this.updateTable()} style={{ cursor: "pointer" }}>
                            <span className="icon text-white-50"><i className="fas fa-download"></i></span>
                            <span className="text text-white">Refresh</span>
                        </a>
                    </div>
                    <BootstrapTable data={this.state.data} keyField={this.props.headers[0]["name"]} pagination hover condensed striped>
                        {this.props.headers.map((item) =>
                            <TableHeaderColumn
                                dataField={item["name"]}
                                key={item["name"]}
                                dataSort
                                headerAlign="center"
                                dataAlign="center"
                                filter={(item["filter"] != null) ? { type: item["filter"]["type"] } : null}
                            >{item["name"].toUpperCase()}</TableHeaderColumn>
                        )}
                    </BootstrapTable>
                </div>
                <h2 className="d-none d-block d-sm-block d-md-block d-lg-none text-center">
                    Use a Larger Screen to View the Table
                </h2>
            </div>
        );
    }
}