from flask import Flask, render_template
import argparse
import pandas
import json
import time


def create_app():
    app = Flask(__name__)

    @app.route('/')
    def home():
        return render_template('base.html')

    @app.route('/api/overview/')
    def apiStatusMonitor():

        pending = pandas.DataFrame()
        inProgress = pandas.DataFrame()
        completed = pandas.DataFrame()
        didNotStart = pandas.DataFrame()
        dleError = pandas.DataFrame()
        noAssignments = pandas.DataFrame()

        time.sleep(2)

        response = {
            'pending': pending.to_json(orient='records'),
            'inProgress': inProgress.to_json(orient='records'),
            'completed': completed.to_json(orient='records'),
            'didNotStart': didNotStart.to_json(orient='records'),
            'dleError': dleError.to_json(orient='records'),
            'noAssignments': noAssignments.to_json(orient='records')
        }

        return app.response_class(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )

    return app


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--debug', help='use this flag to utilize the debugging mode', action='store_true')
    args = parser.parse_args()

    create_app().run(host='0.0.0.0', port=31210, threaded=True, debug=args.debug)
