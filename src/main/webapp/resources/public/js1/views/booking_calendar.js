$(document).ready(function(){
		//var days_in_month=$('#days_in_month').val();
		$("#mobile_number").mask("9999999999"); // mobile no validation..
		// js for sending an email to hotel guest.....
        //$('.wysihtml5').wysihtml5();
        $('#email_message').summernote({
            // Remove the below height attribute becaue the bill was not loading completely. Enable this height attribute to show a short version of summernote editor
            //height: 300,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            focus: true                 // set focus to editable area after initializing summernote
        });
		// js for sending an email to hotel guest.....


		var count=1;
		$("#total_daily_availibility td").each(function(){
			$(this).text($("td.initcell[day='"+count+"']").length);
			count ++;
		});
		
		$(".room_name").each(function(){
			var room_name=$(this).attr('id');
			var count1=1;
			$("#"+room_name+" td").each(function(){
				$(this).text($("."+room_name+" td.initcell[day='"+count1+"']").length);
				count1 ++;
			});
		});
		/*var count2=1;
			$("#non-ac td").each(function(){
			$(this).text($(".non-ac td.initcell[day='"+count2+"']").length);
			count2 ++;
		});*/
	//alert($("td.initcell[day='22']").length);
	
	$("#hotel_id option:first").text("Select Hotel Name");
	
	$('.info').css('cursor', 'pointer');
	$( ".info" ).draggable({axis: 'x', distance: 50});	

	$("#hotel_id").change(function() {		
	$( "#my_from" ).submit();
	});
	$(document).on('click', '.cell', function() {
		//alert();
		var base_url = $.cookie("base_url");
		var value=$(this).attr('class');
		var booking_id=$(this).attr('data-title');
		
		var strIndex = value.indexOf('maintenance');
		//alert(strIndex);
  			if(strIndex > 1) {			
				swal({
			 title: "Information",
			 text: "This room is under maintenance and cannot be booked. Please remove it from Maintenance first",
			 timer: 3000,
			 showConfirmButton: false,
			 type: "info",
           }); 				
				}
			else if(typeof booking_id != "undefined") {
				$('#customer-info-modal').modal('show');
				//var booking_id=$(this).attr('id');
				$.ajax({
				url: base_url+"booking_calendar/getGuestInfo",
				type: 'POST',
				dataType: "json",
				data: {'booking_id': booking_id},  
		
			success: function(msg) {
			$('#customer-info-modal').html(msg.item);
			//$('#customer-info-modal').modal('hide');
			}
			});
		}
    });
	
	
		$(document).on('click', '.sa-alert', function() {
			 swal("Error !", "Please select a room first", "error");
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
var days = [];
var json_string = "";
$(document).on('click', '.initcell', function() {
			
			var base_url = $.cookie("base_url");
			var room_type=$(this).parent().find('th').attr('id');
			//alert(room_type);
			//alert(room_type);
			var room_number=$(this).attr('room_n');

			$("#room_type").val(room_type);
			$("#room_n").val($(this).attr('room_n'));
			var day=($(this).attr('day'));


			days.push(day);
			//alert(day);
			$("#room_type").val(room_type);
			var room_info=createJsonString(this);
			var currentmonth=$("#currentmonth").val();

			var currentyear=$("#currentyear").val();
			//alert(Math.max.apply(Math,days));
			var end_dates=parseInt(Math.max.apply(Math,days)) + 1;
			//alert(end_dates);

			var end_date=end_dates+'-'+currentmonth+'-'+currentyear;
			var start_date=Math.min.apply(Math,days)+'-'+currentmonth+'-'+currentyear;
			var max_days = end_dates - parseInt(Math.min.apply(Math,days));
			//$("#end_date").val(end_date);
			//$("#start_date").val(start_date);
			//alert(max_days);
			$("#checkoutdate").val(end_date);
			$("#checkindate").val(start_date);
			$("#room_info").val(room_info);
			$("#max_days").val(max_days);
			
			
			$.ajax({
				url: base_url+"booking_calendar/luxury_tax",
				type: 'POST',
				dataType: "json",
				data: {'room_type': room_type},  
		
			success: function(msg) {
			$("#luxury_tax").val(msg.luxury_tax);
			//$("#room_name").val(msg.room_name);
			//$("#occupancy").val(msg.occupancy);
			//$('#customer-info-modal').modal('hide');
			}
			});

	});


function createJsonString(s){

		var currentmonth=$("#currentmonth").val();
		var currentyear=$("#currentyear").val();

		var jason_st= '[';

		$(".room_name").each(function(){
			var room_name=$(this).attr('id');
			var count_new1=1;
			//var total_count=$(this).find(".green-white").length;
			$("."+room_name).each(function(){

				$(this).find(".green-white").each(function(){
					var room_n=$(this).attr("room_n");
					var occupancy=$(this).attr("occupancy");
					//var day=($(this).attr('day'));
					var days_count=$(this).attr('day');
					var days_count_to=parseInt(days_count)+parseInt(1);
					var day=days_count+'-'+currentmonth+'-'+currentyear;
					var day_to=days_count_to+'-'+currentmonth+'-'+currentyear;
					var room_id=$(this).attr('room_id');
					jason_st +='{"room_id":"'+room_id+'","room_number":"'+room_n+'","stay_date":"'+day+'","stay_date_to":"'+day_to+'","occupancy":"'+occupancy+'"},';
				});
				
			});

		});
		jason_st=jason_st.slice(0,-1);
		jason_st += ']';
		return jason_st;
}


	// write a funcion to open a SMS modal...
	$("#send_sms").click(function(){
		$('#send-sms-modal').modal('toggle');
	});

	// write a funcion to send SMS to guest modal...
	$("#sms_submit").click(function(){
		var mobile_number = $("#mobile_number").val();
		var message = $('textarea#message').val();
		var base_url = $.cookie("base_url");
		if(mobile_number != "" && message != ""){
			var dataString = 'mobile_number='+mobile_number+'&message='+message;
			$.ajax({
	 			type:"POST",
	 			data:dataString,
	 			url:base_url+"reservation/send_sms/",
	 			success:function(return_data){
	 				if(return_data == "1"){ // success
       					swal("", "Your SMS has been sent to the guest.", "success");
       					$("#send-sms-modal").modal('toggle');
	 				} else { // error
       					swal("", return_data, "error");
       					return false;
	 				}
	 			}
			});
		} else{
			swal("","Please make sure that mobile number and message fields are not empty.","error");
			return false;
		}
	});

	// write a funcion to get bill data..so that we can show that content in email message...
	$(".email_send").click(function(){
		var base_url = $.cookie("base_url");
		var reservation_booking_id = $(this).attr('id');
		$.ajax({
 			type:"POST",
 			async: false,
	        timeout: 5000, //5 secoond wait..
 			url:base_url+"bill/print_bill_return/"+reservation_booking_id,
 			success:function(return_data){		 				
 				if(return_data != ""){ // success
 					$('#email_message').code(return_data);
 				} else { // error
   					swal("", "Unable to get bill html.", "error");
   					return false;
 				}
 			}
		});
		$("#send-email-modal").modal('toggle');
	});
 
	// write a funcion to send email to guest modal...
	$("#guest_email_send").click(function(){
		var base_url = $.cookie("base_url");
		var booking_reference = $("#booking_reference").val();
		var hotel_name = $("#hotel_name").val();
		var to_email = $("#to_email").val();
		var cc_email = $("#cc_email").val();
		var bcc_email = $("#bcc_email").val();
		var email_message = $('#email_message').code();
		var hotel_guest_name = $("#hotel_guest_name").val();
		if(to_email != "" && email_message != ""){
			var dataString = 'booking_reference='+booking_reference+'&hotel_name='+hotel_name+'&to_email='+to_email+'&cc_email='+cc_email+'&bcc_email='+bcc_email+'&email_message='+email_message+'&hotel_guest_name='+hotel_guest_name;
			$.ajax({
	 			type:"POST",
	 			data:dataString,
	 			url:base_url+"reservation/send_guest_email/",
	 			success:function(return_data){
	 				if(return_data == "OK"){ // success
       					swal("", "Your Email has been sent to the guest.", "success");
       					$("#send-email-modal").modal('toggle');
	 				} else { // error
       					swal("", return_data, "error");
       					return false;
	 				}
	 			}
			});
		} else{
			swal("","Please make sure that to email address and email message fields are not empty.","error");
			return false;
		}
	});

