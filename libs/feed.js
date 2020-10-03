function includeFeed() { //par mes soins
  let params = new URLSearchParams(window.location.search);

  let category = params.get('cat');
  let page = params.get('page');
  if (page == null)
    page = 1;

  let nArticles = params.get('nart');
  if (nArticles == null)
    nArticles = 5;

  let feed = document.getElementById("article_feed");
  let path = "/articles/" + category + "/";
  let listing = getListing(path);

  //REMPLIR LE FEED

  //synchronous XMLHTTP
  let xhttp = new XMLHttpRequest();
  for (let i = (page-1)*nArticles; i < listing.length && i < page*nArticles; i++) {

    xhttp.open("GET", path+listing[i] , false);
    xhttp.send();

    if (xhttp.status == 200) {feed.innerHTML += "<article class='box'>"+xhttp.responseText+"</article>";}

  }


  //LISTE DES PAGES
  let nPages = listing.length/nArticles;

  if (nPages > 1) {

      let list = document.createElement("NAV");
      list.classList.add("page_list");

      let url = window.location.href.split("?")[0];

      for (i = 1; i < nPages+1; i++) {
        params.set("page",i);
        let classes = "page_list_button";
        if (page == i)
          classes += " current_page";

        list.innerHTML += "<a href='"+url+'?'+params.toString()+"'><li class='"+classes+"'>"+i+"</li></a>";
      }
      feed.appendChild(list);

  }
}
