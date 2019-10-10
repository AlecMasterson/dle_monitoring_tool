class Overview extends React.Component {
    constructor(props) {
        super(props);

        this.headersProgressChart = ["STATUS", "LOAD DATA", "SAME LOCATION", "DISTANCE MATRIX", "OPTIMIZER", "ASSIGN", "CHECK LOG", "SUMMARY"];

        this.headers1 = [
            { name: "ROUTING_AREA", sort: true, filter: { type: "TextFilter", delay: 500 } },
            { name: "ROUTING_TYPE", sort: true, filter: { type: "TextFilter", delay: 500 } },
            { name: "RUN_TIME_GMT", sort: true, filter: { type: "TextFilter", delay: 500 } }
        ];
        this.headers2 = [
            { name: "ROUTING_AREA", sort: true, filter: { type: "TextFilter", delay: 500 } },
            { name: "ROUTING_TYPE", sort: true, filter: { type: "TextFilter", delay: 500 } },
            { name: "RUN_TIME_GMT", sort: true, filter: { type: "TextFilter", delay: 500 } },
            { name: "SERVICE", sort: true, filter: { type: "TextFilter", delay: 500 } }
        ];
    }

    render() {
        const pending = this.props.pending;
        const inProgress = this.props.inProgress;
        const completed = this.props.completed;
        const didNotStart = this.props.didNotStart;
        const dleError = this.props.dleError;
        const noAssignments = this.props.noAssignments;
        const progressChart = this.props.progressChart;

        const progressChartHeaders = this.headersProgressChart.map((header, index) =>
            <th key={index}>{header}</th>
        );

        const progressChartRows = progressChart.map((row, index) => {
            const columns = this.headersProgressChart.map((header, index2) => <td key={index2}>{row[header]}</td>);
            return <tr key={index}>{columns}</tr>;
        });

        return (
            <div className="container-fluid col-10 my-4">
                <div className="alert alert-primary" role="alert">
                    {"This tool was developed by Alec Masterson (am790d) during his free-time outside of work."}
                    <br />
                    {"Please give feedback and improvement suggestions by October 4th..."}
                </div>

                <h2 className="mt-4 font-weight-bold text-uppercase">{"PROGRESS CHART"}</h2>
                <div className="card text-center">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered table-sm">
                                <thead>
                                    <tr>{progressChartHeaders}</tr>
                                </thead>
                                <tbody>
                                    {progressChartRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <h2 className="mt-4 font-weight-bold text-uppercase">{"OVERVIEW"}</h2>
                <ul className="list-group">
                    <OverviewItem name="PENDING" value={pending.length} headers={this.headers1} data={pending} />
                    <OverviewItem name="IN PROGRESS" value={inProgress.length} headers={this.headers2} data={inProgress} />
                    <OverviewItem name="COMPLETED" value={completed.length} headers={this.headers1} data={completed} />
                </ul>

                <h2 className="mt-4 font-weight-bold text-uppercase">{"ERRORS"}</h2>
                <ul className="list-group">
                    <OverviewItem name="DID NOT START" value={didNotStart.length} headers={this.headers1} data={didNotStart} />
                    <OverviewItem name="DLE ERROR" value={dleError.length} headers={this.headers2} data={dleError} />
                    <OverviewItem name="NO ASSIGNMENTS" value={noAssignments.length} headers={this.headers1} data={noAssignments} />
                </ul>
            </div>
        );
    }
}

class OverviewItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true
        };
    }

    render() {
        const collapsed = this.state.collapsed;

        return (
            <div>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <h3 className="mb-0 text-uppercase">
                        {this.props.name + ": " + this.props.value}
                    </h3>
                    <span
                        className="icon d-none d-sm-block"
                        data-toggle="collapse"
                        data-target={"#" + this.props.name.split(" ").join("")}
                        onClick={() => this.setState({ collapsed: !collapsed })}
                    >
                        <i className={"fas fa-arrow-" + (collapsed ? "down" : "up")}></i>
                    </span>
                </li>
                <div id={this.props.name.split(" ").join("")} className="collapse">
                    <div className="card px-2 py-2 d-none d-sm-block">
                        <DataTable headers={this.props.headers} data={this.props.data} />
                    </div>
                </div>
            </div>
        );
    }
}