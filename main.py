from flask import Flask, request, render_template, redirect
from flask_cors import CORS
from SPARQLWrapper import SPARQLWrapper, JSON

app = Flask(__name__)
CORS(app)

sparql = SPARQLWrapper('https://dbpedia.org/sparql')

def mapFromSPARQL(res):
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

    result = mapFromSPARQL(sparql.query().convert())
    for item in result:
        item['desc'] = item['desc']['value']
        item['link'] = item['link']['value']
        item['wiki'] = item['wiki']['value']
        item['pict'] = item['pict']['value']
    return result


@app.route('/graduates/<name>', methods=['GET'])
def graduates(name):
    query = 'SELECT str(?descObj) as ?desc ?pict ?wiki WHERE {' \
                ' ?person dbo:almaMater|dbo:education  dbr:' + name + ' ;' \
                'dbo:abstract ?descObj ;' \
                'foaf:isPrimaryTopicOf ?wiki ;' \
                'dbo:thumbnail ?pict ' \
                'FILTER (LANG(?descObj) = "en") }'
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    print(query)
    result = mapFromSPARQL(sparql.query().convert())
    for item in result:
        item['desc'] = item['desc']['value']
        item['wiki'] = item['wiki']['value']
        item['pict'] = item['pict']['value']
    return result

@app.route('/graduates/<name>/<discipline>', methods=['GET'])
def graduatesWithDiscipline(name, discipline):
    query = 'SELECT str(?descObj) as ?desc ?pict ?wiki WHERE {' \
                '?person dbo:academicDiscipline dbr:' + discipline + '.'\
                '?person dbo:almaMater|dbo:education  dbr:' + name + ' ;' \
                'dbo:abstract ?descObj ;' \
                'foaf:isPrimaryTopicOf ?wiki ;' \
                'dbo:thumbnail ?pict ' \
                'FILTER (LANG(?descObj) = "en") }'
    print(query)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)

    result = mapFromSPARQL(sparql.query().convert())
    for item in result:
        item['desc'] = item['desc']['value']
        item['wiki'] = item['wiki']['value']
        item['pict'] = item['pict']['value']
    return result


if __name__ == '__main__':
    app.run(debug=True)