from flask import Flask, render_template
import argparse
import pandas
import json
import time
import os
import datetime

def create_app():
    app = Flask(__name__)

    @app.route('/')
    def home():
        return render_template('base.html')

    @app.route('/api/overview/')
    def apiStatusMonitor():

        baseDirectory = '/opt/app/dle/files/MONITOR/{}/'.format(datetime.datetime.now().strftime('%Y-%m-%d'))
        currentDir = max([os.path.join(baseDirectory, d) for d in os.listdir(baseDirectory)], key=os.path.getmtime)
        latestDir = currentDir.split('/')[-1]

        timestamp = latestDir[:-2] + ':' + latestDir[-2:]

        pending = pandas.read_csv(os.path.join(currentDir, 'pending.csv'))
        inProgress = pandas.read_csv(os.path.join(currentDir, 'inProgress.csv'))
        completed = pandas.read_csv(os.path.join(currentDir, 'completed.csv'))
        didNotStart = pandas.read_csv(os.path.join(currentDir, 'didNotStart.csv'))
        dleError = pandas.read_csv(os.path.join(currentDir, 'dleError.csv'))
        noAssignments = pandas.read_csv(os.path.join(currentDir, 'noAssignments.csv'))

        time.sleep(2)

        response = {
            'timestamp': timestamp,
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
