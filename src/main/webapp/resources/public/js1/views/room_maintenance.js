 $(document).ready(function(){
	 var base_url = $.cookie("base_url");	 
	  
		
	$(document).on('focus',".daterange", function(){ 
	$('.daterange').daterangepicker();
	});
 $("#show").css("display", "none"); 
	
	$( document ).on( "click", "#sbmt", function(e) {
	 var checked = $("input:checked").length > 0;
		if (!checked){
			swal("Error!", "Please select at least one room to add for maintenance", "error");
			return false;
		}else{
			// console.log( $("#roommaintenanceform").serialize() )
			  $("#roommaintenanceform").validate({
			     rules: {
					
					comment: {
						required: true,						
						noSpace: true
					},
					date: {
						required: true,						
						},
				
			     },
			     messages: {
						
					
						
			     },
			submitHandler: function(form){
					var data = $(form).serializeArray();
					
					$.ajax({
							url: base_url+"room_maintenance/check",
							type: 'POST',
							dataType: "json",
							data: $(form).serializeArray(),  
							success: function(msg) {
							if (!msg.item){
								$.post(base_url+"room_maintenance/addroommaintenance",$(form).serializeArray(),function(){})
								.done(function(d) {
									var d_r =$.parseJSON(d);
									//console.log(d_);
									
								// window.location.href = base_url+"room_maintenance";
								 swal({ title: "Add room maintenance",
									  text: "Room Number "+d_r.room_no+" has been added to maintenance for "+d_r.dt,
									  timer: 2000,
									  showConfirmButton: false
								},
								function(){
								window.location = base_url+"room_maintenance";
										  }); 
								  });
						
						}else{
							swal("Room Already Booked!", msg.item+" This room is already booked and cannot be put into maintenance. To put it into maintenance, cancel the booking first", "error");
							return false;}					
						
						
							}
							});	
				
					return false;
					
			},
		});
			
			
			
		}
	});

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

});
	function date(id)
	{
	$("#"+id).datepicker({
		   minDate:0,
		   dateFormat: "m/d/yy" 
	});
	}
function confirmDelete(id) 
{
	var base_url = $.cookie("base_url");
    swal({
        title: "Are you sure?",
        text: "This room will be removed from Maintenance!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, remove it!",
        closeOnConfirm: false
   		 }, function (isConfirm) {
        if (!isConfirm) return;
        $.ajax({
			url: base_url+"room_maintenance/room_maintenanceDelete",
			type: 'POST',
			dataType: "json",
			data: {'id': id},  
		success: function(msg) {
		sweetAlert({
    title: "Done!",
    text: "Succesfully removed from Maintenance!",
    type: "success"
},
 function getroominfo() {
	 var base_url = $.cookie("base_url");
	$("#maintenance-div").css("display", "block"); 
	var hotel_id=$("#hotel_id1").val();
	$.ajax({
		url: base_url+"room_maintenance/getmaintenanceRoom",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id},  
		success: function(msg) {
		$('#data-list').html(msg.item);
		}
		});
});				
            },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Error deleting!", "Please try again", "error");
            }
        });
    });
	}
function getroom() {
	 var base_url = $.cookie("base_url");	
	var hotel_id=$("#hotel_id").val();
	if(hotel_id!=''){
	$("#show").css("display", "block"); 
	$.ajax({
		url: base_url+"room_maintenance/roominfo",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id},  
		success: function(msg) {
		if(msg.item!=""){
		$('#maintenance-div').html(msg.item);
		}else{
		swal({title: "Information",
		allowEscapeKey: false,
        text: "No Room added yet. Please ensure Rooms are added.",
        type: "info",
        closeOnConfirm: false,
        },
        function(){
        window.location = "room";
                  }); 
				  
		}
		
		}
		});
	}
	else{
		$("#show").css("display", "none");
	}
	
	 }
	 function getroominfo() {
		 var base_url = $.cookie("base_url"); 
	 $("#maintenance-div").css("display", "block"); 
	var hotel_id=$("#hotel_id1").val();
	$.ajax({
		url: base_url+"room_maintenance/getmaintenanceRoom",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id},  
		success: function(msg) {
		$('#data-list').html(msg.item);
		}
		});
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
