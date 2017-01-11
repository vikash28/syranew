$(document).ready(function() {
	var base_url = $.cookie("base_url");
	        $("#to_booking_date").datepicker({ dateFormat: 'dd-mm-yy'});
        $("#from_booking_date").datepicker({ dateFormat: 'dd-mm-yy'}).bind("change",function(){
            var minValue = $(this).val();
            minValue = $.datepicker.parseDate("dd-mm-yy", minValue);
            minValue.setDate(minValue.getDate()+1);
            $("#to_booking_date").datepicker( "option", "minDate", minValue );
        })
		 $("#download").click(function() {
				 $( "#csv" ).val(1);
				 $( "#my_from" ).submit();
				 $( "#csv" ).val('');
           });
		    $("#print").click(function() {
				$( "#my_from" ).attr("target","_blank");
				$( "#my_from" ).attr("action",base_url+"reservation_report/print_report");
				$( "#my_from" ).submit();
				$( "#my_from" ).removeAttr("target");
				$( "#my_from" ).attr("action"," ");
           });
		    $("#my_from").validate({
			     rules: {
					"filter[bo][equal][booking_reference]": {
						 number: true
					},
			     },
			     messages: {
			     },
		});
		$("#clear_data").click(function() {
			$("#booking_reference").val("");
			$("#to_booking_date").val("");
			$("#from_booking_date").val("");
			$('#hotel_id option:selected').removeAttr('selected');
			$('#agent_id option:selected').removeAttr('selected');
			//$('#users_id option:selected').removeAttr('selected');
			
			//window.location.reload(true);
		});
});


	
 function changeStatus(bookingid){
        var bookingid = bookingid;
        $("#booking_id").val(bookingid);
        $.ajax({
            //url:"<?php echo site_url('sales_report/changeStatus');?>/"+bookingid,
            url: "sales_report/changeStatus/"+bookingid,
            type: 'POST',
            data: {'bookingid': bookingid},  
            success:function(data)
            { 
                //alert(data) ;
                $('#book').prop('checked', false);
                $('#hold').prop('checked', false); 
                if(data==1){
                    $('#book').prop('checked', true);
                    $('#hold').prop('disabled', true);
                } else if(data==2){
                    $('#hold').prop('checked', true);
                }
            }      
        });
    }

      $('#book').change(function() {
        $('#hold').prop('checked', false);
        $('#hold').prop('disabled', true);
        var bkingID=$("#booking_id").val();
        $.ajax({
            url:"sales_report/updateStatus/"+bkingID,
            type: 'POST',
            dataType: "json",
            data: {'bkingID': bkingID},  
            success:function(data)
            { 
                $('#success_msg').html('<div class="alert alert-success alert-dismissable" style="text-align:center;"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>You have successfully changed the booking status.</div>');

            }      
        });

    });  