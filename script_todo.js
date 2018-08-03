$(function() {
  var itemIdToBeDeleted;
  var checkedBox;
  var checkedItem;
  var itemIdToBeEdited;
  var ajaxUrl="https://warm-plains-44796.herokuapp.com/todos";
  var updateStatus;
  var filterUrl;

  function showTaskItems(apiData) {
    for (i = 0; i < apiData.length; i++) {
      if (apiData[i].status==="open") {
        $("#todo-list").append('<li id='+apiData[i].id+'><input type="checkbox">'+
        apiData[i].title+'<button class="remove-button">X</button></li>');
        
      }
      else {
        $("#todo-list").append('<li class="strikethrough" id='+apiData[i].id+
          '><input type="checkbox" checked="checked">'+apiData[i].title+
          '<button class="remove-button">X</button></li>');
      }
    }
  }

  function getTaskList(url) {
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
    if (value == "") {
      return;
    } 
    else {
      $.ajax({
        url:ajaxUrl,
        type:"POST",
        data:
          {"todo":
            {
              "title": value, 
              "status": "open"
            }
          },
        success:function(apiData){
          $("#todo-list").append('<li id='+apiData.id+'><input type="checkbox">'
            +apiData.title+'<button class="remove-button">X</button></li>') 
          $('.text-field').val("");        
        },
        error:function(){
          console.log("posting not done")
        }
      });      
    }
  }

  function updateTaskStatus(itemIdToBeEdited,updateStatus) {
    $.ajax({
        url:ajaxUrl+"/"+ itemIdToBeEdited,
        type:"PUT",
        data:
          {"todo":
            {
              
              "status": updateStatus
            }
          },
        success:function(apiData){
          console.log("status updated ")
        },
        error:function(error){
          console.log("status not updated")
        }
      })
  }

  getTaskList(ajaxUrl);

  $('#add-button').on('click',AddList);

  $('.text-field').keypress(function (event) {
    if (event.which == 13) {
      AddList();
    }
  });
  
  $("#view_all,#active_tasks,#closed_tasks").on('click',function(event){
    filterUrl=ajaxUrl + "?status=" + $(event.target).attr('data');
    getTaskList(filterUrl);  
  });

  $("#todo-list").on('click','input[type="checkbox"]',function(){
    checkedItem=$(this).parent();
    itemIdToBeEdited=checkedItem.attr('id');
    if (checkedItem.hasClass('strikethrough')) {
      checkedItem.removeClass("strikethrough");
      updateStatus="open";
      updateTaskStatus(itemIdToBeEdited,updateStatus);
    } 
    else {
      checkedItem.addClass("strikethrough");
      updateStatus="closed" ;
      updateTaskStatus(itemIdToBeEdited,updateStatus);           
    }
  });

  $("#todo-list").on('click','.remove-button',function(){
    itemIdToBeDeleted=$(this).parent().attr("id");
    $.ajax({
      url:ajaxUrl +"/"+ itemIdToBeDeleted,
      type:"DELETE",
      success:function(){
        $('#'+itemIdToBeDeleted).remove();
      },
      error:function(){
        console.log("deletion not done")
      }
    })
  });


  $("#todo-list").on('mouseover',".remove-button",function(){
    $(this).css("background-color", "red");
  });

  $("#todo-list").on('mouseout',".remove-button",function(){
    $(this).css("background-color", "#e8e8e8");
  });

});