class Table extends React.Component {
    render() {
        return (
            <div>
                <div className="d-none d-sm-none d-md-none d-lg-block">
                    <BootstrapTable data={this.props.data} keyField={this.props.headers[0]["name"]} pagination hover condensed striped>
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