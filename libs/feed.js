
function initMenu() {
  //set the onclick function
  $.each($("#menu li"), (index, elem)=> $(elem).click(
    ()=>updateFeed($(elem).attr("cat"))
  ))


}


function initFeed(cat = "main") {
  updateFeed(cat)
}

function updateFeed(cat) {
  //BROWSER HISTORY PUSH

  //remove the feed
  $("#article_feed").empty();

  //load the feed
  $.getJSON( "/articles/manifest.json", (obj) =>{
    $.each(obj[cat].files,(index,file)=> {
      $('#article_feed').append($("<article></article>").addClass("box").load('/articles/'+obj[cat].folder+'/'+file))

    });
  });

}
