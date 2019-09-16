class Root extends React.Component {
    constructor(props) {
        super(props);

        this.update = this.update.bind(this);

        this.state = {
            failed: false,
            loading: false,
            lastUpdated: "Not Updated",

            pending: [],
            inProgress: [],
            completed: [],
            didNotStart: [],
            dleError: [],
            noAssignments: []
        };
    }

    componentDidMount() {
        this.update();
    }

    async update() {
        this.setState(
            { loading: true },
            () => fetch(this.props.api).then(res => res.json()).then(
                (result) => {
                    let currentTime = new Date().toLocaleString().split(" ");

                    this.setState({
                        failed: false,
                        loading: false,
                        lastUpdated: currentTime[1] + " " + currentTime[2],

                        pending: JSON.parse(result["pending"]),
                        inProgress: JSON.parse(result["inProgress"]),
                        completed: JSON.parse(result["completed"]),
                        didNotStart: JSON.parse(result["didNotStart"]),
                        dleError: JSON.parse(result["dleError"]),
                        noAssignments: JSON.parse(result["noAssignments"])
                    });

                    setTimeout(this.update, 15000);
                },
                (error) => {
                    let currentTime = new Date().toLocaleString().split(" ");

                    this.setState({
                        failed: true,
                        loading: false,
                        lastUpdated: currentTime[1] + " " + currentTime[2]
                    });

                    setTimeout(this.update, 15000);
                }
            )
        );
    }

    render() {
        const title = this.props.title;
        const failed = this.state.failed;
        const loading = this.state.loading;
        const lastUpdated = this.state.lastUpdated;

        const pending = this.state.pending;
        const inProgress = this.state.inProgress;
        const completed = this.state.completed;
        const didNotStart = this.state.didNotStart;
        const dleError = this.state.dleError;
        const noAssignments = this.state.noAssignments;

        const loadingSpinner = (
            <div className="spinner-border" role="status">
                <span className="sr-only">{"Loading..."}</span>
            </div>
        );

        const failedToLoad = (
            <span className="font-weight-bold my-auto mr-2" style={{ color: "red" }}>
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {"Failed to Fetch Data"}
            </span>
        );

        return (
            <div>
                <nav className="navbar navbar-dark py-3 justify-content-between">
                    <span className="navbar-brand font-weight-bold">{title}</span>
                    <div className="d-flex h-100 text-white">
                        {failed ? failedToLoad : null}
                        <span className="my-auto mr-2">{"Last Updated: " + (!loading ? lastUpdated : "")}</span>
                        {loading ? loadingSpinner : null}
                    </div>
                </nav>

                <div className={(loading || failed) ? "disabled-section" : ""}>
                    <Overview
                        pending={pending}
                        inProgress={inProgress}
                        completed={completed}
                        didNotStart={didNotStart}
                        dleError={dleError}
                        noAssignments={noAssignments}
                    />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Root title="DLE Monitoring Tool" api="/api/overview" />, document.getElementById('root'));