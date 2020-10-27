
function getCat() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat");
}


function initMenu() {

  //set the onclick function
  $.each($("#menu li"), (index, elem)=> {
    $(elem).click(()=>{
      const cat = $(elem).attr("cat");

      if (cat != getCat()) {
        window.history.pushState("State", 'Title', '/?cat=' + cat);
        showFeed(cat);
      }

    });
  });

  //set the history back function
  window.onpopstate = (e)=>{
    if(e.state) {
      updateFeed();
    }
  };

  

}


function updateFeed() {

  //find cat
  const cat = getCat();

  //show cat
  if (cat == null) {
    showFeed("main");
  }
  else {
    showFeed(cat);
  }
}



function showFeed(cat) {

  //remove the feed
  $("#article_feed").empty();

  //load the feed
  $.getJSON( "/articles/manifest.json", (obj) =>{
    $.each(obj[cat].files,(index,file)=> {
      $('#article_feed').append($("<article></article>").addClass("box").load('/articles/'+obj[cat].folder+'/'+file));

    });
  });


}
