class Page extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <h3 className="mt-4">{this.props.pageName}</h3>
                <div className="card shadow my-4 border-left-primary">
                    <div className="card-body">
                        {this.props.headers != null && this.props.api != null ?
                            <Table headers={this.props.headers} api={this.props.api} /> :
                            <h1 className="text-center">Coming Soon</h1>
                        }
                    </div>
                </div>
            </div>
        );
    }
}