var xmlHttp = null;
function getMatchingMaterials() {
    var query = document.getElementById("query").value;
    var sparql = "select DISTINCT ?materialUri ?materialName " +
                 "{ " +
                 "  graph <http://xsb.com/swiss/merged_ontology> { " +
                 "    ( ?materialName  ) <http://jena.hpl.hp.com/ARQ/property#textMatch> ( '" + query + "' 0.0 50000 ).  " +
                 "    ?materialUri <http://www.w3.org/2000/01/rdf-schema#label> ?materialName . " +
                 "  ?materialUri (<http://www.w3.org/2000/01/rdf-schema#subClassOf>)+ <http://xsb.com/swiss/material#MATERIAL> .  " +
                 " } " +
                 "} ORDER BY ?materialName";

    var url = "http://api.xsb.com/sparql/query?query=" + encodeURIComponent(sparql);
    $('#queryHead').html('<a href="' + url + '">' + query + '...</a>');
    $('#resultList').html('<div class="bg-warning">searching...</div>');
    logSparql("Executing query: " + sparql + " \n (URL: <a href='" + url + "'>" + url + "</a>)");
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);
    xmlHttp.timeout = 30000;
    xmlHttp.ontimeout = createTimeout(xmlHttp, query, new Date().getTime());
    xmlHttp.onreadystatechange = createCallback(xmlHttp, query, new Date().getTime());
    xmlHttp.send(null);
}

function logSparql(sparql) {
    var d = new Date();
    var dd = d.toLocaleDateString();
    var dt = d.toLocaleTimeString();
    $('#sparqllog').prepend('<div style="border: #8699a4 thin solid">[' + dd + ' ' + dt + '] ' + sparql + '</div>');
}

function createCallback(xhr, query, start) {
    return function ProcessRequest() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                $('#queryHead').html('for query <a href="' + xhr.responseURL + '">' + query + '</a> (took ' + (new Date().getTime()-start) + " ms)");
                $('#resultList').html('<div class="bg-info">done</div>');
                tableHtml = '<table>';
                $(xhr.responseText).find('result').each(function (i, e) {
                    tableHtml += '<tr><td>';
                    tableHtml += $(e).find('[name="materialName"] > literal').html();
                    tableHtml += '</td><td>';
                    tableHtml += $(e).find('[name="materialUri"] > uri').html();
                    tableHtml += '</td></tr>';
                });
                tableHtml += '</table>';
                $('#resultList').html('<div class="bg-info">' + tableHtml + '</div>');

                $('#resultList > div').show(250);
            } else {
                $('#queryHead').html('for query <a href="' + xhr.responseURL + '">' + query + '</a>');
                $('#resultList').html('<div class="bg-danger"> Error: Request status - ' + xhr.status + ' : ' + xhr.responseText + '</div>');
            }
        }
    };
}

function createTimeout(xhr, query, start) {
    return function () {
        $('#queryHead').html('<a href="' + xhr.responseURL + '">' + query + '</a>');
        $('#resultList').html('<div class="bg-danger"> Request timed out</div>');
    };
}
