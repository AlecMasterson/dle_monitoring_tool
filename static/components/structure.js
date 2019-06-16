class Structure extends React.Component {
    constructor(props) {
        super(props);

        this.getData = this.getData.bind(this);

        this.state = {
            data: null,
            isLoading: false,
            lastUpdated: "Not Updated - Please Refresh"
        };
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
        console.log(data);
        const isLoading = this.state.isLoading;
        const lastUpdated = this.state.lastUpdated;

        return (
            <div>
                {refresh({
                    pageName: this.props.pageName,
                    isLoading: isLoading,
                    lastUpdated: lastUpdated,
                    updateTable: (() => this.setState({ isLoading: true }, () => this.getData()))
                })}

                <div className="container-fluid">
                    {getAlert()}

                    {getSectionTitle("TABLE")}
                    <div className="row">
                        {table({ headers: this.props.headers, data: data })}
                    </div>
                </div>
            </div>
        );
    }
}