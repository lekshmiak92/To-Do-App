$(function() {
  var backendUrl = "https://warm-plains-44796.herokuapp.com/todos";
  var $todoList = $("#todo-list");

  function showTaskItems(apiData) {
    for (i = 0; i < apiData.length; i++) {
      if (apiData[i].status === "open") {
        $todoList.append('<li id=' +apiData[i].id +'><input type="checkbox" class="checkbox">'
          + apiData[i].title +'<button data-id='+apiData[i].id +
          ' class="remove-button">X</button></li>');
      }
      else {
        $todoList.append('<li class="strikethrough" id='+ apiData[i].id +
          '><input type="checkbox" class="checkbox" checked="checked">'+apiData[i].title+
          '<button data-id='+apiData[i].id+' class="remove-button">X</button></li>');
      }
    }
  }

  function getTaskList(options) {
    var filterOptions = "?status=" + options || "";
    $.ajax({
      url:backendUrl + filterOptions,
      type:"GET",
      success:function(apiData){
        $('#todo-list').empty();
        showTaskItems(apiData);
      },
      error: function(errorDetails){
        errorMessage(errorDetails); 
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
          $todoList.append('<li id=' +apiData.id +'><input type="checkbox" class="checkbox">'
            + apiData.title + '<button data-id='+ apiData.id +
            ' class="remove-button">X</button></li>') 
          $('.text-field').val("");        
        },
        error:function(errorDetails){
          errorMessage(errorDetails); 
        }
      });      
    }
  }

  function updateTaskStatus(checkedItem) {
    var $item = $(checkedItem.parent());
    var itemId = $item.attr("id");
    var newStatus;
    if (checkedItem.prop("checked")) {
      newStatus="closed" ;
    } 
    else {
      newStatus = "open";
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
      },
      error:function(errorDetails){
        errorMessage(errorDetails);
      }
    });
  }

  function errorMessage(message){
    var $errorMsg = $('.error-msg');
    $errorMsg.append(message);
    $errorMsg.fadeIn(500).delay(1500).fadeOut(2000);
    $errorMsg.empty();
  }

  getTaskList();

  $('#add-button').on('click', AddList);

  $('.text-field').keypress(function (event) {
    if (event.which == 13) {
      AddList();
    }
  });
  
  $(".button-filter").on('click', function(event){
    getTaskList($(event.target).attr('data-filter')); 
  });

  $todoList.on('click', ".checkbox", function(){
    var checkedItem = $(this);    
    updateTaskStatus(checkedItem);
  });

  $todoList.on('click', '.remove-button', function(){
    var itemId = $(this).attr("data-id");
    console.log(itemId);
    $.ajax({
      url:backendUrl +"/"+ itemId,
      type:"DELETE",
      success:function(){
        $("#"+itemId).remove();
      },
      error:function(){
        errorMessage(errorDetails);
    });
  });
});