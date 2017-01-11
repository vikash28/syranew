$(document).ready(function(){
	
$('#save_rate').click(function() {
var general_percentage = $("#general_percentage").val();	

if( general_percentage=='' || general_percentage.length==0)
{
	//alert(general_percentage);
        swal("Error!", "Please add a general percentage please add at list 1.", "error");
        return false;   
}
});    
	
$('#edit_rate').click(function() {
var general_percentage = $("#general_percentage").val();	

if( general_percentage=='' || general_percentage.length==0)
{
	//alert(general_percentage);
        swal("Error!", "Please add a general percentage please add at list 1.", "error");
        return false;   
}
}); 	
	
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
	$("#corporatesform").validate({
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
	  $("#editCorporate").validate({
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
						number: true
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
					  agent_website: {												
						url: "Please enter a valid URL. Ex : https://www.google.co.in"
					}
					
						
												
			     },
				
		});
	
	
	$("#AddCorporate").validate({
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
						number: true
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
					 agent_website: {												
						url: "Please enter a valid URL. Ex : https://www.google.co.in"
					}
						
												
			     },
				
		});
	
	
	
/*	var url = document.location.toString();
    if (url.match('#')) {
        $('.nav-tabs a[href=#'+url.split('#')[1]+']').tab('show') ;
    } 
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;

    } );
	*/
var agents_id=$("#agent_id").val();
	if(agents_id!="")
 {
	 $('#wrapper_new').css('display','block');
 }
 else
 {
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
			url: base_url+"corporate/editagent",
		type: 'POST',
		dataType: "json",
		data: {'agent_id': id},  
		
		success: function(msg) {
		$('#edit_agent').html(msg.item);
		}
		});
							
});	

/* Below code will allow to poup a message in case no hotels found   */
var hotel_count = parseInt($("#no_of_hotels_hidden").val());

if (hotel_count==0 || hotel_count=='NaN' || hotel_count=="")
{
swal({title: "Information",
        text: "No hotels added yet. Please ensure hotels are added. Select the hotel first and then add rooms.",
        type: "info",
        closeOnConfirm: false,
        },
        function(){
        window.location = "hotel";
                  });    
    
}

var room_count = parseInt($("#no_of_room").val());
var name =$("[name='hotel_id'] option:selected").text();
if (room_count==0 || room_count=='NaN' || room_count=="")
{
swal({title: "Information",
        text: "No Room added yet. Please ensure Room are added in "+name+" hotel.",
        type: "info",
        closeOnConfirm: false,
        },
        function(){
        window.location = "room";
                  });    
       
    
    
}
});


// JavaScript for Sweet Alert function -- used for deleting hotel 
function confirmDelete(agent_id) {
	var base_url = $.cookie("base_url"); 	 
    swal({
        title: "Are you sure?",
        text: "This Corporate will be deleted and cannot be recovered!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
   		 }, function (isConfirm) {
        if (!isConfirm) return;
        $.ajax({
			url: base_url+"corporate/agentDelete",
			type: 'POST',
			dataType: "json",
			data: {'agent_id': agent_id},  
			success: function(msg) {
		sweetAlert({
    title: "Done!",
    text: "Corporate was succesfully deleted!",
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
                swal("Done!", "Corporate was succesfully deleted!", "success");
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