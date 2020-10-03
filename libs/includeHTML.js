//source : https://www.w3schools.com/howto/howto_html_include.asp
// (modifié par scouarn)

function includeHTML() {

  //get all elemennts in file
  let elements = document.getElementsByTagName("*");
  for (let i = 0; i < elements.length; i++) {

    let elem = elements[i];
    /*search for elements with a certain atrribute:*/
    let file = elem.getAttribute("includeHTML");

    if(file != null) {

      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elem.innerHTML = this.responseText;}
          if (this.status == 404) {elem.innerHTML = "Page not found.";}
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
    }

  }


}
