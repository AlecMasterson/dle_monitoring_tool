class StatusMonitor extends React.Component {
    constructor(props) {
        super(props);

        this.headers = ["ag", "service", "run", "start", "end", "status"];

        this.update = this.update.bind(this);
        this.changeAGFilter = this.changeAGFilter.bind(this);
        this.filterData = this.filterData.bind(this);

        this.state = {
            modal: true,

            data: null,
            notStarted: "N/A",
            numDone: "N/A",
            averageRuntime: "N/A",
            averageBulkTechPerc: "COMING SOON",
            averageBulkJobPerc: "COMING SOON",
            totalAgs: "N/A",
            serviceCounts: {
                "ALL": { "count": "N/A", "statuses": { "ALL": "N/A", "IN PROGRESS": "N/A", "DONE": "N/A", "ERROR": "N/A" } },
                "LOADDATA": { "count": "N/A", "statuses": { "ALL": "N/A", "IN PROGRESS": "N/A", "DONE": "N/A", "ERROR": "N/A" } },
                "SAMELOCATION": { "count": "N/A", "statuses": { "ALL": "N/A", "IN PROGRESS": "N/A", "DONE": "N/A", "ERROR": "N/A" } },
                "DISTANCEMATRIX": { "count": "N/A", "statuses": { "ALL": "N/A", "IN PROGRESS": "N/A", "DONE": "N/A", "ERROR": "N/A" } },
                "OPTAPLANNER": { "count": "N/A", "statuses": { "ALL": "N/A", "IN PROGRESS": "N/A", "DONE": "N/A", "ERROR": "N/A" } },
                "ASSIGN": { "count": "N/A", "statuses": { "ALL": "N/A", "IN PROGRESS": "N/A", "DONE": "N/A", "ERROR": "N/A" } },
                "CHECKLOG": { "count": "N/A", "statuses": { "ALL": "N/A", "IN PROGRESS": "N/A", "DONE": "N/A", "ERROR": "N/A" } },
            },

            filteredData: null,
            filterService: "ALL",
            filterStatus: "ALL",
            filterAG: []
        };
    }

    changeAGFilter(filter) {
        let temp = filter.target.value.split(",");
        if (temp.length == 1 && temp[0] == "") temp = [];
        this.setState({ filterAG: temp }, () => this.filterData());
    }

    filterData() {
        if (this.state.data == null) return;

        let temp = this.state.data.filter((item) =>
            (this.state.filterService == "ALL") || (item["service"].toUpperCase() == this.state.filterService)
        );
        temp = temp.filter((item) =>
            (this.state.filterStatus == "ALL") || (item["status"].toUpperCase() == this.state.filterStatus)
        );
        if (this.state.filterAG.length != 0) {
            temp = temp.filter((item) =>
                (this.state.filterAG.indexOf(item["ag"]) != -1)
            );
        }
        this.setState({ filteredData: temp });
    }

    async update() {
        const response = await fetch("/api/statusMonitor");
        const responseData = await response.json();
        this.setState({
            data: JSON.parse(responseData["data"]),
            notStarted: responseData["notStarted"],
            numDone: responseData["numDone"],
            averageRuntime: responseData["averageRuntime"],
            averageBulkTechPerc: responseData["averageBulkTechPerc"],
            averageBulkJobPerc: responseData["averageBulkJobPerc"],
            totalAgs: responseData["totalAgs"],
            serviceCounts: responseData["serviceCounts"]
        }, () => this.filterData());
    }

    render() {
        const modal = this.state.modal;

        const filteredData = this.state.filteredData;
        const notStarted = this.state.notStarted;
        const numDone = this.state.numDone;
        const averageRuntime = this.state.averageRuntime;
        const averageBulkTechPerc = this.state.averageBulkTechPerc;
        const averageBulkJobPerc = this.state.averageBulkJobPerc;
        const totalAgs = this.state.totalAgs;
        const serviceCounts = this.state.serviceCounts;

        const filterService = this.state.filterService;
        const filterStatus = this.state.filterStatus;

        const progress = (numDone == "N/A" || totalAgs == "N/A" ? 0 : Math.round(numDone / totalAgs * 100));

        return (
            <div>
                <Modal handler={() => this.setState({ modal: false })} title="STATUS MONITOR ALERT" body={
                    "This is a tool is to be used by the on-call team between midnight and 5AM CT. If this tool is used outside those hours or by anyone not qualified, the data may be incorrect and/or confusing."
                } />

                {modal ? null :
                    <div>
                        {getAlert("Columns can be sorted. I know the 'sorting arrows' aren't there. I'm working on it!")}

                        {getSectionTitle("STATISTICS")}
                        <div className="row">
                            {infoCard({
                                type: "success",
                                title: "MONEY SAVED",
                                value: "$ PRICELESS"
                            })}
                            {infoCard({
                                type: "info",
                                title: "PROGRESS : " + numDone + " OF " + totalAgs,
                                value: progress + "%",
                                extra: (
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
                                )
                            })}
                            {infoCard({
                                type: "danger",
                                title: "NUMBER OF ERRORS",
                                value: serviceCounts["ALL"]["statuses"]["ERROR"]
                            })}
                            {infoCard({
                                type: "danger",
                                title: "FAILED ASSIGNMENTS",
                                value: "COMING SOON"
                            })}
                            {infoCard({
                                type: "info",
                                title: "AVERAGE RUNTIME",
                                value: averageRuntime + " MINUTES"
                            })}
                            {infoCard({
                                type: "info",
                                title: "AVERAGE TECH BULK %",
                                value: averageBulkTechPerc
                            })}
                            {infoCard({
                                type: "info",
                                title: "AVERAGE JOB BULK %",
                                value: averageBulkJobPerc
                            })}
                        </div>

                        {onlyShowOnBig(
                            <div>
                                {getSectionTitle("FILTERS")}
                                <div className="row">
                                    {filterCard({
                                        filterName: "SERVICE FILTER", filters: [
                                            { name: "ALL", active: (filterService == "ALL"), count: serviceCounts["ALL"]["count"], clickHandler: (() => this.setState({ filterService: "ALL" }, () => this.filterData())) },
                                            { name: "LOADDATA", active: (filterService == "LOADDATA"), count: serviceCounts["LOADDATA"]["count"], clickHandler: (() => this.setState({ filterService: "LOADDATA" }, () => this.filterData())) },
                                            { name: "SAMELOCATION", active: (filterService == "SAMELOCATION"), count: serviceCounts["SAMELOCATION"]["count"], clickHandler: (() => this.setState({ filterService: "SAMELOCATION" }, () => this.filterData())) },
                                            { name: "DISTANCEMATRIX", active: (filterService == "DISTANCEMATRIX"), count: serviceCounts["DISTANCEMATRIX"]["count"], clickHandler: (() => this.setState({ filterService: "DISTANCEMATRIX" }, () => this.filterData())) },
                                            { name: "OPTAPLANNER", active: (filterService == "OPTAPLANNER"), count: serviceCounts["OPTAPLANNER"]["count"], clickHandler: (() => this.setState({ filterService: "OPTAPLANNER" }, () => this.filterData())) },
                                            { name: "ASSIGN", active: (filterService == "ASSIGN"), count: serviceCounts["ASSIGN"]["count"], clickHandler: (() => this.setState({ filterService: "ASSIGN" }, () => this.filterData())) },
                                            { name: "CHECKLOG", active: (filterService == "CHECKLOG"), count: serviceCounts["CHECKLOG"]["count"], clickHandler: (() => this.setState({ filterService: "CHECKLOG" }, () => this.filterData())) }
                                        ]
                                    })}
                                    {filterCard({
                                        filterName: "STATUS FILTER", filters: [
                                            { name: "ALL", active: (filterStatus == "ALL"), count: serviceCounts[filterService]["statuses"]["ALL"], clickHandler: (() => this.setState({ filterStatus: "ALL" }, () => this.filterData())) },
                                            { name: "IN PROGRESS", active: (filterStatus == "IN PROGRESS"), count: serviceCounts[filterService]["statuses"]["IN PROGRESS"], clickHandler: (() => this.setState({ filterStatus: "IN PROGRESS" }, () => this.filterData())) },
                                            { name: "DONE", active: (filterStatus == "DONE"), count: serviceCounts[filterService]["statuses"]["DONE"], clickHandler: (() => this.setState({ filterStatus: "DONE" }, () => this.filterData())) },
                                            { name: "ERROR", active: (filterStatus == "ERROR"), count: serviceCounts[filterService]["statuses"]["ERROR"], clickHandler: (() => this.setState({ filterStatus: "ERROR" }, () => this.filterData())) }
                                        ]
                                    })}
                                </div>
                                <div className="row">
                                    {card({
                                        type: "primary",
                                        size: "6",
                                        header: (
                                            <div className="font-weight-bold text-uppercase text-primary">AG FILTER</div>
                                        ),
                                        content: (
                                            <div className="form-group mb-0">
                                                <input type="text" className="form-control" aria-describedby="agFilterHelp" placeholder="AG NAME" onChange={this.changeAGFilter} />
                                                <small id="agFilterHelp" className="form-text text-muted">A Comma Separated List is Allowed</small>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {getSectionTitle("TABLE")}
                        <div className="row">
                            {table({ headers: this.headers, data: filteredData })}
                        </div>
                    </div>
                }
            </div>
        );
    }
}