class DataTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let columns = [];
        for (const [index, item] of this.props.headers.entries()) {
            columns.push(
                <TableHeaderColumn
                    className="text-uppercase"
                    isKey={index == 0} key={item.name}
                    headerAlign="center" dataAlign="center"
                    dataField={item.name} dataSort={item.sort}
                    filter={item.filter == null ? null : item.filter}
                >
                    {item.name}
                </TableHeaderColumn>);
        }

        const options = {
            exportCSVBtn: (onClick) => {
                return <ExportCSVButton style={{ backgroundColor: "#0087b8" }} />;
            }
        };

        return (
            <BootstrapTable data={this.props.data} options={options} striped exportCSV hover bordered pagination version="4">
                {columns}
            </BootstrapTable>
        );
    }
}