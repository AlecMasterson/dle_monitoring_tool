from flask import Flask, render_template, json
import warnings, pymongo, datetime, pandas, time

def get_mongo_connection():
    warnings.filterwarnings('ignore')
    return pymongo.MongoClient('mongodb://{}:{}@{}'.format(
        'm09900',
        'DLEHsW33t!!p0t4t0',
        'alph986.aldc.att.com:27017,alph987.aldc.att.com:27017,clph912.sldc.sbc.com:27017,clph913.sldc.sbc.com:27017,clph914.sldc.sbc.com:27017,blth197.bhdc.att.com:27017,blth199.bhdc.att.com:27017/admin?readPreference=primary'
    ))

def get_data(database, collectionName, query):
    if database:
        mongo = get_mongo_connection()
        df = pandas.DataFrame.from_records(mongo['DLEH'][collectionName].find(query))
        if '_class' in df.columns: df.drop(columns=['_class'], inplace=True)
        if '_id' in df.columns: df.drop(columns=['_id'], inplace=True)

        mongo.close()
    else:
        df = pandas.read_csv('DLEH_Admin_App/data/DLEH.{}.csv'.format(collectionName))
        time.sleep(1)

    return df

def create_app():
    app = Flask(__name__)
    database = True

    @app.route('/')
    def home():
        return render_template('base.html')

    @app.route('/api/statusMonitor/')
    def apiStatusMonitor():
        df = get_data(database, 'STATUS', {'date': datetime.datetime.now().strftime('%Y-%m-%d')})

        if not database:
            df['start'] = df['start'].str.slice(11, 19)
            df['end'] = df['end'].str.slice(11, 19)

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/techsLoaded/')
    def apiTechsLoaded():
        df = get_data(database, 'TECHS', {'date': datetime.datetime.now().strftime('%Y-%m-%d')})

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/jobsLoaded/')
    def apiJobsLoaded():
        df = get_data(database, 'JOBS', {'date': datetime.datetime.now().strftime('%Y-%m-%d')})

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/techAssignments/')
    def apiTechAssignments():
        df = get_data(database, 'BULK_TECH_ASSIGNMENT', {'date': datetime.datetime.now().strftime('%m/%d/%Y')})

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/report/')
    def apiReport():
        df = get_data(database, 'REPORT', {})

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/config/')
    def apiConfig():
        df = get_data(database, 'UNIVERSAL_CONFIG_CDOO', {})

        return app.response_class(
            response=df.to_json(orient='records'),
            status=200,
            mimetype='application/json'
        )

    return app
