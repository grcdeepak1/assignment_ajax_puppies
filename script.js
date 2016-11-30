var MyAjax = {
  init: function() {
    MyAjax.statusUpdate();
    MyAjax.getBreeds();
    MyAjax.puppyRefresh();
    MyAjax.attachRefreshListener();
    MyAjax.formSubmitListener();
    MyAjax.adoptPuppyListener();
  },

  // AJAX 1 : retrieve breeds
  getBreeds: function() {
    $.ajax({
      url: "https://ajax-puppies.herokuapp.com/breeds.json",
      type: "GET",
      dataType : "json",

      success: function(json) {
        json.forEach(function(breed){
          $("#dog-form-select").append("<option value=\"" + breed.id + "\">" + breed.name + "</option>");
        });
      },

      error: function( xhr, status, errorThrown ) {
        $('.error').html('');
        $("#puppy-container").append("<h3 class='error'>Error thrown, it is: " + errorThrown + " </h3>");
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );
      },

      complete: function( xhr, status ) {
        console.log( "The request is complete!" );
      }
    });
  },

  attachRefreshListener: function() {
    $("#refresh-puppies").click(function(e){
      MyAjax.puppyRefresh();
    });
  },

  // AJAX 2 : retrieve/refresh puppies
  puppyRefresh: function() {
    $.ajax( {
      url: "https://ajax-puppies.herokuapp.com/puppies.json",
      type: "GET",
      dataType : "json",

      success: function( json ) {
        $("#puppy-container").html("");
        $('.error').html('');
        json.forEach(function(dog){
          $("#puppy-container").append("<p>Name: " + dog.name + "( " + dog.breed.name + " ) <span class=\"adopt\" id =\"" + dog.id + "\">adopt</span>");
        });
      },

      error: function( xhr, status, errorThrown ) {
        $('.error').html('');
        $("#puppy-container").append("<h3 class='error'>Error thrown, it is: " + errorThrown + " </h3>");
        console.log( "Error: " + errorThrown );
        console.log( "Status: " + status );
        console.dir( xhr );
      },

      complete: function( xhr, status ) {
        console.log( "The request is complete!" );
      }
    });
  },

  //AJAX 3 : USER INPUT
  formSubmitListener: function() {
    $("#dog-form").submit(function(e){
      var postData = $(this).serializeArray();
      postData = ({name: postData[0].value, breed_id: postData[1].value });
      postData = JSON.stringify(postData);
      $.ajax( {
        url: "https://ajax-puppies.herokuapp.com/puppies.json",
        data: postData,
        type: "POST",
        contentType: "application/json",
        dataType: "json",

        success: function( dog ) {
          $('.error').html('');
          $.get('https://ajax-puppies.herokuapp.com/breeds/'+dog.breed_id+'.json', '', function(breed) {
            $("#puppy-container").append("<p>Name: " + dog.name + "( " + breed.name + " ) <span class=\"adopt\" id =\"" + dog.id + "\">adopt</span>");
          });
        },

        error: function( xhr, status, errorThrown ) {
          $('.error').html('');
          $("#puppy-container").append("<h3 class='error'>Error thrown, it is: " + xhr.responseText + " </h3>");
          console.log( "Error: " + xhr.responseText );
          console.log( "Status: " + status );
          console.dir( xhr );
        },

        complete: function( xhr, status ) {
          console.log( "The request is complete!" );
        }
      });
      e.preventDefault();
    });
  },

  //AJAX 4 : delete puppy from list
  adoptPuppyListener: function() {
    $( "#puppy-container" ).on( "click", ".adopt", function(){
      console.log("adopt!");
      var puppyId = this.id;
      $.ajax({
        url: 'https://ajax-puppies.herokuapp.com/puppies/' + puppyId + '.json',
        type: "DELETE",
        contentType: "application/json",
        dataType: "json",

        success: function() {
            MyAjax.puppyRefresh();
        },

        error: function( xhr, status, errorThrown ) {
           $("#puppy-container").append("<h3>Error to delete thrown, it is: " + errorThrown + " </h3>");
           MyAjax.producedError = errorThrown;
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        },

        complete: function( xhr, status ) {
            console.log( "The request is complete!" );
        }
      });
    });
  },

  statusUpdate: function() {
    $( document ).ajaxStart(function(){
      MyAjax.clearClass();
      $("#ajax-status-indicator").html("Waiting...").addClass("yellow");

      setTimeout(function(){
        if(MyAjax.finishedOrError === false){
          $("#ajax-status-indicator").html("Sorry this is taking so long...");
        }
      }, 1000);
    });

    $( document ).ajaxSuccess(function(){
      MyAjax.clearClass();
      $("#ajax-status-indicator").html("Finished!").addClass("green");
      MyAjax.finishedOrError = true;
      $("#ajax-status-indicator").fadeOut( 2000 );
    });

    $( document ).ajaxError(function(){
      MyAjax.clearClass();
      $("#ajax-status-indicator").html("Failed. Errors were: " + MyAjax.producedError).addClass("red");
      $("#ajax-status-indicator").fadeOut( 2000 );
    });
  },

  clearClass: function(){
    $("#ajax-status-indicator").removeClass("yellow").removeClass("green").removeClass("red")
  },
  finishedOrError: false,

  producedError: "none",
}

$( document ).ready(function() {
  MyAjax.init();
});