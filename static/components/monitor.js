class StatusMonitor extends React.Component {
    constructor(props) {
        super(props);

        this.update = this.update.bind(this);

        const defaultCounts = { "IN PROGRESS": "N/A", "DONE": "N/A", "ERROR": "N/A" };
        this.state = {
            sidebar: true,

            autoUpdate: false,
            loading: false,
            lastUpdated: "Not Updated - Please Refresh",

            serviceCounts: {
                "LOADDATA": defaultCounts, "SAMELOCATION": defaultCounts,
                "DISTANCEMATRIX": defaultCounts, "OPTAPLANNER": defaultCounts,
                "ASSIGN": defaultCounts, "CHECKLOG": defaultCounts,
            },

            data: [],
            notStarted: [],
            completed: [],
            agErrors: [],
            clocklineErrors: [],
            assignmentErrors: []
        };
    }

    componentDidMount() {
        this.refreshTimer = setInterval(
            () => (this.state.autoUpdate && !this.state.loading) ? this.setState({ loading: true }, () => this.update()) : null, 45000
        );
    }

    componentWillUnmount() {
        clearInterval(this.refreshTimer);
    }

    async update() {
        const response = await fetch("/api/statusMonitor");
        const responseData = await response.json();
        this.setState({
            loading: false,
            lastUpdated: new Date().toLocaleString(),

            serviceCounts: responseData["serviceCounts"],

            data: JSON.parse(responseData["data"]),
            notStarted: responseData["notStarted"],
            completed: responseData["completed"],
            agErrors: responseData["agErrors"],
            clocklineErrors: responseData["clocklineErrors"],
            assignmentErrors: responseData["assignmentErrors"]
        });
    }

    render() {
        const sidebar = this.state.sidebar;

        const autoUpdate = this.state.autoUpdate;
        const loading = this.state.loading;
        const lastUpdated = this.state.lastUpdated;

        const serviceCounts = this.state.serviceCounts;

        const data = this.state.data;
        const notStarted = this.state.notStarted;
        const completed = this.state.completed;
        const agErrors = this.state.agErrors;
        const clocklineErrors = this.state.clocklineErrors;
        const assignmentErrors = this.state.assignmentErrors;

        const progress = [
            {
                "TYPE": "IN PROGRESS",
                "LOADDATA": serviceCounts["LOADDATA"]["IN PROGRESS"],
                "DISTANCEMATRIX": serviceCounts["DISTANCEMATRIX"]["IN PROGRESS"],
                "OPTAPLANNER": serviceCounts["OPTAPLANNER"]["IN PROGRESS"],
                "ASSIGN": serviceCounts["ASSIGN"]["IN PROGRESS"],
                "CHECKLOG": serviceCounts["CHECKLOG"]["IN PROGRESS"]
            }, {
                "TYPE": "DONE",
                "LOADDATA": serviceCounts["LOADDATA"]["DONE"],
                "DISTANCEMATRIX": serviceCounts["DISTANCEMATRIX"]["DONE"],
                "OPTAPLANNER": serviceCounts["OPTAPLANNER"]["DONE"],
                "ASSIGN": serviceCounts["ASSIGN"]["DONE"],
                "CHECKLOG": serviceCounts["CHECKLOG"]["DONE"]
            }, {
                "TYPE": "ERROR",
                "LOADDATA": serviceCounts["LOADDATA"]["ERROR"],
                "DISTANCEMATRIX": serviceCounts["DISTANCEMATRIX"]["ERROR"],
                "OPTAPLANNER": serviceCounts["OPTAPLANNER"]["ERROR"],
                "ASSIGN": serviceCounts["ASSIGN"]["ERROR"],
                "CHECKLOG": serviceCounts["CHECKLOG"]["ERROR"]
            }
        ];

        /*
        {startModal ? <Modal handler={() => this.setState({ startModal: false })} title="MONITOR ALERT" body={
                            "This is a tool is to be used by the on-call team between midnight and 5AM CT. If this tool is used outside those hours or by anyone not qualified, the data may be incorrect and/or confusing."
                        } /> : null}
        */

        return (
            <div id="wrapper" className={"d-flex " + (sidebar ? "" : "toggled")}>
                <div id="sidebar-wrapper">
                    <div className="list-group list-group-flush" style={{ borderBottom: "1px solid #6A707A" }}>
                        {Modal({
                            title: "Settings", body: (
                                <div className="container">
                                    <div className="row mb-4 alert alert-danger">
                                        <span>I know the "styling" of this popup isn't great. I'm sorry...</span>
                                    </div>
                                    <form>
                                        <div className="row">
                                            <span className="font-weight-bold text-uppercase">{"LAST UPDATED:"}<br />{lastUpdated}</span>
                                        </div>
                                        <div className="row my-2">
                                            <div className="custom-control custom-switch">
                                                <input id="autoRefreshCheckbox" type="checkbox" className="custom-control-input" onClick={() => this.setState({ autoUpdate: !autoUpdate })} />
                                                <label className="custom-control-label" htmlFor="autoRefreshCheckbox">Auto Refresh</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <button type="button" className={"btn btn-secondary " + (loading ? "disabled" : "")} style={{ cursor: (loading ? "default" : "pointer") }} onClick={() => (!loading) ? this.setState({ loading: true }, this.setState({ loading: true }, () => this.update())) : null}>
                                                <span className="icon text-white-50 mr-1"><i className="fas fa-download"></i></span>
                                                <span className="text text-white mr-1">{loading ? "Loading..." : "Refresh"}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )
                        })}
                        <div className="sidebar-heading d-flex align-items-center justify-content-between list-group-item font-weight-bold text-white text-uppercase py-3">
                            <span>{"OVERVIEW"}</span>
                            <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#SettingsModal">
                                <span className="icon text-white-50"><i className="fas fa-cog"></i></span>
                            </button>
                        </div>

                        {SidebarItem({
                            title: "Not Started", value: (notStarted.length + " of 282"), body: (
                                <DataTable headers={[{ name: "ag" }]} data={notStarted} pagination={true} />
                            )
                        })}
                        {SidebarItem({
                            title: "Completed", value: (completed.length + " of 282"), extraClasses: "sidebar-item-border-top", body: (
                                <DataTable headers={[{ name: "ag" }]} data={completed} pagination={true} />
                            )
                        })}

                        <div className="sidebar-heading list-group-item font-weight-bold text-white text-uppercase py-3">
                            <span>{"ERROR WATCH"}</span>
                        </div>

                        {SidebarItem({
                            title: "AG Errors", value: agErrors.length, extraClasses: "sidebar-item-border-top", body: (
                                <DataTable headers={[{ name: "ag" }, { name: "service" }, { name: "run" }]} data={agErrors} pagination={true} />
                            )
                        })}
                        {SidebarItem({
                            title: "ClockLine Errors", value: clocklineErrors.length, extraClasses: "sidebar-item-border-top", body: (
                                <DataTable headers={[{ name: "clockline" }, { name: "run" }]} data={clocklineErrors} pagination={true} />
                            )
                        })}
                        {SidebarItem({
                            title: "Assignment Errors", value: assignmentErrors.length, extraClasses: "sidebar-item-border-top", body: (
                                <DataTable headers={[{ name: "ag" }, { name: "perc_failed" }]} data={assignmentErrors} pagination={true} />
                            )
                        })}

                        <div className="sidebar-heading list-group-item font-weight-bold text-white text-uppercase py-3">
                            <span>{"HELP"}</span>
                        </div>

                        {SidebarItem({
                            title: "Universal Config", body: (
                                <h4>{"Coming Soon"}</h4>
                            )
                        })}
                        {SidebarItem({
                            title: "Error - What Now", extraClasses: "sidebar-item-border-top", body: (
                                <h4>{"Coming Soon"}</h4>
                            )
                        })}
                        {SidebarItem({
                            title: "Who to Contact", extraClasses: "sidebar-item-border-top", body: (
                                <h4>{"Coming Soon"}</h4>
                            )
                        })}
                    </div>
                </div>

                <div id="page-content-wrapper">
                    <button className="btn btn-outline-dark" style={{ borderRadius: "0px" }} onClick={() => this.setState({ sidebar: !sidebar })}>
                        <span className="icon"><i className={"fas fa-arrow-" + (sidebar ? "left" : "right")}></i></span>
                    </button>

                    <div className="container-fluid col-10 my-4">
                        <div className="row">
                            <div className="d-none d-sm-none d-md-none d-lg-block col-12">
                                <h3 className="font-weight-bold text-uppercase">{"Progress Chart"}</h3>
                                <DataTable headers={[
                                    { name: "TYPE" },
                                    { name: "LOADDATA" },
                                    { name: "DISTANCEMATRIX" },
                                    { name: "OPTAPLANNER" },
                                    { name: "ASSIGN" },
                                    { name: "CHECKLOG" }
                                ]} data={progress} pagination={false} />

                                <h3 className="font-weight-bold text-uppercase mt-4">{"Main Table"}</h3>
                                <DataTable headers={[
                                    { name: "ag", filter: { type: "TextFilter", delay: 500 } },
                                    { name: "service", filter: { type: "TextFilter", delay: 500 } },
                                    { name: "run", filter: { type: "NumberFilter", delay: 500 } },
                                    { name: "start", filter: { type: "TextFilter", delay: 500 } },
                                    { name: "end", filter: { type: "TextFilter", delay: 500 } },
                                    { name: "status", filter: { type: "TextFilter", delay: 500 } }
                                ]} data={data} pagination={true} />
                            </div>
                            <div className="d-none d-block d-sm-block d-md-block d-lg-none text-center col-12">
                                <h2 className="font-weight-bold text-uppercase">
                                    {"Use a Larger Screen to View the Table"}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

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
                    dataField={item.name} dataSort={true}
                    filter={item.filter == null ? null : item.filter}
                >
                    {item.name}
                </TableHeaderColumn>);
        }
        return (
            <BootstrapTable data={this.props.data} striped hover pagination={this.props.pagination} version="4">
                {columns}
            </BootstrapTable>
        );
    }
}

function Modal(props) {
    return (
        <div id={props.title.split(" ").join("") + "Modal"} className="modal fade">
            <div className="modal-md modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header py-3">
                        <h4 className="modal-title font-weight-bold text-uppercase">{props.title}</h4>
                    </div>

                    <div className="modal-body">
                        {props.body}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarItem(props) {
    return (
        <div>
            {Modal({ title: props.title, body: props.body })}
            <div
                className={"sidebar-item list-group-item list-group-item-action text-white text-uppercase py-4 " + props.extraClasses}
                data-toggle="modal"
                data-target={"#" + props.title.split(" ").join("") + "Modal"}
            >
                <span className="font-weight-bold">{props.title + (props.value == null ? "" : ": ")}</span>
                {props.value == null ? null : <small>{props.value}</small>}
            </div>
        </div>
    );
}