$(function() {
        var itemToBeDeleted;
        
        $.ajax({
          url:"https://warm-plains-44796.herokuapp.com/todos",
          type:"GET",
          success:function(apiData){
            for (i = 0; i < apiData.length; i++) {
              $("#todo-list").append('<li id='+apiData[i].id+'>'+apiData[i].title+'<button class="remove-button">X</button></li>');
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
              $("#todo-list").append('<li id='+apiData.id+'>'+apiData.title+'<button class="remove-button">X</button></li>') 
              $('.text-field').val("");
              
              
            },
            error:function(){
              console.log("posting not done")
            }
          })
        }
  
        $("#todo-list").on('click','.remove-button',function(){
          itemToBeDeleted=$(this).parent().attr("id");

          $.ajax({
            url:"https://warm-plains-44796.herokuapp.com/todos/"+itemToBeDeleted,
            type:"DELETE",
            success:function(){
              $('#'+itemToBeDeleted).remove();
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
        

        $('#add-button').on('click',AddList);
        $('.text-field').keypress(function (event) {
          if (event.which == 13) {
            AddList();
          }
        });
        
        


      });