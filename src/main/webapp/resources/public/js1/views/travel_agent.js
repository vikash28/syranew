$(document).ready(function(){
	var base_url = $.cookie("base_url");
	validate_room_type_occupancy();
/*	var url = document.location.toString();
    if (url.match('#')) {
        $('.nav-tabs a[href=#'+url.split('#')[1]+']').tab('show') ;
    } 
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;

    } );*/
	$("#general_percentage_edit").validate({
			     rules: {
					
					agent_id: {
						required: true					
						
					},
					general_percentage: {
						required: true,						
						number: true,
						max:99.99,
						min:1
					}
					
					
					
			     },
			     messages: {
						
												
			     },
				
		});
	$("#general_percentage_add").validate({
			     rules: {
					
					agent_id: {
						required: true					
						
					},
					general_percentage: {
						required: true,						
						number: true,
						max:99.99,
						min:1
					}
					
					
					
			     },
			     messages: {
						
												
			     },
				
		});
	
	
	$("#Addagent").validate({
			     rules: {
					
					agent_name: {
						required: true,						
						lettersonly: true,
						noSpace: true
					},
					agent_phonenumber1: {
						required: true,						
						maxlength: 11,
						number: true
					},
					agent_phonenumber2: {												
						maxlength: 11,
						number: true,
						notEqualTo:"#agent_phonenumber1"
					},
					agent_contact_person: {
						required: true,						
						lettersonly: true,
						noSpace: true
					},
					agent_address: {
						required: true,						
						noSpace: true
					},
					agent_email_address: {												
						newemail: true
					},
					agent_website: {												
						url: true
					}
					
					
			     },
			     messages: {
					 agent_phonenumber2: {												
						notEqualTo:"Phone Number and Alternate Number can't be same"
					},
						
												
			     },
				
		});
		
		
		$("#editagent").validate({
			     rules: {
					
					agent_name: {
						required: true,						
						lettersonly: true,
						noSpace: true
					},
					agent_phonenumber1: {
						required: true,						
						maxlength: 11,
						number: true
					},
					agent_phonenumber2: {												
						maxlength: 11,
						number: true,
						notEqualTo:"#agent_phonenumber1"
					},
					agent_contact_person: {
						required: true,						
						lettersonly: true,
						noSpace: true
					},
					agent_address: {
						required: true,						
						noSpace: true
					},
					agent_email_address: {												
						newemail: true
					},
					agent_website: {												
						url: true
					}
					
					
			     },
			     messages: {
					 agent_phonenumber2: {												
						notEqualTo:"Phone Number and Alternate Number can't be same"
					},	
												
			     },
				
		});
	
	var agents_id=$("#agent_id").val();
	if(agents_id!="") {
	 $('#wrapper_new').css('display','block');
	 }
	 else {
		 $('#wrapper_new').css('display','none');
	 }
	
	$('#agent_id').on('change', function() {
 var agents_id= this.value;
 if(agents_id!="")
 {
	 $('#wrapper_new').css('display','block');
	 $('#taid').val(agents_id);
 }
 else
 {
	 $('#wrapper_new').css('display','none');
 }
	 
});
		
$('.edit_agent').click(function() { 
var base_url = $.cookie("base_url");
    var id = $(this).attr('id');
		$.ajax({
			url: base_url+"travel_agent/editagent",
		type: 'POST',
		dataType: "json",
		data: {'agent_id': id},  
		
		success: function(msg) {
		$('#edit_agent').html(msg.item);
		}
		});
							
});	
$(".ota").click(function() {     
   var ota=$(this).val();
   if(ota==0){
	  $('#agent_place').html('<input type="text" name="agent_name" class="form-control" id="agent_name" placeholder="" required aria-required="true">');   
   }else{
	   $.ajax({
		url: base_url+"travel_agent/travel_agent_name",
		type: 'POST',
		dataType: "json",
		//data: {'hotel_id': hotel_id},  
		
		success: function(msg) {
		//alert(msg.item);
		$('#agent_place').html(msg.item);
	
		}
		
		});
	   }
});


});


// JavaScript for Sweet Alert function -- used for deleting hotel 
function confirmDelete(agent_id) {
	var base_url = $.cookie("base_url");
	 
    swal({
        title: "Are you sure?",
        text: "This will delete the travel agent and its rates and cannot be recovered!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
   		 }, function (isConfirm) {
        if (!isConfirm) return;
        $.ajax({
			url: base_url+"travel_agent/agentDelete",
			type: 'POST',
			dataType: "json",
			data: {'agent_id': agent_id},  
			success: function(msg) {
		sweetAlert({
    title: "Done!",
    text: "Travel agent was successfully deleted!",
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
	
	 
});
 },
		success: function(msg) {
                swal("Done!", "It was succesfully deleted!", "success");
				setTimeout(function(){
				window.location.reload(1);
				}, 1000);
				
            },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Error deleting!", "Please try again", "error");
            }
        });
    });
}
// Sweet alert code ends 
  $('#myForm').on('submit', function() {
         var general_percentage_1= $('#general_percentage_1').val();
		if(general_percentage_1=="")
		{
		   swal("Error!", "Please add a general percentage commission for this travel agent. If there is no General Percentage comission, please enter 0", "error");
		    return false;
		}
     });
	 
	 
function validate_room_type_occupancy()
{
//$("input:text").val(""); // will clear out all the pre written values previously selected for another hotel	
var cntr = 0;
var first_row_cntr = 1;   // first_row_cntr is used to track the odd and even column of the first row only
$(".table #table tr").each(function(){
	cntr +=1;
	$(this).find("td div input").attr("onkeyup","allow_decimal_and_backspace(event,this)"); // this will create a onkeyup attribute with the specified function
if (cntr<4){ 
	$(this).find("td div input").each(function(){
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
function allow_decimal_and_backspace(event,s){
//var total_rooms = $("#total_rooms").val(); 
var textbox_string = $(s).val(); 
var x = event.which || event.keyCode;
//alert(x);
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
function replaceAll(str, find, replace) {

		   return str.split(find).join(replace);

		}

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

