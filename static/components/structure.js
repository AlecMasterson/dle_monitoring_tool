class Structure extends React.Component {
    constructor(props) {
        super(props);

        this.updateTable = this.updateTable.bind(this);
        this.getData = this.getData.bind(this);

        this.state = {
            data: null,
            isLoading: false,
            lastUpdated: "Not Updated - Please Refresh"
        };
    }

    updateTable() {
        this.setState({ isLoading: true }, () => this.getData());
    }

    async getData() {
        const response = await fetch(this.props.api);
        const responseData = await response.json();
        this.setState({
            data: JSON.parse(responseData["data"]),
            isLoading: false,
            lastUpdated: new Date().toLocaleString()
        });
    }

    render() {
        const data = this.state.data;
        const isLoading = this.state.isLoading;
        const lastUpdated = this.state.lastUpdated;

        return (
            <div className="container-fluid">
                <h1 className="font-weight-bold text-uppercase mt-4">{this.props.pageName}</h1>

                {getAlerts()}

                {getSectionTitle("MANAGEMENT")}
                <div className="row">
                    {refresh({
                        isLoading: isLoading,
                        lastUpdated: lastUpdated,
                        updateTable: this.updateTable
                    })}
                </div>

                {getSectionTitle("TABLE")}
                <div className="row">
                    {table({ headers: this.props.headers, data: data })}
                </div>
            </div>
        );
    }
}