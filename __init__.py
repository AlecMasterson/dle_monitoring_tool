from flask import Flask, render_template, json
import warnings, pymongo, datetime
import pandas
import time

def get_mongo_connection():
    warnings.filterwarnings('ignore')
    return pymongo.MongoClient('mongodb://{}:{}@{}'.format(
        'm09900',
        'DLEHsW33t!!p0t4t0',
        'alph986.aldc.att.com:27017,alph987.aldc.att.com:27017,clph912.sldc.sbc.com:27017,clph913.sldc.sbc.com:27017,clph914.sldc.sbc.com:27017,blth197.bhdc.att.com:27017,blth199.bhdc.att.com:27017/admin?readPreference=primary'
    ))

def create_app():
    app = Flask(__name__)
    database = True

    @app.route('/')
    def home():
        return render_template('base.html')

    @app.route('/api/statusMonitor/')
    def apiStatusMonitor():
        if database:
            mongo = get_mongo_connection()
            df = pandas.DataFrame.from_records(mongo['DLEH']['STATUS'].find({'date': datetime.datetime.now().strftime('%Y-%m-%d')}))
            df.drop(columns=['_class', '_id'], inplace=True)

            mongo.close()
        else:
            df = pandas.read_csv('flaskr/data/DLEH.STATUS.csv')

            df['start'] = df['start'].str.slice(11, 19)
            df['end'] = df['end'].str.slice(11, 19)

            time.sleep(2)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/techsLoaded/')
    def apiTechsLoaded():
        if database:
            mongo = get_mongo_connection()
            df = pandas.DataFrame.from_records(mongo['DLEH']['TECHS'].find({'date': datetime.datetime.now().strftime('%Y-%m-%d')}))
            df.drop(columns=['_class', '_id'], inplace=True)

            mongo.close()
        else:
            df = pandas.read_csv('flaskr/data/DLEH.TECHS.csv')

            time.sleep(1)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/jobsLoaded/')
    def apiJobsLoaded():
        if database:
            mongo = get_mongo_connection()
            df = pandas.DataFrame.from_records(mongo['DLEH']['JOBS'].find({'date': datetime.datetime.now().strftime('%Y-%m-%d')}))
            df.drop(columns=['_class', '_id'], inplace=True)

            mongo.close()
        else:
            df = pandas.read_csv('flaskr/data/DLEH.JOBS.csv')

            time.sleep(1)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/techAssignments/')
    def apiTechAssignments():
        if database:
            mongo = get_mongo_connection()
            df = pandas.DataFrame.from_records(mongo['DLEH']['BULK_TECH_ASSIGNMENT'].find({'date': datetime.datetime.now().strftime('%m/%d/%Y')}))
            df.drop(columns=['_id'], inplace=True)

            mongo.close()
        else:
            df = pandas.read_csv('flaskr/data/DLEH.BULK_TECH_ASSIGNMENT.csv')

            time.sleep(1)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/report/')
    def apiReport():
        if database:
            mongo = get_mongo_connection()
            df = pandas.DataFrame.from_records(mongo['DLEH']['REPORT'].find({}))
            df.drop(columns=['_id'], inplace=True)

            mongo.close()
        else:
            df = pandas.read_csv('flaskr/data/DLEH.REPORT.csv')

            time.sleep(1)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/config/')
    def apiConfig():
        if database:
            mongo = get_mongo_connection()
            df = pandas.DataFrame.from_records(mongo['DLEH']['UNIVERSAL_CONFIG_CDOO'].find({}))
            df.drop(columns=['_id'], inplace=True)

            mongo.close()
        else:
            df = pandas.read_csv('flaskr/data/DLEH.UNIVERSAL_CONFIG_CDOO.csv')

            time.sleep(1)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    return app
