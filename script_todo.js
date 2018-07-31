$(function() {
        var itemIdToBeDeleted;
        var checkedBox;
        var checkedItem;
        var itemIdToBeEdited;

        $.ajax({
          url:"https://warm-plains-44796.herokuapp.com/todos",
          type:"GET",
          success:function(apiData){
            for (i = 0; i < apiData.length; i++) {
              if (apiData[i].status==="open") {
                $("#todo-list").append('<li id='+apiData[i].id+'><input type="checkbox">'+
                apiData[i].title+'<button class="remove-button">X</button></li>');
                
              }
              else {
                $("#todo-list").append('<li class="strikethrough" id='+apiData[i].id+'><input type="checkbox" checked="checked">'+
                apiData[i].title+'<button class="remove-button">X</button></li>');
              }
            }
          },
          error: function(error){
            console.log(error);
          }
        })




        function AddList() {
          var value = $('.text-field').val();
          console.log(value);

          $.ajax({
            url:"https://warm-plains-44796.herokuapp.com/todos",
            type:"POST",
            data:
              {"todo":
                {
                  "title": value, 
                  "status": "open"
                }
              },
            success:function(apiData){
              console.log("done");
              $("#todo-list").append('<li id='+apiData.id+'><input type="checkbox">'+apiData.title+'<button class="remove-button">X</button></li>') 
              $('.text-field').val("");        
            },
            error:function(){
              console.log("posting not done")
            }
          })
        }
  
        $("#todo-list").on('click','.remove-button',function(){
          itemIdToBeDeleted=$(this).parent().attr("id");

          $.ajax({
            url:"https://warm-plains-44796.herokuapp.com/todos/"+itemIdToBeDeleted,
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

        $("#todo-list").on('click','input[type="checkbox"]',function(){
          checkedItem=$(this).parent();
          itemIdToBeEdited=checkedItem.attr('id');
          if (checkedItem.hasClass('strikethrough')) {
            checkedItem.removeClass("strikethrough");
            $.ajax({
              url:"https://warm-plains-44796.herokuapp.com/todos/"+itemIdToBeEdited,
              type:"PUT",
              data:
                {"todo":
                  {
                    
                    "status": "open"
                  }
                },
              success:function(apiData){
                console.log("status opened")
              },
              error:function(error){
                console.log("status not updated")
              }
            })
          } 
          else {
            checkedItem.addClass("strikethrough"); 
            $.ajax({
              url:"https://warm-plains-44796.herokuapp.com/todos/"+itemIdToBeEdited,
              type:"PUT",
              data:
                {"todo":
                  {
                    
                    "status": "closed"
                  }
                },
              success:function(apiData){
                console.log("status closed")
              },
              error:function(error){
                console.log("status not updated")
              }
            })           
          }

        })
        

        $('#add-button').on('click',AddList);
        $('.text-field').keypress(function (event) {
          if (event.which == 13) {
            AddList();
          }
        });
        


      });