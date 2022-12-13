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
        SELECT ?link ?wiki str(?descObj) as ?desc ?pict
        WHERE {
            ?link rdf:type dbo:University ;
                        dbo:abstract ?descObj ;
                        dbo:thumbnail ?pict ;
                        foaf:isPrimaryTopicOf ?wiki ;
			dbo:country dbr:Ukraine
        FILTER (LANG(?descObj) = "en")
        }
        """

    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)

    result = fetchResponseFromSPARQLWrapper(sparql.query().convert())
    for item in result:
        item['desc'] = item['desc']['value']
        item['link'] = item['link']['value']
        item['wiki'] = item['wiki']['value']
        item['pict'] = item['pict']['value']
    return result

@app.route('/universities/<name>', defaults={'discipline': None}, methods=['GET'])
@app.route('/universities/<name>/<discipline>', methods=['GET'])
def universitiesFor(name, discipline):
    query = 'SELECT ?person str(?descObj) as ?desc ?pict ?topic'
    disciplines = ['Chemistry', 'Physics', 'Botanics', 'Surgery', 'Astronomy', 'Geophysics', 'Mathematics']
    if not discipline:
        query += ' WHERE { ?person dbo:almaMater|dbo:education  dbr:' + name + ' ;' \
                'dbo:abstract ?descObj ;' \
                'foaf:isPrimaryTopicOf ?topic ;' \
                'dbo:thumbnail ?pict ' \
                'FILTER (LANG(?descObj) = "en") }'
    else:
        query +=' WHERE {' \
                '?person dbo:academicDiscipline dbr:' + discipline + '.'\
                ' ?person dbo:almaMater|dbo:education  dbr:' + name + ' ;' \
                'dbo:abstract ?descObj ;' \
                'foaf:isPrimaryTopicOf ?topic ;' \
                'dbo:thumbnail ?pict ' \
                'FILTER (LANG(?descObj) = "en") }'
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)

    result = sparql.query().convert()
    response = fetchResponseFromSPARQLWrapper(result)

    return render_template('people.html', data=response, disciplines=disciplines, name=name)

if __name__ == '__main__':
    app.run(debug=True)