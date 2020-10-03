//truc qui communique avec mon serveur pour avoir la liste des éléments d'un dossier

function getListing(dir) {


  let xhttp = new XMLHttpRequest();

  //synchronous XMLHTTP
  xhttp.open("GET",dir+"ls", false);
  xhttp.send();

  if (xhttp.status == 200)
    return JSON.parse(xhttp.responseText);

}
