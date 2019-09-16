class Overview extends React.Component {
    constructor(props) {
        super(props);

        this.headers1 = [
            { name: "ROUTING AREA", sort: true, filter: { type: "TextFilter", delay: 500 } },
            { name: "ROUTING TYPE", sort: true, filter: { type: "TextFilter", delay: 500 } },
            { name: "START", sort: true }
        ];
        this.headers2 = [
            { name: "ROUTING AREA", sort: true, filter: { type: "TextFilter", delay: 500 } },
            { name: "ROUTING TYPE", sort: true, filter: { type: "TextFilter", delay: 500 } },
            { name: "SERVICE", sort: true, filter: { type: "TextFilter", delay: 500 } },
            { name: "START", sort: true }
        ];
    }

    render() {
        const pending = this.props.pending;
        const inProgress = this.props.inProgress;
        const completed = this.props.completed;
        const didNotStart = this.props.didNotStart;
        const dleError = this.props.dleError;
        const noAssignments = this.props.noAssignments;

        return (
            <div className="container-fluid col-8 my-4">
                <h2 className="font-weight-bold text-uppercase">{"OVERVIEW"}</h2>
                <ul className="list-group">
                    <OverviewItem name="PENDING" value={pending.length} headers={this.headers1} data={pending} />
                    <OverviewItem name="IN PROGRESS" value={inProgress.length} headers={this.headers1} data={inProgress} />
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
                        className="icon"
                        data-toggle="collapse"
                        data-target={"#" + this.props.name.split(" ").join("")}
                        onClick={() => this.setState({ collapsed: !collapsed })}
                    >
                        <i className={"fas fa-arrow-" + (collapsed ? "down" : "up")}></i>
                    </span>
                </li>
                <div id={this.props.name.split(" ").join("")} className="collapse">
                    <div className="card px-2 py-2">
                        <DataTable headers={this.props.headers} data={this.props.data} />
                    </div>
                </div>
            </div>
        );
    }
}