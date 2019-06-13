class StatusMonitor extends React.Component {
    constructor(props) {
        super(props);

        this.headers = ["ag", "service", "run", "start", "end", "status"];

        this.clickServiceFilter = this.clickServiceFilter.bind(this);
        this.clickStatusFilter = this.clickStatusFilter.bind(this);
        this.filterData = this.filterData.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.getData = this.getData.bind(this);

        this.state = {
            modal: true,
            data: null,
            filteredData: null,
            numDone: "N/A",
            averageRuntime: "N/A",
            averageBulkTechPerc: "N/A",
            averageBulkJobPerc: "N/A",
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
            (this.state.filterService == "ALL") || (item["service"].toUpperCase() == this.state.filterService)
        );
        temp = temp.filter((item) =>
            (this.state.filterStatus == "ALL") || (item["status"].toUpperCase() == this.state.filterStatus)
        );
        this.setState({ filteredData: temp });
    }

    updateTable() {
        this.setState({ isLoading: true }, () => this.getData());
    }

    async getData() {
        const response = await fetch("/api/statusMonitor");
        const responseData = await response.json();
        this.setState({
            data: JSON.parse(responseData["data"]),
            numDone: responseData["numDone"],
            averageRuntime: responseData["averageRuntime"],
            averageBulkTechPerc: responseData["averageBulkTechPerc"],
            averageBulkJobPerc: responseData["averageBulkJobPerc"],
            numErrors: responseData["numErrors"],
            totalAgs: responseData["totalAgs"],
            serviceCounts: responseData["serviceCounts"],
            statusCounts: responseData["statusCounts"],
            isLoading: false,
            lastUpdated: new Date().toLocaleString()
        }, () => this.filterData());
    }

    render() {
        const modal = this.state.modal;

        const lastUpdated = this.state.lastUpdated;
        const isLoading = this.state.isLoading;
        const filteredData = this.state.filteredData;

        const numDone = this.state.numDone;
        const numErrors = this.state.numErrors;
        const totalAgs = this.state.totalAgs;
        const progress = numDone == "N/A" ? 0 : Math.round(numDone / totalAgs * 100);
        const averageRuntime = this.state.averageRuntime;
        const averageBulkTechPerc = this.state.averageBulkTechPerc;
        const averageBulkJobPerc = this.state.averageBulkJobPerc;

        const filterService = this.state.filterService;
        const serviceCountALL = (this.state.serviceCounts == null ? "N/A" : this.state.serviceCounts["ALL"]);
        const serviceCountLOADDATA = (this.state.serviceCounts == null ? "N/A" : this.state.serviceCounts["LOADDATA"]);
        const serviceCountDISTANCEMATRIX = (this.state.serviceCounts == null ? "N/A" : this.state.serviceCounts["DISTANCEMATRIX"]);
        const serviceCountOPTAPLANNER = (this.state.serviceCounts == null ? "N/A" : this.state.serviceCounts["OPTAPLANNER"]);
        const serviceCountASSIGN = (this.state.serviceCounts == null ? "N/A" : this.state.serviceCounts["ASSIGN"]);

        const filterStatus = this.state.filterStatus;
        const statusCountALL = (this.state.statusCounts == null ? "N/A" : this.state.statusCounts["ALL"]);
        const statusCountINPROGRESS = (this.state.statusCounts == null ? "N/A" : this.state.statusCounts["IN PROGRESS"]);
        const statusCountDONE = (this.state.statusCounts == null ? "N/A" : this.state.statusCounts["DONE"]);
        const statusCountERROR = (this.state.statusCounts == null ? "N/A" : this.state.statusCounts["ERROR"]);

        return (
            <div className="container-fluid">
                <div className={"modal fade " + modal ? "show" : ""} style={{ display: modal ? "block" : "none" }} aria-modal={modal ? "true" : "false"} aria-hidden={modal ? "false" : "true"}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">STATUS MONITOR ALERT</h5>
                            </div>
                            <div className="modal-body">
                                This is a tool is to be used by the on-call team between midnight and 5AM CT.<br></br>
                                If this tool is used outside those hours or by anyone not qualified, the data may be incorrect and/or confusing.
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={() => this.setState({ modal: false })}>OKAY</button>
                            </div>
                        </div>
                    </div>
                </div>

                {modal ? null :
                    <div>
                        <h1 className="font-weight-bold text-uppercase mt-4">STATUS MONITOR</h1>

                        {getAlerts()}

                        {getSectionTitle("MANAGEMENT")}
                        <div className="row">
                            {refresh({
                                isLoading: isLoading,
                                lastUpdated: lastUpdated,
                                updateTable: this.updateTable
                            })}
                        </div>

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
                                value: numErrors
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
                                            { name: "ALL", active: (filterService == "ALL"), count: serviceCountALL, clickHandler: this.clickServiceFilter },
                                            { name: "LOADDATA", active: (filterService == "LOADDATA"), count: serviceCountLOADDATA, clickHandler: this.clickServiceFilter },
                                            { name: "DISTANCEMATRIX", active: (filterService == "DISTANCEMATRIX"), count: serviceCountDISTANCEMATRIX, clickHandler: this.clickServiceFilter },
                                            { name: "OPTAPLANNER", active: (filterService == "OPTAPLANNER"), count: serviceCountOPTAPLANNER, clickHandler: this.clickServiceFilter },
                                            { name: "ASSIGN", active: (filterService == "ASSIGN"), count: serviceCountASSIGN, clickHandler: this.clickServiceFilter }
                                        ]
                                    })}
                                    {filterCard({
                                        filterName: "STATUS FILTER", filters: [
                                            { name: "ALL", active: (filterStatus == "ALL"), count: statusCountALL, clickHandler: this.clickStatusFilter },
                                            { name: "IN PROGRESS", active: (filterStatus == "IN PROGRESS"), count: statusCountINPROGRESS, clickHandler: this.clickStatusFilter },
                                            { name: "DONE", active: (filterStatus == "DONE"), count: statusCountDONE, clickHandler: this.clickStatusFilter },
                                            { name: "ERROR", active: (filterStatus == "ERROR"), count: statusCountERROR, clickHandler: this.clickStatusFilter }
                                        ]
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