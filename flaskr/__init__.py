from flask import Flask, render_template, json
import pandas
import time


def create_app():
    app = Flask(__name__)

    @app.route('/')
    def home():
        return render_template('base.html')

    @app.route('/api/statusMonitor/')
    def apiStatusMonitor():
        df = pandas.read_csv('flaskr/data/DLEH.STATUS.csv')

        df['start'] = df['start'].str.slice(11, 19)
        df['end'] = df['end'].str.slice(11, 19)

        time.sleep(1)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/techsLoaded/')
    def apiTechsLoaded():
        df = pandas.read_csv('flaskr/data/DLEH.TECHS.csv')

        time.sleep(1)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/jobsLoaded/')
    def apiJobsLoaded():
        df = pandas.read_csv('flaskr/data/DLEH.JOBS.csv')

        time.sleep(1)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/techAssignments/')
    def apiTechAssignments():
        df = pandas.read_csv('flaskr/data/DLEH.BULK_TECH_ASSIGNMENT.csv')

        time.sleep(1)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    return app
