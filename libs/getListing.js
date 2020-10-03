//truc qui communique avec mon serveur pour avoir la liste des éléments d'un dossier

function getListing(dir) {

  console.log("HELLO");
  $.getJSON(dir, data => {
          console.log(data); //["doc1.jpg", "doc2.jpg", "doc3.jpg"]
      });


  return 1;


}
