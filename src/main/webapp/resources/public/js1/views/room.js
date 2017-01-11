$(document).ready(function() {
		

		  jQuery("#addRoom").validate({
			     rules: {
					room_name:{ 
					   required: true,
					    remote: { 
			                    url:"room/roomname_unique", 
			                    data: {'room_name':function(){return $('#room_name').val()},
			                    		'hotel_id':function(){return $('#hotel_id1').val()}
			                			},
			                    async:false            
						}
					}
					  },
					 messages: {
						room_name:{ 
						   required: "Please enter your room name",						   
						   remote: "Room already exists"
						}

			     },
				
		});	

	var base_url = $.cookie("base_url");
	var hotel_id=$("#hotel_id2").val();
		$.ajax({
		url: base_url+"room/foodPlan",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id},  
		
		success: function(msg) {
		$('.ep').prop("disabled", false);
		$('.ap').prop("disabled", false);
		$('.cp').prop("disabled", false);
		$('.map').prop("disabled", false);
		$('.ep').prop(msg.ep, true);
		$('.ap').prop(msg.ap, true);
		$('.cp').prop(msg.cp, true);
		$('.map').prop(msg.map, true);
		}
		}).done(function(){
            validate_room_type_occupancy();
        });
	//$(  "ul.nav li:nth-child(2)" ).css( "backgroundColor", "#ff0" );
	/*var url = document.location.toString();
    if (url.match('#')) {
        $('.nav-tabs a[href=#'+url.split('#')[1]+']').tab('show') ;
    } 
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;
    });*/
	
	
		$( document ).on( "click", "#room_toggle", function() {
		$( "ul.nav li:nth-child(2)").addClass( "active" );
		$( "ul.nav li:nth-child(1)").removeClass( "active" );
		$("#add_room_form_layout").hide();
		//var hotel_id=$("#hotel_id").val();
		//$("#hotel_id1").val(hotel_id);
		 });
	$(document).on('focus',".daterange", function(){ 
					$('.daterange').daterangepicker();
});


$("#hotel_id").change(function() {
	//alert();
	var base_url = $.cookie("base_url");
	var hotel_id=$("#hotel_id").val();
	var hotelname=$("#hotel_id option:selected").text();
	   
   $("#add_room_form_layout").show(); 
	$.ajax({
		url: base_url+"room/getRooms",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id,'hotelname':hotelname}, 
		
		success: function(msg) {
		//alert(msg.item);
		$('#room_list').html(msg.item);
	     //alert(hotel_id);
		}
		
		});
	
	 });



	

$('#plusbtn').click(function() {
	 var base_url = $.cookie("base_url");
	var hotel_id=$("#hotel_id2").val();
		$.ajax({
		url: base_url+"room/foodPlan",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id},  
		
		success: function(msg) {
		 $("#table").append('<tr><td>Special Room Tariff<br><input type="text" class="daterange"  name="special_tariff_date[]" value="" /></td><td><input type="text" class="form-control ep" id="" name="s_single_occupancy[1][]" placeholder="" '+ msg.ep +'></td><td><input name="s_double_occupancy[1][]" type="text" class="form-control ep" id="" placeholder="" '+ msg.ep +'></td><td><input name="s_single_occupancy[2][]" type="text" class="form-control cp" id="" placeholder="" '+ msg.cp +'></td><td><input name="s_double_occupancy[2][]" type="text" class="form-control cp" id="" placeholder="" '+ msg.cp +'></td><td><input name="s_single_occupancy[3][]" type="text" class="form-control map" id="" placeholder="" ' + msg.map +'></td><td><input name="s_double_occupancy[3][]" type="text" class="form-control map" id="" placeholder="" ' + msg.map +'></td><td><input name="s_single_occupancy[4][]" type="text" class="form-control ap" id="" placeholder="" '+ msg.ap +'></td><td><input name="s_double_occupancy[4][]" type="text" class="form-control ap" id="" placeholder="" ' + msg.ap +'></td></tr>');
		}
		
		}).done(function(){
          // after adding a new dynamic row let the new row get the onkeyup function for validation purpose  
       validate_room_type_occupancy();
       $(".daterange").attr("readonly","true"); // assign all daterange classes to readonly true
        }); // end of ajax and done
		});
		
	$('#minusbtn').click(function() {
		if($("#table tr").length != 3)
			{
				$("#table tr:last-child").remove();
			}
	   else
			{
				alert("You cannot delete first row");
			}
	});
	$('#hotel_id1').change(function() {
		var base_url = $.cookie("base_url");
		var hotel_id=$(this).val();
        if(hotel_id!="")
          {

        $("#add_room_form_layout").fadeIn();  // this will show the add room form  
		$("#hotel_id2").val(hotel_id);
		$.ajax({
		url: base_url+"room/foodPlan",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id},  
		
		success: function(msg) {
		$('.ep').prop("disabled", false);
		$('.ap').prop("disabled", false);
		$('.cp').prop("disabled", false);
		$('.map').prop("disabled", false);
		$('.ep').prop(msg.ep, true);
		$('.ap').prop(msg.ap, true);
		$('.cp').prop(msg.cp, true);
		$('.map').prop(msg.map, true);
		}
		}).done(function(){
            validate_room_type_occupancy();
        });
		//$('.ep').prop('readonly', true);
        }
        else{
            $("#add_room_form_layout").fadeOut(); // this will hide the add room form
        }
}); 
	 
});	 
	 function getHotel() {
		 var base_url = $.cookie("base_url");
		var hotel_id=$("#hotel_id").val();
		
		$.ajax({
			url: base_url+"room/getRooms",
			type: 'POST',
			dataType: "json",
			data: {'hotel_id': hotel_id},  
			
			success: function(msg) {
			//alert(msg.item);
			$('#room_list').html(msg.item);
			}
			});
	 }
	 
function confirmDelete(room_id) {
	  var base_url = $.cookie("base_url");
    swal({
        title: "Are you sure?",
        text: "This room will be deleted and cannot be recovered!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
   		 }, function (isConfirm) {
        if (!isConfirm) return;
        $.ajax({
			url: base_url+"room/roomDelete",
			type: 'POST',
			dataType: "json",
			data: {'room_id': room_id},  
			
		success: function(msg) {
		sweetAlert({
    title: "Done!",
    text: "Room was succesfully deleted!",
    type: "success"
},

 function getHotel() {
	 var base_url = $.cookie("base_url");
	var hotel_id=$("#hotel_id").val();
	
	$.ajax({
		url: base_url+"room/getRooms",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id},  
		
		success: function(msg) {
		//alert(msg.item);
		$('#room_list').html(msg.item);
	
		}
		
		});
	
	 
});       },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Error deleting!", "Please try again", "error");
            }
        });
    });
	}
	

$(function(){
	$("#add_room_form_layout").hide();   // hides the add room form on page load
    $(".daterange").attr("readonly","true"); // set readonly attribute to all daterange class
}); // end of ready









function roomNumberValidation(event)
{   
	var cdr="";
    var room_number_val = $("#room_number").val();
    


    var x = event.which || event.keyCode;
   
   if(x>=65 && x<=90)     // FOR CAPITAL A TO Z
   {
     
   }
   else if(x>=97 && x<=122) // FOR SMALL a to z
   {
  
   }
    else if(x>=37 && x<=40) // FOR ALLOWING UPPERARROW, LOWERARROW, LEFTARRROW, RIGHTARROW
   {
  
   }
  
   else if((x>=48 && x<=57) || x==9 || x==0 || (x>=96 && x<=105)) {  // FOR ALLOWING NUMBERS
   	    /*
		9 and 0 for tab key press keycode
		*/

	   }
   else if(x==44 || x==32 || x==8 || x==13 || x==144 || x==20){  // FOR SPACE, BACKSPACE, ENTER, CAPSLOCK
			   /*
			   144 for numlock key
			   */
			  
		   }
	else if(x==188)      // FOR COMMA 
	{
	 room_number_val = check_duplicate_rooms(room_number_val);	
	}	   
   else
   {
    room_number_val = $("#room_number").val();  
   	var rl = room_number_val.length;
   	var rnv = room_number_val.substr(0,rl-1);
   	$("#room_number").val(rnv);
   	swal({
  title: "Information",
  text: "The key pressed is not allowed. Please try again",
  timer: 2500,
  showConfirmButton: false,
  type: "error",
        });	 
     
   }
   

   /* EXTRA CHECKING FOR NUM KEY arithmetic operators +,-,*,/ etc  */ 
  room_number_val = replaceAll(room_number_val, ".", "");
  room_number_val = replaceAll(room_number_val, "*", "");
  room_number_val = replaceAll(room_number_val, "/", "");
  room_number_val = replaceAll(room_number_val, "-", "");
  room_number_val = replaceAll(room_number_val, "+", "");
  room_number_val = replaceAll(room_number_val, "~", "");
  room_number_val = replaceAll(room_number_val, "`", "");
  room_number_val = replaceAll(room_number_val, "!", "");
  room_number_val = replaceAll(room_number_val, "@", "");
  room_number_val = replaceAll(room_number_val, "#", "");
  room_number_val = replaceAll(room_number_val, "$", "");
  room_number_val = replaceAll(room_number_val, "%", "");
  room_number_val = replaceAll(room_number_val, "^", "");
  room_number_val = replaceAll(room_number_val, "&", "");
  room_number_val = replaceAll(room_number_val, "(", "");
  room_number_val = replaceAll(room_number_val, ")", "");
  room_number_val = replaceAll(room_number_val, "=", "");
   room_number_val = replaceAll(room_number_val, "{", "");
   room_number_val = replaceAll(room_number_val, "}", "");
   room_number_val = replaceAll(room_number_val, "[", "");
   room_number_val = replaceAll(room_number_val, "]", "");
   room_number_val = replaceAll(room_number_val, "|", "");
   room_number_val = replaceAll(room_number_val, "\\", "");
   room_number_val = replaceAll(room_number_val, ":", "");
   room_number_val = replaceAll(room_number_val, ";", "");
   room_number_val = replaceAll(room_number_val, "\"", "");
  
  $("#room_number").val(room_number_val);
  /*  ===========================================================  */
  //$("#room_number").val();
   check_no_of_rooms(); // initiate total rooms entered validation


}




function check_duplicate_rooms(rooms_csv_string){

if (rooms_csv_string.length>0){
    var base_url = $.cookie("base_url");


         flag = "not_duplicate"; // flag to check whether duplicate or not_duplicate found
            
                    arr = rooms_csv_string.split(",");

                        var obj = {};
                            var arr2 = [];
                            for (var i = 0; i < arr.length; i++) {
                                if (!(arr[i] in obj)) {
                                    arr2.push(arr[i]);
                                    obj[arr[i]] = true;
                                                }
                                else{
                                    flag="duplicate";  // check whether duplicate found or not
                                }                

                                       };

            
                result_string = arr2.join(",");
                arr=[]; // declaring arr array
                $.post(base_url+"room/getRoomNumbers",{"hotel_id":$("#hotel_id1").val(),"search_number":result_string},
                	function(data){
                		result_string = "";
                       arr = data.split("~");
                       
                       if (arr[0]==1 || arr[1]==""){
                          $('#room_number').val(arr[1]);
						      swal({
						      title: "Information",
						      text: "Duplicate room(s) found and will be auto-removed",
						      timer: 2500,
						      showConfirmButton: false,
						      type: "info",
						            });  
                       }
                       result_string = arr[1];
                     
                	}
                	); // end of post
                

                if (flag=="duplicate")
                {
                 swal({
      title: "Information",
      text: "Duplicate room(s) found and will be auto-removed",
      timer: 2500,
      showConfirmButton: false,
      type: "info",
            });  
                }
         $('#room_number').val(result_string);       
               return result_string;

             } // csvstring contains more than 0 length  

           
}






function replaceAll(str, find, replace) {

		   return str.split(find).join(replace);

		}



function check_no_of_rooms(){
		var total_rooms = $("#total_rooms").val();
		get_rooms = $("#room_number").val();
		total_rooms_entered = get_rooms.split(",").length;
		//alert(total_rooms_entered);
		if (total_rooms_entered>parseInt(total_rooms))
		{
		room_number_val = $("#room_number").val();  
		   	var rl = room_number_val.length;
		   	var rnv = room_number_val.substr(0,rl-1);
		   	$("#room_number").val(rnv);
		swal({
		  title: "Information",
		  text: "Room numbers cannot be more than specified no of rooms.",
		  timer: 2500,
		  showConfirmButton: false,
		  type: "warning",
		});	   	
		}
	}






function empty_no_of_rooms()
{
var specified_room_nmbrs = $("#room_number").val();
if(specified_room_nmbrs.length>0)
{ 	
$("#room_number").val("");
swal({
  title: "Information",
  text: "Total room number is changed. Please add again new rooms.",
  timer: 2500,
  showConfirmButton: false,
  type: "warning",
});	 

}
}


function allow_number_and_backspace(event,s){
//var total_rooms = $("#total_rooms").val(); 
var textbox_string = $(s).val(); 
var x = event.which || event.keyCode;
//alert(x); return false;
if((x>=48 && x<=57) || (x>=96 && x<=105) || x==9 || x==0 ){
	/*48 to 57 key code is for numbers on keyboard 0 to 9
	96 to 105 key code is for numbers on numlock keypad 0 to 9
	9 and 0 for tab key press keycode
	*/
	 var result = check_extra_characters("integer",textbox_string);
	 $(s).val(result);
	}
else if(x==8 || x==46 || (x>=37 && x<=40) || x==144){
/*
8 is backspace and 46 is delete & 37 to 40 is arrow keys. 144 for num lock key
*/
 var result = check_extra_characters("integer",textbox_string);
	 $(s).val(result);
		}
                else if(x==20){} // for negating caps lock
  else{

	   	var tl = textbox_string.length;
	   	var trms = textbox_string.substr(0,tl-1);
	    var result = check_extra_characters("integer",trms);
	   	
	   	$(s).val(result);
	   	swal({
	  title: "Information",
	  text: "The key pressed is not allowed. Please try again",
	  timer: 2500,
	  showConfirmButton: false,
	  type: "error",
	        });	 
	   }


   }




function allow_decimal_and_backspace(event,s){
//var total_rooms = $("#total_rooms").val(); 
var textbox_string = $(s).val(); 
var x = event.which || event.keyCode;
//alert(x); return false;
	if((x>=48 && x<=57) || x==9 || x==0){
	/*
	0 to 9 key codes.9 for tab keycode 0 for empty key presses like tab
	*/
	 var result = check_extra_characters("decimal",textbox_string);
	 $(s).val(result);
	}
	else if(x>=96 && x<=105){
	/*
	Numeric key codes
	*/
	var result = check_extra_characters("decimal",textbox_string);
	 $(s).val(result);
	}
	else if(x==8 || x==46 || (x>=37 && x<=40) || x==144){
	/*
	8 is backspace and 46 is delete & 37 to 40 is arrow keys 144 for num lock key 
	*/
	var result = check_extra_characters("decimal",textbox_string);
	 $(s).val(result);
			}
        else if(x==20){}                
	else if(x==190 || x==110)
	{
		/*
		190 is to check decimal point 110 is decimal point for numlock. 110 for numlock decimal point
		*/
	var decimal_point_check = textbox_string.split(".").length - 1 ;
	   if(decimal_point_check>1){
	   	// remove extra decimal point to make the number decimal 
	   	var tl = textbox_string.length;
	   	var trms = textbox_string.substr(0,tl-1);
	   	var result = check_extra_characters("decimal",trms);
	    $(s).val(result);
	   
	    	swal({
	  title: "Information",
	  text: "The key pressed is now not allowed. Please try again",
	  timer: 2500,
	  showConfirmButton: false,
	  type: "error",
	        });	
	   }	
	}		
	else{
	    
	   	var tl = textbox_string.length;
	   	var trms = textbox_string.substr(0,tl-1);
	   	var result = check_extra_characters("decimal",trms);
	    $(s).val(result);
	   	swal({
	  title: "Information",
	  text: "The key pressed is not allowed. Please try again",
	  timer: 2500,
	  showConfirmButton: false,
	  type: "error",
	        });	 
	   }
	
  }




function check_extra_characters(integer_or_decimal,textbox_string)
{
	 /* EXTRA CHECKING FOR NUM KEY arithmetic operators +,-,*,/ etc  */ 
if(integer_or_decimal == "integer"){ 
		  
	  textbox_string = replaceAll(textbox_string, ".", "");
	}
  textbox_string = replaceAll(textbox_string, "*", "");
  textbox_string = replaceAll(textbox_string, "/", "");
  textbox_string = replaceAll(textbox_string, "-", "");
  textbox_string = replaceAll(textbox_string, "+", "");
  textbox_string = replaceAll(textbox_string, "~", "");
  textbox_string = replaceAll(textbox_string, "`", "");
  textbox_string = replaceAll(textbox_string, "!", "");
  textbox_string = replaceAll(textbox_string, "@", "");
  textbox_string = replaceAll(textbox_string, "#", "");
  textbox_string = replaceAll(textbox_string, "$", "");
  textbox_string = replaceAll(textbox_string, "%", "");
  textbox_string = replaceAll(textbox_string, "^", "");
  textbox_string = replaceAll(textbox_string, "&", "");
  textbox_string = replaceAll(textbox_string, "(", "");
  textbox_string = replaceAll(textbox_string, ")", "");
  textbox_string = replaceAll(textbox_string, "=", "");

  return textbox_string;
}


/* Below code will allow to poup a message in case no hotels found   */
var nh = parseInt($("#no_of_hotels_hidden").val());

	if (nh==0 || nh=='NaN' || nh=="")
	{
	swal(
			{
				title: "Information",
		        text: "No hotels added yet. Please ensure hotels are added. Select the hotel first and then add rooms.",
		        type: "info",
		        closeOnConfirm: false,
		    },
		    
		    function(){
		        window.location = "hotel";

		             }
	    );	
	       
	    
		
	}
/* ================== no hotels found pop message function ends ======================================= */


/* As the first option named Select is fixed from drop down helper.
I manually added Select hotel name after page load
*/
$("#hotel_id option:first").text("Select Hotel");
$("#hotel_id1 option:first").text("Select Hotel");
$("#hotel_id").val("");   // preselects the first option
$("#hotel_id1").val("");  // preselects the first option

$(window).on('beforeunload',function(){

     //save info somewhere

    alert('are you sure you want to leave?');

});


function validate_room_type_occupancy()
{
//$("input:text").val(""); // will clear out all the pre written values previously selected for another hotel	
var cntr = 0;
var first_row_cntr = 1;   // first_row_cntr is used to track the odd and even column of the first row only
$(".dataTable #table tr").each(function(){
	cntr +=1;
	$(this).find("td input").attr("onkeyup","allow_decimal_and_backspace(event,this)"); // this will create a onkeyup attribute with the specified function
if (cntr<4){ 
	$(this).find("td input").each(function(){
	var undefined_or_disabled = $(this).attr("disabled");	// if find undefined then the element is not disabled
	if(undefined_or_disabled == undefined) // if undefined means the input boxes are not disabled
	{

	if (cntr==1)
	{
	odd = parseInt(first_row_cntr%2); // odd = 1; even= 0
	if(odd==1)    // will only put the required attribute on odd input type textboxes
	{
	$(this).attr("required",true);  // putting the attribute required on the HTML input text boxes
	$(this).attr("aria-required",true);	// putting the aria-required attribute on the HTML input text boxes 
	}	
	first_row_cntr+=1;
	}
	else {	
	$(this).attr("required",true);  // putting the attribute required on the HTML input text boxes
	$(this).attr("aria-required",true);	// putting the aria-required attribute on the HTML input text boxes
	     }

	} // end of if undefined
	}); // end of inner each

	}  // end of cntr

}); // end of master each


}

//validate_room_type_occupancy();

// Javascript for Tutorial Video

$(document).ready(function() {
  $(".youtube").each(function() {
    $(this).css('background-image', 'url(//i.ytimg.com/vi/' + this.id + '/hqdefault.jpg)');
    $(document).delegate('#' + this.id, 'click', function() {
      var iframe_url = "//www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
      if ($(this).data('params')) iframe_url += '&' + $(this).data('params');
      var iframe = $('<iframe/>', {'allowfullscreen':'allowfullscreen', 'frameborder': '0', 'src': iframe_url})
      $(this).append(iframe);
    });
  }); 

});
function confirmDelete2(room_id) {
			  var base_url = $.cookie("base_url");
			 sweetAlert("Cannot Delete Rooms", "This room cannot be deleted because the hotel is using Channel Manager!", "error");
		    
			}
