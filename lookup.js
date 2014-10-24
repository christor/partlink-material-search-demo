var xmlHttp = null;
function getMatchingMaterials() {
    var query = document.getElementById("query").value;
    var sparql = "select DISTINCT ?materialUri ?materialName "
            + " where  { "
            + " ?materialUri (<http://www.w3.org/2000/01/rdf-schema#subClassOf>)+ <http://xsb.com/swiss/material#MATERIAL> . "
            + " ?materialUri <http://www.w3.org/2000/01/rdf-schema#label> ?materialName . "
            + " FILTER (regex(?materialName, '" + query + "')) "
            + " } ORDER BY ?materialName";
    var url = "http://api.xsb.com/sparql/query?query=" + encodeURIComponent(sparql);
    $('#queryHead').html('<div class="bg-warning" ><a href="' + url + '">' + query + '...</a></div>');
    $('#resultList').html('<div class="bg-warning">searching...</div>');
    logSparql(sparql);
    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = createCallback(xmlHttp, query);
    xmlHttp.open("GET", url, true);
    xmlHttp.timeout = 30000;
    xmlHttp.ontimeout = createTimeout(xmlHttp, query);
    xmlHttp.send(null);
}

function logSparql(sparql) {
    var d = new Date();
    var dd = d.toLocaleDateString();
    var dt = d.toLocaleTimeString();
    $('#sparqllog').val('[' + dd + ' ' + dt + '] ' + sparql + '\n' + $('#sparqllog').val());
}

function createCallback(xhr, query) {
    return function ProcessRequest() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                $('#queryHead').html('<div class="bg-info" ><a href="' + xhr.responseURL + '">' + query + '</a></div>');
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
                $('#queryHead').html('<div class="bg-danger" ><a href="' + xhr.responseURL + '">' + query + '</a></div>');
                $('#resultList').html('<div class="bg-danger"> Error: Request status - ' + xhr.status + ' : ' + xhr.responseText + '</div>');
            }
        }
    };
}

function createTimeout(xhr, query) {
    return function () {
        $('#queryHead').html('<div class="bg-danger" ><a href="' + xhr.responseURL + '">' + query + '</a></div>');
        $('#resultList').html('<div class="bg-danger"> Request timed out</div>');
    };
}
