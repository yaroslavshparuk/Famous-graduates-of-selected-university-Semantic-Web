from flask import Flask, request, render_template, redirect
from flask_cors import CORS
from SPARQLWrapper import SPARQLWrapper, JSON

app = Flask(__name__)
CORS(app)

sparql = SPARQLWrapper('https://dbpedia.org/sparql')


def fetchResponseFromSPARQLWrapper(res):
 return res['results']['bindings']

@app.route('/universities', methods=['GET'])
def universities():
    query = """
        SELECT ?universities str(?nameObj) as ?name
        WHERE {
            ?universities rdf:type dbo:University ;
                        dbp:name ?nameObj ;
			dbo:country dbr:Ukraine
        }
        """

    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)

    result = sparql.query().convert()
    response = fetchResponseFromSPARQLWrapper(result)
    for item in response:
        item['universities']['value'] = item['universities']['value'].split('/')[len(item['universities']['value'].split('/')) - 1]
    return render_template('universities.html', data=response)

@app.route('/universities/<name>', defaults={'discipline': None}, methods=['GET'])
@app.route('/universities/<name>/<discipline>', methods=['GET'])
def universitiesFor(name, discipline):
    query = ''
    disciplines = ['Chemistry', 'Physics', 'Botanics', 'Surgery', 'Astronomy', 'Geophysics', 'Mathematics']
    if not discipline:
        query = 'SELECT ?person str(?descObj) as ?desc ?pict WHERE { ?person dbo:almaMater|dbo:education  dbr:' + name + ' ;' \
                'dbo:abstract ?descObj ;' \
                'dbo:thumbnail ?pict ' \
                'FILTER (LANG(?descObj) = "en") }'
    else:
        query = 'SELECT ?person WHERE { ?person dbo:academicDiscipline dbr:' + discipline +\
                ' . ?person dbo:almaMater ;' \
                'dbr:' + name + ' . }'
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)

    result = sparql.query().convert()
    response = fetchResponseFromSPARQLWrapper(result)

    return render_template('people.html', data=response, disciplines=disciplines, name=name)

if __name__ == '__main__':
    app.run(debug=True)