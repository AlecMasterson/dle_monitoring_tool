from flask import Flask, render_template, json
import argparse
import warnings
import pymongo
import datetime
import pandas
import time


def get_mongo_connection():
    warnings.filterwarnings('ignore')
    return pymongo.MongoClient('mongodb://{}:{}@{}'.format(
        'm09900',
        'DLEHsW33t!!p0t4t0',
        'alph986.aldc.att.com:27017,alph987.aldc.att.com:27017,clph912.sldc.sbc.com:27017,clph913.sldc.sbc.com:27017,clph914.sldc.sbc.com:27017,blth197.bhdc.att.com:27017,blth199.bhdc.att.com:27017/admin?readPreference=primary'
    ))


def get_data(database, queries):
    if database:
        mongo = get_mongo_connection()

    result = {}
    for query in queries:
        if database:
            df = pandas.DataFrame.from_records(mongo['DLEH'][query['collection']].find(query['query']))
            df.drop(labels=['_class', '_id'], axis='columns', errors='ignore', inplace=True)
            result[query['collection']] = df
        else:
            df = pandas.read_csv('data/DLEH.{}.csv'.format(query['collection']))
            for csvQuery in query['csvQuery']:
                df = df[df[csvQuery['column']] == csvQuery['value']]
            result[query['collection']] = df

    if database:
        mongo.close()

    return result


def create_app(database):
    app = Flask(__name__)

    @app.route('/')
    def home():
        return render_template('base.html')

    @app.route('/api/statusMonitor/')
    def apiStatusMonitor():
        result = get_data(
            database,
            [
                {
                    'collection': 'STATUS',
                    'query': {'date': datetime.datetime.now().strftime('%Y-%m-%d')},
                    'csvQuery': [{'column': 'date', 'value': '2019-06-07'}]
                },
                {
                    'collection': 'BULK_TECH_ASSIGNMENT',
                    'query': {'date': datetime.datetime.now().strftime('%m/%d/%Y')},
                    'csvQuery': [{'column': 'date', 'value': '06/07/2019'}]
                }
            ]
        )
        statusDF = result['STATUS']
        bulkDF = result['BULK_TECH_ASSIGNMENT']

        statusDF['start'] = statusDF['start'].str.slice(11, 19)
        statusDF['end'] = statusDF['end'].str.slice(11, 19)

        ags = ['FL_S_HOLLYWOOD_E', 'FL_S_PALM_SOUTH_E', 'MO_SPRINGFIELD_E', 'NC_CHARLOTTE_GASTN_E', 'NC_RALEIGH_WEST_E', 'TX_AUST_NORTHEAST_E', 'TX_AUST_SOUTH_E', 'TX_FTWO_MIDCITIES_E', 'TX_FTWO_NORTH_E', 'TX_MIDLAND_ODESSA_E', 'CA_LA_METRO_EAST_T', 'CA_OAKLAND_T', 'CA_SAN_FRANCISCO_T', 'CA_SAN_JOSE_T', 'CA_WEST_BAY_T', 'TX_LUBBOCK_E', 'TX_N_HOU_CHARLES_E', 'TX_N_HOU_KEMPWOOD_E', 'TX_SNAN_SOUTHEAST_E', 'TX_SNAN_SOUTHWEST_E', 'MO_STLS_CENTRAL_E', 'MO_STLS_NORTH_E', 'NC_CHARLOTTE_E', 'NC_RALEIGH_CENTRAL_E', 'TX_AUST_NORTHWEST_E', 'TX_DLLS_CENTRAL_E', 'TX_DLLS_NORTHWEST_E', 'TX_DLLS_STH_CENTRL_E', 'TX_EL_PASO_E', 'TX_FTWO_SOUTH_E', 'TX_FTWO_SOUTHEAST_E', 'TX_N_HOU_AIRLINE_E', 'TX_N_HOU_PARKWEST_E', 'TX_N_HOU_PRSDO_EST_E', 'TX_SNAN_AUST_SOUTH_E', 'TX_SNAN_NORTH_E', 'CA_LANO_FT_HILL_E', 'CA_LASO_BALDWN_HLS_E', 'CA_NCNV_MODESTO_E', 'CA_NCNV_N_ROCKLIN_E', 'CA_NCNV_STKN_E', 'CA_OR_FULLERTON_E', 'CA_OR_ORANGE_E', 'CA_RV_IN_EMP_E', 'CA_SBAY_NIMITZ_E', 'CA_SNDG_CENTRAL_E', 'CA_SNDG_METRO_E', 'FL_S_DADE_NRTHEAST_E', 'FL_S_DADE_WEST_E', 'FL_S_POMPANO_BEACH_E', 'KY_LOUISVILLE_EAST_E', 'KY_LOUISVILLE_WEST_E', 'MS_SOUTH_E', 'CA_LANO_HI_DESERT_E', 'CA_LANO_LA_METRO_E', 'CA_LANO_SANGABRIEL_E', 'CA_LANO_W_VALLEY_E', 'CA_LASO_GARDENA_E', 'CA_OR_SOUTH_OC_E', 'FL_EAST_DADE_T', 'FL_INDIAN_RIVER_T', 'FL_PALM_T', 'TX_S_CENTRAL_HSTN_T', 'MI_DETROIT_T', 'IL_SOUTHERN_RURAL_T', 'IL_STH_SUBURBAN_T', 'MI_GRAND_RAPIDS_T', 'MI_LIVONIA_T', 'MI_OH_DOWNRIVER_T', 'MI_TRI_CITIES_T', 'OH_AKRON_CANTON_T', 'OH_CLEVELAND_T', 'IL_NORTH_T', 'MI_IN_LAKESHORE_T', 'IN_INDIANAPOLIS_T', 'IN_NORTH_T', 'TN_N_NSVL_NORTH_E', 'TN_NASHVILLE_T', 'TN_S_NSVL_SOUTH_E', 'WI_MILW_METRO_T', 'CA_CNT_BAKERSFLD_E', 'CA_CNT_STH_VALLEY_E', 'CA_COMPTON_T', 'CA_CONCORD_T', 'CA_DIABLO_T', 'CA_E_SAN_FRNDO_VLY_T', 'CA_GARDENA_T', 'CA_LA_METRO_WEST_T', 'CA_NCNV_FOLSOM_E', 'CA_NCNV_SAC_NORTH_E', 'CA_ORANGE_CNTY_NTH_T', 'CA_ORANGE_CNTY_STH_T', 'CA_PENINSULA_NORTH_T', 'CA_SAN_GABRIEL_T', 'CA_SBAY_E_BAY_E', 'CA_SBAY_NCOAST_E', 'CA_SBAY_SAN_FRAN_E', 'CA_SBAY_SILICON_VY_E', 'CA_SBAY_SOUTH_BAY_E', 'CA_SNDG_CENTRAL_T', 'CA_SNDG_NORTH_E', 'CA_SNDG_NORTH_T', 'CA_SNDG_SOUTH_T', 'CA_SNDG_SOUTHEAST_E', 'CA_YOSEMITE_GATEWY_T', 'FL_CENTRAL_T', 'FL_COASTAL_T', 'FL_NORTH_BROWARD_T', 'IL_CHCG_METRO_NTH_T', 'IL_OUTSTATE_T', 'IN_IL_CHCG_SOUTH_T',
               'IN_IPLS_NORTH_EAST_E', 'IN_SOUTH_T', 'KY_EAST_E', 'KY_WEST_E', 'LA_NEW_ORLEANS_T', 'MI_DETROIT_EAST_E', 'NC_ASHEVILLE_MTNS_E', 'NC_GREENSBORO_E', 'OH_CLEVELAND_WEST_T', 'OH_COLUMBUS_T', 'OH_DAYTON_T', 'OH_INDIANA_SOUTH_E', 'OH_SOUTHWEST_E', 'OK_TULSA_E', 'TN_CHAT_E', 'TX_N_CENTRAL_HSTN_T', 'WI_MI_OUTSTATE_T', 'WI_MILWAUKEE_NTH_E', 'WI_MILWAUKEE_STH_E', 'AL_BIRMINGHAM_T', 'AL_FL_COAST_T', 'CA_CENTRAL_COAST_T', 'CA_CNT_FRESNO_E', 'CA_CNT_MONTEREY_E', 'CA_INLAND_EMPIRE_T', 'CA_NAPA_T', 'CA_NCNV_NORTH_E', 'CA_NCNV_NV_NEVADA_E', 'CA_NORTH_COUNTIES_T', 'CA_NORTH_VALLEY_T', 'CA_REDWOOD_T', 'CA_SBAY_DELTA_E', 'CA_SEQUOIA_T', 'CA_W_SAN_FRNDO_VLY_T', 'FL_SOUTH_BROWARD_T', 'GA_EAST_T', 'GA_NORTHEAST_T', 'GA_NORTHWEST_T', 'GA_SOUTH_T', 'GA_SOUTHWEST_T', 'IN_IPLS_CENTRAL_E', 'IN_OUTSTATE_NORTH_E', 'KY_EAST_T', 'KY_LOUISVILLE_T', 'KY_WEST_T', 'LA_BATON_ROUGE_T', 'LA_NORTH_SHORE_T', 'LA_SOUTH_T', 'LA_WEST_N_ORLEANS_T', 'MI_DETROIT_WEST_E', 'MI_MIDTOWN_E', 'MI_S_METRO_E', 'MI_UNIVERSTY_E', 'MS_SOUTH_T', 'NC_CHARLOTTE_CNTRL_T', 'NC_GRNSBORO_CNTRL_T', 'NC_SC_EAST_COASTAL_T', 'NC_WEST_T', 'OH_CENTRAL_E', 'OH_NORTHWEST_E', 'SC_UPSTATE_T', 'TN_CO_CHATTANOOGA_T', 'TN_KNOXVILLE_E', 'TN_KNOXVILLE_T', 'TN_MEMPHIS_SOUTH_E', 'TN_MEMPHIS_T', 'TN_N_MEMPH_JACKSON_E', 'TN_WST_MIDDLE_TN_T', 'WI_NORTHWEST_E', 'AL_CENTRAL_T', 'AL_NORTH_T', 'AR_CENTRAL_T', 'FL_NORTH_T', 'FL_SOUTH_DADE_KEYS_T', 'GA_SOUTHEAST_T', 'KS_EAST_T', 'KS_MO_KCY_NORTH_E', 'KS_MO_KCY_SOUTH_E', 'KS_TOPEKA_E', 'KS_WEST_T', 'KS_WICHITA_E', 'LA_NORTHEAST_T', 'LA_NORTHWEST_T', 'MO_KSCY_SOUTHEAST_T', 'MO_S_EST_AR_N_EST_T', 'MO_ST_LOUIS_NORTH_T', 'MO_STLS_SOUTH_E', 'MS_NORTH_T', 'MS_SOUTHEAST_T', 'NV_CA_NEVADA_T', 'OK_EAST_T', 'OK_OKCY_SOUTH_E', 'SC_MIDLANDS_T', 'TX_ARLINGTON_SOUTH_T', 'TX_AUSTIN_WACO_T', 'TX_CORPUS_CHRISTI_E', 'TX_DLLS_EAST_E', 'TX_DLLS_NORTH_E', 'TX_ELPS_WS_CENTRAL_T', 'TX_FT_WORTH_MAIN_T', 'TX_FTWO_SOUTHWEST_E', 'TX_HARLINGEN_E', 'TX_LRDO_EAGLE_PASS_T', 'TX_N_HOU_ALMDA_EST_E', 'TX_N_HOU_ALMEDA_E', 'TX_N_HOU_MUESHKE_E', 'TX_N_HOU_PRSDO_WST_E', 'TX_N_HOU_SPRING_E', 'TX_NO_SNAN_SO_AUST_T', 'TX_NORTH_DALLAS_T', 'TX_NORTHEAST_HSTN_T', 'TX_NORTHWEST_HSTN_T', 'TX_OUTSTAT_NTHWST_T', 'TX_OUTSTATE_EAST_T', 'TX_RIO_GRANDE_VLY_T', 'TX_SNAN_METRO_T', 'TX_SOUTHEAST_DLLS_T', 'TX_SOUTHEAST_HSTN_T', 'TX_SOUTHWEST_HSTN_T']

        numDone = 0
        totalRuntime = 0

        finalDF = pandas.DataFrame()
        for ag in ags:
            agData = statusDF[statusDF['ag'] == ag]
            if len(agData) == 0:
                continue

            runtime = 0
            for service in ['LoadData', 'SameLocation', 'DistanceMatrix', 'Optaplanner', 'Assign', 'CheckLog']:
                serviceData = agData[agData['service'] == service]
                if len(serviceData) == 0:
                    continue

                status = serviceData[serviceData['run'] == max(serviceData['run'])].iloc[0]
                if status['status'] == 'DONE':
                    runtime += status['minutes']
                if service == 'CheckLog' and status['status'] == 'DONE':
                    numDone += 1
                    totalRuntime += runtime
                finalDF = finalDF.append(status, ignore_index=True)

        response = {
            'data': finalDF.to_json(orient='records'),
            'numDone': numDone,
            'averageRuntime': round(totalRuntime / numDone) if numDone > 0 else 'N/A',
            'averageBulkTechPerc': 'N/A',
            'averageBulkJobPerc': 'N/A',
            'totalAgs': len(ags),
            'serviceCounts': {
                'ALL': len(finalDF[
                    (finalDF['service'] == 'LoadData') |
                    (finalDF['service'] == 'SameLocation') |
                    (finalDF['service'] == 'DistanceMatrix') |
                    (finalDF['service'] == 'Optaplanner') |
                    (finalDF['service'] == 'Assign') |
                    (finalDF['service'] == 'CheckLog')
                ]),
                'LOADDATA': len(finalDF[finalDF['service'] == 'LoadData']),
                'SAMELOCATION': len(finalDF[finalDF['service'] == 'SameLocation']),
                'DISTANCEMATRIX': len(finalDF[finalDF['service'] == 'DistanceMatrix']),
                'OPTAPLANNER': len(finalDF[finalDF['service'] == 'Optaplanner']),
                'ASSIGN': len(finalDF[finalDF['service'] == 'Assign']),
                'CHECKLOG': len(finalDF[finalDF['service'] == 'CheckLog'])
            },
            'statusCounts': {
                'ALL': len(finalDF[
                    (finalDF['status'] == 'IN PROGRESS') |
                    (finalDF['status'] == 'DONE') |
                    (finalDF['status'] == 'ERROR')
                ]),
                'IN PROGRESS': len(finalDF[finalDF['status'] == 'IN PROGRESS']),
                'DONE': len(finalDF[finalDF['status'] == 'DONE']),
                'ERROR': len(finalDF[finalDF['status'] == 'ERROR'])
            }
        }
        return app.response_class(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/techsLoaded/')
    def apiTechsLoaded():
        result = get_data(
            database,
            [{
                'collection': 'TECHS',
                'query': {'date': datetime.datetime.now().strftime('%Y-%m-%d')},
                'csvQuery': [{'column': 'date', 'value': '2019-06-07'}]
            }]
        )

        response = {'data': result['TECHS'].to_json(orient='records')}
        return app.response_class(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/jobsLoaded/')
    def apiJobsLoaded():
        result = get_data(
            database,
            [{
                'collection': 'JOBS',
                'query': {'date': datetime.datetime.now().strftime('%Y-%m-%d')},
                'csvQuery': [{'column': 'date', 'value': '2019-06-07'}]
            }]
        )

        response = {'data': result['JOBS'].to_json(orient='records')}
        return app.response_class(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/techAssignments/')
    def apiTechAssignments():
        result = get_data(
            database,
            [{
                'collection': 'BULK_TECH_ASSIGNMENT',
                'query': {'date': datetime.datetime.now().strftime('%m/%d/%Y')},
                'csvQuery': [{'column': 'date', 'value': '06/07/2019'}]
            }]
        )

        response = {'data': result['BULK_TECH_ASSIGNMENT'].to_json(orient='records')}
        return app.response_class(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )

    @app.route('/api/config/')
    def apiConfig():
        result = get_data(
            database,
            [{
                'collection': 'UNIVERSAL_CONFIG_CDOO',
                'query': {},
                'csvQuery': []
            }]
        )

        response = {'data': result['UNIVERSAL_CONFIG_CDOO'].to_json(orient='records')}
        return app.response_class(
            response=json.dumps(response),
            status=200,
            mimetype='application/json'
        )

    return app


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--debug', help='use this flag to utilize the debugging mode', action='store_true')
    parser.add_argument('-m', '--mongo', help='use this flag to utilize the Mongo database', action='store_true')
    args = parser.parse_args()

    create_app(args.mongo).run(host='0.0.0.0', port=31210, debug=args.debug)
