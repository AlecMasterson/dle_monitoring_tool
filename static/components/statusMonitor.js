class StatusMonitor extends React.Component {
    constructor(props) {
        super(props);

        this.headers = [
            { name: "ag", filter: null },
            { name: "service", filter: null },
            { name: "run", filter: null },
            { name: "start", filter: null },
            { name: "end", filter: null },
            { name: "status", filter: null }
        ];

        this.clickServiceFilter = this.clickServiceFilter.bind(this);
        this.clickStatusFilter = this.clickStatusFilter.bind(this);
        this.filterData = this.filterData.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.getData = this.getData.bind(this);

        this.state = {
            data: null,
            filteredData: null,
            numDone: "N/A",
            averageRuntime: "N/A",
            numErrors: "N/A",
            totalAgs: "N/A",
            serviceCounts: null,
            statusCounts: null,
            isLoading: false,
            lastUpdated: "Not Updated - Please Refresh",
            filterService: "ALL",
            filterStatus: "ALL"
        };
    }

    clickServiceFilter(filter) {
        this.setState({ filterService: filter }, () => this.filterData());
    }

    clickStatusFilter(filter) {
        this.setState({ filterStatus: filter }, () => this.filterData());
    }

    filterData() {
        if (this.state.data == null) return;

        let temp = this.state.data.filter((item) =>
            (this.state.filterService == "ALL") || (item['service'].toUpperCase() == this.state.filterService)
        );
        temp = temp.filter((item) =>
            (this.state.filterStatus == "ALL") || (item['status'].toUpperCase() == this.state.filterStatus)
        );
        this.setState({ filteredData: temp });
    }

    updateTable() {
        this.setState({ isLoading: true }, () => this.getData());
    }

    async getData() {
        const response = await fetch("/api/statusMonitor");
        const data = await response.json();
        this.setState({
            data: JSON.parse(data['data']),
            numDone: data['numDone'],
            averageRuntime: data['averageRuntime'],
            numErrors: data['numErrors'],
            totalAgs: data['totalAgs'],
            serviceCounts: data['serviceCounts'],
            statusCounts: data['statusCounts'],
            isLoading: false,
            lastUpdated: new Date().toLocaleString()
        }, () => this.filterData());
    }

    render() {
        const progress = this.state.numDone == "N/A" ? 0 : Math.round(this.state.numDone / this.state.totalAgs * 100);

        return (
            <div className="container-fluid">
                <h1 className="mt-4">Status Monitor</h1>

                <div className="mb-4">
                    <div className="alert alert-warning" role="alert">
                        WARNING: This tool is currently in development. Please use kind words when critiquing! Please contact am790d regarding any bugs found.
                    </div>
                    <div className="alert alert-danger pb-0" role="alert">
                        ALERTS:
                        <ul>
                            <li>This tool only works with the JAR version of DLEH. Micro Service support is coming soon.</li>
                            <li>Columns can be sorted. I know the "sorting arrows" aren't there. I'm working on it!</li>
                        </ul>
                    </div>
                </div>

                <h2 className="mt-2">Management</h2>

                <div className="row">
                    <Card type="border-left-primary" size="6" content={
                        <div>
                            <div className="font-weight-bold text-uppercase mb-1 text-primary">Last Updated</div>

                            <h5 className="mt-4 mb-2">{this.state.lastUpdated}</h5>

                            <a className={"btn btn-primary btn-icon-split btn-lg mb-2" + (this.state.isLoading ? " disabled" : "")} onClick={() => this.updateTable()} style={{ cursor: "pointer" }}>
                                <span className="icon text-white-50"><i className="fas fa-download"></i></span>
                                <span className="text text-white">{this.state.isLoading ? "Loading..." : "Refresh"}</span>
                            </a>
                        </div>
                    } />
                </div>

                <h2 className="mt-2">Statistics</h2>

                <div className="row">
                    <Card type="border-left-info" size="6 col-xl-3" content={
                        <InfoCard type="info" title={"Progress : " + this.state.numDone + " of " + this.state.totalAgs} value={progress + "%"} extra={
                            <div className="progress">
                                <div
                                    className="progress-bar bg-info"
                                    role="progressbar"
                                    style={{ width: progress + "%" }}
                                    aria-valuemin="0"
                                    aria-valuenow={progress}
                                    aria-valuemax="100">
                                </div>
                            </div>
                        } />
                    } />
                    <Card type="border-left-danger" size="6 col-xl-3" content={
                        <InfoCard type="danger" title="Number of Errors" value={this.state.numErrors} extra={null} />
                    } />
                    <Card type="border-left-info" size="6 col-xl-3" content={
                        <InfoCard type="info" title="Average Runtime" value={this.state.averageRuntime + " Minutes"} extra={null} />
                    } />
                    <Card type="border-left-success" size="6 col-xl-3" content={
                        <InfoCard type="success" title="Money Saved" value="$ PRICELESS" extra={null} />
                    } />
                </div>

                <h2 className="mt-2">Filtering</h2>

                <div className="row">
                    <Card type="border-left-primary" size="6" content={
                        <div>
                            <div className="font-weight-bold text-uppercase mb-1 text-primary">Service</div>
                            <ul className="list-group">
                                {filterItem({ name: "ALL", active: this.state.filterService == "ALL", count: (this.state.serviceCounts == null ? "N/A" : this.state.serviceCounts['ALL']), clickHandler: this.clickServiceFilter })}
                                {filterItem({ name: "LOADDATA", active: this.state.filterService == "LOADDATA", count: (this.state.serviceCounts == null ? "N/A" : this.state.serviceCounts['LOADDATA']), clickHandler: this.clickServiceFilter })}
                                {filterItem({ name: "DISTANCEMATRIX", active: this.state.filterService == "DISTANCEMATRIX", count: (this.state.serviceCounts == null ? "N/A" : this.state.serviceCounts['DISTANCEMATRIX']), clickHandler: this.clickServiceFilter })}
                                {filterItem({ name: "OPTAPLANNER", active: this.state.filterService == "OPTAPLANNER", count: (this.state.serviceCounts == null ? "N/A" : this.state.serviceCounts['OPTAPLANNER']), clickHandler: this.clickServiceFilter })}
                                {filterItem({ name: "ASSIGN", active: this.state.filterService == "ASSIGN", count: (this.state.serviceCounts == null ? "N/A" : this.state.serviceCounts['ASSIGN']), clickHandler: this.clickServiceFilter })}
                            </ul>
                        </div>
                    } />
                    <Card type="border-left-primary" size="6" content={
                        <div>
                            <div className="font-weight-bold text-uppercase mb-1 text-primary">Status</div>
                            <ul className="list-group">
                                {filterItem({ name: "ALL", active: this.state.filterStatus == "ALL", count: (this.state.statusCounts == null ? "N/A" : this.state.statusCounts['ALL']), clickHandler: this.clickStatusFilter })}
                                {filterItem({ name: "IN PROGRESS", active: this.state.filterStatus == "IN PROGRESS", count: (this.state.statusCounts == null ? "N/A" : this.state.statusCounts['IN PROGRESS']), clickHandler: this.clickStatusFilter })}
                                {filterItem({ name: "DONE", active: this.state.filterStatus == "DONE", count: (this.state.statusCounts == null ? "N/A" : this.state.statusCounts['DONE']), clickHandler: this.clickStatusFilter })}
                                {filterItem({ name: "ERROR", active: this.state.filterStatus == "ERROR", count: (this.state.statusCounts == null ? "N/A" : this.state.statusCounts['ERROR']), clickHandler: this.clickStatusFilter })}
                            </ul>
                        </div>
                    } />
                </div>

                <h2 className="mt-2">Table</h2>

                <div className="row">
                    <Card type="border-left-primary" size="12" content={
                        <Table headers={this.headers} data={this.state.filteredData} />
                    } />
                </div>
            </div >
        );
    }
}

function filterItem(props) {
    return (
        <li className={"list-group-item d-flex justify-content-between align-items-center " + (props.active ? "active" : "")} style={{ cursor: "pointer" }} onClick={() => props.clickHandler(props.name)}>
            {props.name}
            <span className={"badge badge-pill " + (props.active ? "badge-light" : "badge-primary")}>{props.count}</span>
        </li>
    );
}

class Card extends React.Component {
    render() {
        const clickContent = this.props.content;
        return (
            <div className={"mb-4 col-md-" + this.props.size}>
                <div className={"card shadow text-uppercase " + this.props.type} style={this.props.style} onClick={(this.props.clickHandler != null) ? () => this.props.clickHandler(clickContent) : null}>
                    <div className="card-body">
                        {this.props.content}
                    </div>
                </div>
            </div>
        );
    }
}

class InfoCard extends React.Component {
    render() {
        return (
            <div>
                <div className={"text-xs font-weight-bold text-uppercase mb-1 text-" + this.props.type}>{this.props.title}</div>
                <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                        <div className="h5 mb-0 mr-3 font-weight-bold text-uppercase text-gray-800">{this.props.value}</div>
                    </div>
                    <div className="col">{this.props.extra}</div>
                </div>
            </div>
        );
    }
}