$(function() {
  var backendUrl="https://warm-plains-44796.herokuapp.com/todos";
  var $todoList=$("#todo-list");

  function showTaskItems(apiData) {
    for (i = 0; i < apiData.length; i++) {
      if (apiData[i].status==="open") {
        $todoList.append('<li id='+apiData[i].id+'><input type="checkbox" data="open">'+
        apiData[i].title+'<button data='+apiData[i].id+' class="remove-button">X</button></li>');
        
      }
      else {
        $todoList.append('<li class="strikethrough" id='+apiData[i].id+
          '><input type="checkbox" data="closed" checked="checked">'+apiData[i].title+
          '<button data='+apiData[i].id+' class="remove-button">X</button></li>');
      }
    }
  }

  function getTaskList(options) {
    var filterOptions=options || "";
    var url=backendUrl+filterOptions;
    $.ajax({
      url:url,
      type:"GET",
      success:function(apiData){
        $('#todo-list').empty();
        showTaskItems(apiData);
      },
      error: function(error){
        console.log(error);
      }
    });         
  }

  function AddList() {
    var value = $('.text-field').val();
    if (value !== "") {
      $.ajax({
        url:backendUrl,
        type:"POST",
        data:
          {"todo":
            {
              "title": value, 
              "status": "open"
            }
          },
        success:function(apiData){
          $todoList.append('<li id='+apiData.id+'><input type="checkbox" data="open">'
            +apiData.title+'<button data='+apiData.id+' class="remove-button">X</button></li>') 
          $('.text-field').val("");        
        },
        error:function(){
          console.log("posting not done")
        }
      });      
    }
  }

  function updateTaskStatus(checkedItem) {
    var $item = $(checkedItem.parent());
    var itemId=$item.attr("id");
    var newStatus;
    if (checkedItem.attr('data')=="closed") {
      newStatus="open";
    } 
    else {
      newStatus="closed" ;
    }  
    $.ajax({
      url:backendUrl+"/"+ itemId,
      type:"PUT",
      data:
        {"todo":
          {
            
            "status": newStatus
          }
        },
      success:function(apiData){
        console.log("status updated ")
        if (apiData.status == "open") {
         $item.removeClass("strikethrough");
        } 
        else {
          $item.addClass("strikethrough");
        }
        checkedItem.attr('data',newStatus)
      },
      error:function(error){
        console.log("status not updated")
      }
    });
  }

  getTaskList();

  $('#add-button').on('click',AddList);

  $('.text-field').keypress(function (event) {
    if (event.which == 13) {
      AddList();
    }
  });
  
  $(".button-filter").on('click',function(event){
    var filterUrl;
    filterUrl= "?status=" + $(event.target).attr('data');
    getTaskList(filterUrl);  
  });

  $todoList.on('click','input[type="checkbox"]',function(){
    var checkedItem=$(this);    
    updateTaskStatus(checkedItem);
  });

  $todoList.on('click','.remove-button',function(){
    var itemId=$(this).attr("data");
    console.log(itemId);
    $.ajax({
      url:backendUrl +"/"+ itemId,
      type:"DELETE",
      success:function(){
        $("#"+itemId).remove();
      },
      error:function(){
        console.log("deletion not done")
      }
    });
  });


  $todoList.on('mouseover',".remove-button",function(){
    $(this).css("background-color", "red");
  });

  $todoList.on('mouseout',".remove-button",function(){
    $(this).css("background-color", "#e8e8e8");
  });
});