//truc qui communique avec mon serveur pour avoir la liste des éléments d'un dossier

function getListing(dir) {

  console.log("test");
  $.getJSON('./somedir', data => {
          console.log(data); //["doc1.jpg", "doc2.jpg", "doc3.jpg"]
      });

  let xhttp = new XMLHttpRequest();

  //synchronous XMLHTTP
  xhttp.open("GET",dir+"ls", false);
  xhttp.send();

  if (xhttp.status == 200)
    return JSON.parse(xhttp.responseText);

}
