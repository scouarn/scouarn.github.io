
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

  //window hash anchor (not working)
  //const hash0 = window.location.hash;
  //const hash1 = hash0.split("#").pop();

  //load the feed
  $.getJSON("/articles/manifest.json", (obj) =>{
  
    $.each(obj[cat].files,(index,file)=> {
      const hash2 = file.split(".")[0];

      $('#article_feed').append($("<article id="+hash2+"></article>").addClass("box").load('/articles/'+obj[cat].folder+'/'+file));

      // if (hash1 == hash2)
      //   $(window).ready(()=>{window.scrollTo(0,$(hash0)[0].offsetTop); console.log($(hash0)[0].offsetTop);});

    });

  });



}
