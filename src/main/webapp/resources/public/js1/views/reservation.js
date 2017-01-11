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


	// defiine a global variable to use the number of total more room addedd...
	var no = 0 ; 
	var no_of_day;
	var tax_amount = 0;
	var discount_amount = 0;
	var total_amount = 0;
	var due_amount = 0;
 	var total_room_tariff = 0;

	$(document).ready(function(){
		
//		$("#message").hide();
		$(".travel").hide();
		$(".corporate").hide();
		$("#discount").hide();
		$("#inclusion").hide();
		$("#show_inclusion").hide();
		$(".bank_name_status").hide();
		$("#mobile").mask("9999999999"); // mobile no validation..
		$("#mobile_number").mask("9999999999"); // mobile no validation..
		$("#phone").mask("9999999999"); // mobile no validation..
		$("#travel_agent_phonenumber1").mask("9999999999"); // mobile no validation..
		$("#travel_agent_phonenumber2").mask("9999999999"); // mobile no validation..
		$("#card_no").mask("9999-9999-9999-9999"); // 
		$("#expiry_date").mask("99/99"); // 

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

	 	var base_url = $.cookie("base_url");
	 	var account_id = $.cookie("account_id"); // global decalration so dat we can use it any where..
//		by default we will hide payment type and date...if a guest is paying some amount in advance then only payment type and date will be visible...so on key up in advance filed we will mark it visible...
		$(".advance_payment").hide();		

// write a validation code which will restrict not to add a space bar at first character..

		$(document).on('keydown', '.required', function(e){ 
            if (e.which === 32 &&  e.target.selectionStart === 0){
            	swal({   
            		title: "", 
            		type: "error",
            		text: "First character cannot be blank!",   
            		timer: 1000,   
            		showConfirmButton: false 
            	});            	
           		return false;             
            } 
        });
    
// write a validation which will accept only numbers, backspace and delete in fileds values. But 0 shouldn't be allowed at 1st place.
		
		$(document).on('keypress', '.only_digit', function(e){ 
			
		   	if (this.value.length == 0 && e.which == '48' )
			  	return false;
			else if ((e.which < 48 || e.which > 57) && (e.which != 0 && e.which != 8))
           		e.preventDefault();    
        });


// write a validation which will accept only numbers, backspace, delete and decimal in fileds values. But 0 shouldn't be allowed at 1st place.
		
		$(document).on('keypress', '.only_digit_decimal', function(e){ 
		   	if (this.value.length == 0 && e.which == '48' ){
			  	return false;
		   	} else if (e.which == 8 || e.which == 127 || e.which == 9 ) { // allow backspace and delete
				return true;		   
		   	} else if ((e.which < 48 || e.which > 57 ) && (e.which != 46 || $(this).val().indexOf('.') != -1)  ){
				return false;		   
		   	}
        });

// write a validation which will check if an advance filed have some values more than 0 then it will display payment type and payment date...otherwise it will keep hiding these fileds...
		
		$(document).on('keyup', '#advance', function(e){ 
		   	if (this.value.length > 0 && this.value > 0 ){
			  	$(".advance_payment").show();
		   	} else {
				$(".advance_payment").hide();		   
		   	}
        });

// write a validation which will accept only characters in fileds values. 

		$(".only_character").keypress(function (e){
	        var code =e.keyCode || e.which;
	        
		   	if (code == 8 || code == 9 )  //allow backspace and tab key
				return true;		   
	        if((code < 65 || code > 90) && (code < 97 || code > 122) && code != 32 && code != 46){
	          	swal("", "Only alphabates are allowed.", "error");
	          	return false;
	        }
	    });		

		// on the basis of discount type selection we need to display discount amount ..
		// by default discount amount will be hidden..		
		$('input[type=radio][name=discount_type]').change(function () {			
			var discount_type = $(this).val();
			if(discount_type != "" ){
				$("#discount").show();
				if(discount_type == "percentage" ){
					$("#discount_amount").attr("maxlength",2);
					$("#discount_amount").val('');
				}
				if(discount_type == "cash" ){
					$("#discount_amount").attr("maxlength",6);
					$("#discount_amount").val('');
				}
				calculate_total_room_tarrif(1);// calculate total room price after change of price.. 
			}

        });
		
		$(".existing_customer").click(function(){
			//alert("clk on close btn");			
			$('#ext_customer').prop('checked', false);
			$("#guest_name").val('');
			$("#address").val('');
			$("#phone").val('');
			$("#email").val('');
		});

		$(".back_calculation_btn").click(function(){
			$('#back_calculation').prop('checked', false);
		});

		// check in and check out date picker...
		
		$("#checkout_date").datepicker({ dateFormat: 'dd-mm-yy', minDate: 0}).bind("change",function(){
            var maxDate = $(this).val();
            maxDate = $.datepicker.parseDate("dd-mm-yy", maxDate);
            maxDate.setDate(maxDate.getDate());
            $("#payment_date").datepicker( "option", "maxDate", maxDate );
            var stayDate = $(this).val();
            $(".stay_date_to").val(stayDate);
            var inclusion = $(this).val();
            inclusion = $.datepicker.parseDate("dd-mm-yy", inclusion);
            inclusion.setDate(inclusion.getDate()-1);            
            $("#inclusion_date").datepicker( "option", "maxDate", inclusion );

            calculate_total_room_tarrif(1);// calculate total room price after change of price..
         });

        $("#checkin_date").datepicker({ dateFormat: 'dd-mm-yy', minDate: 0}).bind("change",function(){
            var minDate = $(this).val();
            minDate = $.datepicker.parseDate("dd-mm-yy", minDate);
            minDate.setDate(minDate.getDate()+1);
            $("#checkout_date").datepicker( "option", "minDate", minDate );
            var stayDate = $(this).val();
            $(".stay_date_from").val(stayDate);
            $("#payment_date").datepicker( "option", "minDate", stayDate );
            $("#inclusion_date").datepicker( "option", "minDate", stayDate );
            // stayDate = $.datepicker.parseDate("dd-mm-yy", stayDate);
            // stayDate.setDate(stayDate.getDate());
            // $(".stay_date_from").datepicker( "option", "minDate", stayDate );
            
            calculate_total_room_tarrif(1);// calculate total room price after change of price..
        });	
        $('#check_in_time').datetimepicker({
        	timeOnly: true,
        	controlType: 'select',
        	oneLine: true,
        	timeFormat: 'hh:mm tt'
        });			
        $('#check_out_time').datetimepicker({
        	timeOnly: true,
        	controlType: 'select',
        	oneLine: true,
        	timeFormat: 'hh:mm tt'
        });			

		$("#payment_date").datepicker({ dateFormat: 'dd-mm-yy', minDate: 0 });

		$(document).on('focus', '.inclusion_date', function(){
           	var minDate = $('input:text[name=checkin_date]').val();
           	var maxDate = $('input:text[name=checkout_date]').val();
           	if(minDate != "" && maxDate != "") {
				$(this).datepicker({ dateFormat: 'dd-mm-yy', minDate: minDate, maxDate: maxDate});     
           	} else {
           		swal("", "Please enter check in and check out date first.", "error");
           		return false;
           	}

        });

		$(document).on('focus', '.stay_date_from', function(){
           	var minDate = $("#checkin_date").val();
           	var maxDate = $("#checkout_date").val();
           	if(minDate != "" && maxDate != "") {
				$(this).datepicker({ dateFormat: 'dd-mm-yy', minDate: minDate, maxDate: maxDate, controlType: 'select',oneLine: true}).bind("change",function(){
		            calculate_total_room_tarrif(1);// calculate total room price after change of price..
	          	});     
           	} else {
           		swal("", "Please enter check in and check out date first.", "error");
           		return false;
           	}

        });

		$(document).on('focus', '.stay_date_to', function(){ 
			var id = $(this).attr("id");
			no = id.substring(13);
           	var minDate = $("#stay_date_from_"+no).val();
           	var maxDate = $("#checkout_date").val();
           	if(minDate != "" && maxDate != "") {
				$(this).datepicker({ dateFormat: 'dd-mm-yy', minDate: minDate, maxDate: maxDate, controlType: 'select',	oneLine: true}).bind("change",function(){
		            calculate_total_room_tarrif(1);// calculate total room price after change of price..			
				});        	
           	} else {
           		swal("", "Please enter check in and check out date first.", "error");		
           		return false;
           	}
        });
		// dynamically create and delete for select room for check in...
		
        var no_of_checkin_room = 1;
		
		$(document).on('click', '.add_more_room', function(){ 
        	var no_of_room = $("#no_of_room").val();
        	var stay_date_from = $("#checkin_date").val();
        	var stay_date_to = $("#checkout_date").val();
        	
        	// before adding more room option we ned to make sure that stay date from and to is filled up.....

        	if($("#stay_date_from_"+no_of_room).val() != "" && $("#stay_date_to_"+no_of_room).val() != "" && $("#hotel_id").val() != "" ){
				no_of_room++;	
	        	
	        	$("#add_room").append('<div class="row select_room" id="'+no_of_room+'" style="background: #f4f4f4;padding-top: 20px;padding-bottom: 35px;border-radius: 5px;margin-top: 5px;padding:2%;"><input type="hidden" value="" id="room_no_'+no_of_room+'" name="room_no[]" ><div class="col-md-12"><div class="col-md-1" style="margin-right:2%;"><div class="form-group"><label for="">Room Type * </label><select class="form-control room_id" id="room_id_'+no_of_room+'" data-toggle="modal" data-target="#" name="room_id[]" required ></select></div></div><div class="col-md-1" style="margin-right:2%;width:12%;"><div class="form-group"><label for="">Number of Rooms * </label><input type="text" class="form-control" id="no_of_rooms_'+no_of_room+'" name="no_of_rooms[]" readonly required="" placeholder=""></div></div><div class="col-md-1" style="margin-right:2%;width:13%;"><div class="form-group"><label for="">Occupancy * </label><br><div class="radio radio-success radio-inline"><input type="radio" id="single_'+no_of_room+'" value="single" name="occupancy['+no_of_room+'][]" checked="checked" onclick="occupancy('+no_of_room+');"><label for="inlineRadio3">Single</label></div><div class="radio radio-success radio-inline"><input type="radio" id="double_'+no_of_room+'" value="double" name="occupancy['+no_of_room+'][]" onclick="occupancy('+no_of_room+');"><label for="inlineRadio4">Double</label></div></div></div><div class="col-md-1" style="margin-right:2%;"> <div class="form-group"> <label for="">Room Rate *</label> <input type="text" class="form-control only_digit_decimal calculate_room_tarrif" id="room_rate_'+no_of_room+'" name="room_rate[]" readonly required="" placeholder="" > </div> </div><div class="col-md-1" style="margin-right:2%;"><div class="form-group"><label for="">Net Rate *</label><input type="text" class="form-control only_digit calculate_room_tarrif" id="net_rate_'+no_of_room+'" name="net_rate[]" placeholder="" maxlength="6"></div></div><div class="col-md-1" style="margin-right:2%;"><div class="form-group"><label for="">Extra Bed </label><input type="text" class="form-control only_digit calculate_room_tarrif" id="extra_bed_'+no_of_room+'" name="extra_bed[]" placeholder="" maxlength="6"></div></div><div class="col-md-1" style="margin-right:2%;width:10%;"><div class="form-group"><label for="">Extra Bed Price</label><input type="text" class="form-control only_digit calculate_room_tarrif" id="extra_bed_price_'+no_of_room+'" name="extra_bed_price[]" placeholder="" maxlength="6"></div></div><div class="col-md-1" style="margin-right:2%;width:10%;"><div class="form-group"><label for="">Extra Person</label><input type="text" class="form-control only_digit calculate_room_tarrif" id="extra_person_'+no_of_room+'" name="extra_person[]" placeholder="" maxlength="6"></div></div><div class="col-md-1" style="margin-right:2%;width:12%;"><div class="form-group"><label for="">Extra Person Charge</label><input type="text" class="form-control only_digit calculate_room_tarrif" id="extra_person_charge_'+no_of_room+'" name="extra_person_charge[]" placeholder="" maxlength="6"></div></div><div class="col-md-1" style="margin-right:2%;"><div class="form-group"><label for="">Luxury Tax %</label><input type="text" class="form-control only_digit calculate_room_tarrif" id="luxury_tax_'+no_of_room+'" name="luxury_tax[]" placeholder="" maxlength="2"></div></div><div class="col-md-1" style="margin-right:2%;width:11%;"><div class="form-group"><label for="">Stay Date From *</label><input type="text" name="stay_date_from[]" id="stay_date_from_'+no_of_room+'" value="'+stay_date_from+'" readonly="readonly" placeholder="Stay Date" class="form-control stay_date_from" ></div></div><div class="col-md-1" style="margin-right:2%;"><div class="form-group"><label for="">Stay Date To *</label><input type="text" name="stay_date_to[]" id="stay_date_to_'+no_of_room+'" value="'+stay_date_to+'" readonly="readonly" placeholder="Stay Date" class="form-control stay_date_to" ></div></div><div class="col-md-3" style="float:right;background: #E1EEF2;padding: 5px;text-align: center;border-radius: 5px;"><div class="form-group"><label for="inputEmail3" ><b>Selected Room Number</b></label><div id="display_room_no_'+no_of_room+'"></div></div></div></div></div>');

	        	

	        	var opt = $('#room_id_1').html();
	 			$('#room_id_'+no_of_room).html(opt);
				$("#no_of_room").val(no_of_room);
        	} else {
           		swal("", "Please enter all mandatory fields values and fill it first.", "error");           		
           		return false;        		
        	}
 		});

		$(document).on('click', '.remove_room', function(){ 
        	var no_of_room = $("#no_of_room").val();
        	// now we need to check a condition that a user can't delete any div element from middle...so it must be from last div only...
        	if(no_of_room > 1){
	        	$("#"+no_of_room).remove();	
				--no_of_room;
				$("#no_of_room").val(no_of_room);
				calculate_total_room_tarrif(1);// calculate total room price after change of price..        		
        	} else{
        		// it means its deleting the first record....so we need to stop them to delete it from midle..
        		swal("", "You can't remove the first record.", "error");		
           		return false; 
        	}
        });
		
		$(document).on('click', '.add_inclusion', function(){ 
        	var no_of_inclusion = $("#no_of_inclusion").val();
        	
        	if($("#room_number_"+no_of_inclusion).val() != "" && $("#inclusion_date_"+no_of_inclusion).val() != "" && $("#other_item_"+no_of_inclusion).val() != "" && $("#unit_price_"+no_of_inclusion).val() != "" && $("#quantity_"+no_of_inclusion).val() != ""  && $("#days_"+no_of_inclusion).val() != ""  && $("#total_"+no_of_inclusion).val() != "" ){
				no_of_inclusion++;	

				$("#add_new_inclusion").append('<div class="inclusion_row" id="'+no_of_inclusion+'"> <div class="col-md-1" style="margin-right:2%;"> <div class="form-group"> <label>Room Number</label> <select class="form-control inclusion_room_number" name="room_number[]" id="room_number_'+no_of_inclusion+'" ></select> </div> </div> <div class="col-md-2" style="margin-right:2%;"> <div class="form-group"> <label>Date</label> <input type="text" class="form-control inclusion_date" id="inclusion_date_'+no_of_inclusion+'" name="inclusion_date[]" placeholder="Date"> </div> </div><div class="col-md-2" style="margin-right:2%;"> <div class="form-group"> <label>Item Name</label> <select class="form-control other_item" name="other_item[]" id="other_item_'+no_of_inclusion+'" ></select> </div> </div> <div class="col-md-1" style="margin-right:2%;"> <div class="form-group"> <label>Unit Price</label> <input type="text" class="form-control only_digit calculate_inclusion" name="unit_price[]" id="unit_price_'+no_of_inclusion+'" placeholder="" > </div> </div> <div class="col-md-1" style="margin-right:2%;"> <div class="form-group"> <label>Quantity</label> <input type="text" class="form-control only_digit calculate_inclusion" name="quantity[]" id="quantity_'+no_of_inclusion+'" placeholder="" maxlength="5"> </div> </div> <div class="col-md-1" style="margin-right:2%;"> <div class="form-group"> <label>Days</label> <input type="text" class="form-control only_digit calculate_day" name="days[]" id="days_'+no_of_inclusion+'" placeholder="" maxlength="5"> </div> </div> <div class="col-md-1" style="margin-right:2%;"> <div class="form-group"> <label>Total</label> <input type="text" class="form-control only_digit_decimal" name="total[]" id="total_'+no_of_inclusion+'" placeholder="" readonly=""></div></div></div>');

	        	var room_number_option = $('#room_number_1').html();
	 			$('#room_number_'+no_of_inclusion).html(room_number_option);
	        	var other_item_option = $('#other_item_1').html();
	 			$('#other_item_'+no_of_inclusion).html(other_item_option);

				$("#no_of_inclusion").val(no_of_inclusion);
        	} else {
           		swal("", "Please enter all mandatory fields values and fill it first.", "error");
           		return false;        		
        	}
 		});

		$(document).on('click', '.remove_inclusion', function(){ 
        	var no_of_inclusion = $("#no_of_inclusion").val();
        	// now we need to check a condition that a user can't delete any div element from middle...so it must be from last div only...
        	if(no_of_inclusion > 1){
	        	$("#"+no_of_inclusion).remove();	
				--no_of_inclusion;
				$("#no_of_inclusion").val(no_of_room);
        	} else{
        		// it means its deleting the first record....so we need to stop them to delete it from midle..
        		swal("", "You can't remove the first record.", "error");		
           		return false; 
        	}
        });
		
		// write a code to get the guest details on the basis of mobile no or boooking id and fiil up that values in respected fileds..
		
		$("#fill_guest_details").click(function(){
			var mobile_no = $("#mobile").val();
			
			if(mobile_no == "" ){
           		swal("", "Please enter mobile no.", "error");
				return false;
			} else {
			// it means both or either one field is filed up..
			// so on the basis of filled filed's value we need to decide whether we are going to fetch the value by using mobile no or by booking id..
			// if both fileds are fillled up then it must be valid mobile no and booking id..
			// now we need to test whether both fileds are filled up or not 
				// it means mobile fileds have values...
				var dataString = 'mobile_no='+mobile_no;
				$.ajax({
		 			type:"POST",
		 			data:dataString,
		 			url:base_url+"reservation/get_guest_detail_mobile/",
		 			success:function(return_data){
		 				if(return_data == "0"){
           					swal("", "This Mobile number is not associated with any Guest who has previously checked in to your hotel. Please check again.", "error");		 					
		 					$("#mobile").val('');
		 					$("#mobile").focus();
		 					return false;
		 				} else {
			 				var return_data = $.parseJSON(return_data);
							$('#guest_name').val(return_data[0]);
							$('#phone').val(return_data[1]);
							$('#address').val(return_data[2]);
							$('#email').val(return_data[3]);
							$('#guest_id').val(return_data[4]);
							$("#existing-customer-modal").modal('toggle');		 					
		 				}
		 			}
				});
			}
		});

		// By default meal plan of hotel will be hidden..
		// it will be enabled or shown after selecting a hotel from drop down list....
		// meal plan will be displayed on the basis of hotel and avialibility of meal plan for that hotel..
		//$("#meal_plan_type").hide();

		$('#hotel_id').change(function() {
			//alert("change on select..")
			if($('#hotel_id').val() != ""){
				/// on the basis of hotel id we need to get its meal plan type and room type for that hotel...
				var hotel_id = $('#hotel_id').val();
				
				$.ajax({
		 			type:"POST",
		 			data:hotel_id,
		 			url:base_url+"reservation/get_meal_plan/"+hotel_id,
		 			success:function(return_data){		 				
		 				if(return_data != ""){
		 					// it means meal plan is added for the hotel....
							$("#meal_plan_type").show();
							$('#meal_plan').html('');
							$('#meal_plan').html(return_data);
		 				} else {
		 					// it means hotel meal plan is not added...
				            swal({
				                title: "Please add a meal plan for hotel",
				                text: "You will be redirected to different page to add a meal plan for this hotel.",
				                type: "warning",
				                showCancelButton: false,
				                confirmButtonColor: "#DD6B55",
				                confirmButtonText: "Yes, move to add meal plan page",
				                closeOnConfirm: false
				            }, function (isConfirm) {
				                if (!isConfirm) return;
				                $(location).attr("href", base_url+"hotel");
				            });
		 				}
		 			}
				});

				$.ajax({
		 			type:"POST",
		 			data:hotel_id,
		 			url:base_url+"reservation/get_hotel_room_type/"+hotel_id,
		 			success:function(return_data){						
		 				if(return_data != ""){
		 					// it means meal plan is added for the hotel....
							$('#room_type').html('');
							$('#room_type').html(return_data);
		 				} else {
		 					// it means hotel meal plan is not added...
				            swal({
				                title: "Please add a room type for hotel",
				                text: "You will be redirected to different page to add a room for this hotel.",
				                type: "error",
				                showCancelButton: false,
				                confirmButtonColor: "#DD6B55",
				                confirmButtonText: "Yes, move to add room for this hotel",
				                closeOnConfirm: false,
				                allowEscapeKey: false
				            }, function (isConfirm) {
				                if (!isConfirm) return;
				                $(location).attr("href", base_url+"room");
				            });
		 				}
		 			}
				});

				$.ajax({
		 			type:"POST",
		 			data:hotel_id,
		 			url:base_url+"reservation/get_hotel_info/"+hotel_id,
		 			success:function(return_data){
						var return_data = $.parseJSON(return_data);					
						$('#service_tax').val(return_data[0]);
						$('#service_charge').val(return_data[1]);
						$('#swachh_bharat_cess').val(return_data[2]);
						$('#krishi_kalyan_cess').val(return_data[3]);
		 			}
				});
				// call an ajax to get hotel check in and check out time....
				$.ajax({
		 			type:"POST",
		 			url:base_url+"reservation/get_hotel_checkin_time/"+hotel_id,
		 			success:function(return_data){
		 				var return_data = $.parseJSON(return_data);	
						$('#check_in_time').val(return_data[0]);
						$('#check_out_time').val(return_data[1]);
		 			}
				});
				// call an ajax to know whether selected hotel has added any inclusion or not..if inclusion is added by hotel then only add inclusion check box will be visible......
				$.ajax({
		 			type:"POST",
		 			url:base_url+"reservation/count_inclusion/",
		 			data:'hotel_id='+hotel_id,
		 			success:function(return_data){
		 				var return_data = $.parseJSON(return_data);
		 				if(return_data[0] != 0){
		 					// it means other items is added for selected hotel..so we need to display add inclusion check box...and add other item in drop down list..
		 					$("#show_inclusion").show();
		 					$(".other_item").html(return_data[1]);
		 					// if(return_data[0] == 1)// it means only one item for this hotel so we will hide + - symbol from inclusion
		 					// 	$("#add_remove_inclusion").hide();
		 					// else if(return_data[0] > 1)// it means more than one item for this hotel so we will show + - symbol from inclusion
		 					// 	$("#add_remove_inclusion").show();
		 				}else{
		 					// it means other items is not added for selected hotel..so we need to hide add inclusion check box...
		 					$("#show_inclusion").hide();
		 					$("#other_item").html('');
		 				}
		 			}
				});
			} 		    
		});

	 	// call the modal to display the no of available room for selected hotel, plan etc..				
		$(document).on('change', '.room_id', function(){
			// get id attribute values on the basis of class name click..
			var select_id = $(this).attr('id');
			var room_no = [];
			// we need to get the no of row for check in room...it will be id values like 1,2 etc....
			// it will be in form of room_id_1.....
			no = select_id.substring(8);
			if($('#'+select_id).val() != ""){
				var room_id = $('#'+select_id).val();
				var travel_agent_id = "";
				var corporate_agent_id = "";

				// on the basis of room id selection we need to fetch total no of bed and on the basis of that bed we will decide wedr its single or double occupancy...
				var dataString = 'room_id='+room_id;

				$.ajax({
		 			type:"POST",
		 			async: false,
			        timeout: 5000, //5 secoond wait..
		 			data:dataString,
		 			url:base_url+"reservation/get_room_type_occupancy/",
		 			success:function(return_data){
						//  now we need to check whats the total no of bed ....
						if(return_data == 1 && return_data > 0){// it means its a single occupancy room ..
							$("#single_"+no).prop('checked',true);
						}else if(return_data > 1) {	
							// it means its a double occupancy room ..
							$("#double_"+no).prop('checked',true);
						}
		 			}
				});

				// now we need to write a condition where we will chck whether we have entered checked in date or not..
				// if checked in date and meal plan is not entered then we will alert an error message..
				var checkin_date = $('#checkin_date').val();
				var checkout_date = $('#checkout_date').val();
				var plan_type_id = $('#plan_type_id').val();
				var hotel_id = $('#hotel_id').val();
				var occupancy = $('input[name=occupancy\\['+no+'\\]\\[\\]]:checked').val();
				// we need to check a condition where we will check whether any agent is selected or not...if agent is selected....then whcich either travel or corporate...
				if($("#travel").is(":checked")){
					var travel_agent_id = $('#travel_agent_id').val();
				}
				if($("#corporate").is(":checked")){
					var corporate_agent_id = $('#corporate_agent_id').val();
				}				
				
				$('input[name^="room_no"]').each(function() {
					if($(this).val() != "")
				    	room_no.push($(this).val());
				});				
				
				if(checkin_date != "" && plan_type_id != "" && checkout_date != "" ){
					var dataString = 'room_id='+room_id+'&checkin_date='+checkin_date+'&checkout_date='+checkout_date+'&account_id='+account_id+'&room_no='+room_no+'&hotel_id='+hotel_id;
					$.ajax({
			 			type:"POST",
			 			data:dataString,
			 			url:base_url+"reservation/get_hotel_room/",
			 			success:function(return_data){
							//  now we need to check whether we have any vacant room or not....
							if(return_data == ""){// it means there is no any room vacant....so we will just display a message..
								$('#room-number-selection-modal').modal('hide');
								// remove all previous values if anything is there...
								$("#room_rate_"+no).val('');
								$("#net_rate_"+no).val('');
								$("#extra_bed_price_"+no).val('');
								$("#extra_person_charge_"+no).val('');
								$("#luxury_tax_"+no).val('');
								$("#luxury_tax_amount").val('');

								swal("", "Please select any other room type and date. All rooms are booked under this type and date.", "error");
								$("#room_id_"+no+" > option").removeAttr("selected");
								return false;
							}else {								
								// now we have inserted the record in table....
								// now we need to make sure that newly inserted records must be automatically selected in the drop down list..
								$("#room_number").html('');
								$("#room_number").html(return_data);												
								// get rooom price on the basis of meal plan and room type and occupancy...					

								var dataString = 'room_id='+room_id+'&plan_type_id='+plan_type_id+'&occupancy='+occupancy+'&travel_agent_id='+travel_agent_id+'&corporate_agent_id='+corporate_agent_id+'&no='+no+'&checkin_date='+checkin_date+'&checkout_date='+checkout_date;
								$.ajax({
						 			type:"POST",
						 			data:dataString,
						 			url:base_url+"reservation/get_room_plan_price/",
						 			success:function(return_data){
						 				var return_data = $.parseJSON(return_data);
						 				//alert(return_data);
										// now we have inserted the record in table....
										// now we need to make sure that newly inserted records must be automatically selected in the drop down list..
										$("#room_rate_"+no).val('');
										$("#room_rate_"+no).val(return_data[0]);												
										$("#net_rate_"+no).val('');
										$("#net_rate_"+no).val(return_data[4]);												
										$("#extra_bed_price_"+no).val('');
										$("#extra_bed_price_"+no).val(return_data[1]);												
										$("#extra_person_charge_"+no).val('');
										$("#extra_person_charge_"+no).val(return_data[2]);	
										$("#luxury_tax_"+no).val('');
										$("#luxury_tax_"+no).val(return_data[3]);												
										$("#luxury_tax_amount").val('');
										$("#luxury_tax_amount").val(return_data[3]);	
						 			}
								});
							 	$('#room-number-selection-modal').modal();
							 	calculate_total_room_tarrif(no);
							}
			 			}
					});

					// get the no of days different from check in date and check out date...
					var dataString = 'checkin_date='+checkin_date+'&checkout_date='+checkout_date;
					$.ajax({
			 			type:"POST",
			 			data:dataString,
			 			async: false,
			 			timeout: 5000, // wait 5 second
			 			url:base_url+"reservation/get_date_diff/",
			 			success:function(return_data){
			 				no_of_day = return_data;
			 				$("#max_days").val(no_of_day); // it will used to validate at the time of inclusion....if any..
			 			}
					});

				} else {
					$("#room_id_"+no+" > option").removeAttr("selected");
					swal("","Please enter your check in & check out date and select meal plan type.","error")					
					return false;
				}
			}
		    
		});

		// write a code which will fetch other item price on the basis of item selected from drop down list....

		$(document).on('change', '.other_item', function(){
			// get id attribute values on the basis of class name click..
			var select_id = $(this).attr('id');
			// we need to get the no of row for check in room...it will be id values like 1,2 etc....
			// it will be in form of other_item_1.....
			no = select_id.substring(11);
			if($('#'+select_id).val() != ""){
				var item_id = $('#'+select_id).val();

				// on the basis of item id selection we need to fetch its unit price ...
				var dataString = 'item_id='+item_id;
				$.ajax({
		 			type:"POST",
		 			data:dataString,
		 			url:base_url+"reservation/get_other_item_unit_price/",
		 			success:function(return_data){
						$("#unit_price_"+no).val(return_data);
		 			}
				});
				calculate_total_inclusion();// calculate total inclusion price ...
			}		    
		});


		// on the basis of agent selection we need to display agent ..
		// by default both agent type will be hidden..
		// if travel agent is selected then automatically corporate will be unchecked if checked..and vice versa..
		$('#travel').change(function() {
        	if($(this).is(":checked")) {
           		$('#corporate').attr('checked',false);
				$(".corporate").hide();
				$(".travel").show();
	        }else
	        	$(".travel").hide();
	    });
		$('#corporate').change(function() {
        	if($(this).is(":checked")) {
           		$('#travel').attr('checked',false);
				$(".travel").hide();
				$(".corporate").show();
	        }else
	        	$(".corporate").hide();
	    });

		// if a hotel has added other item..then add inclusion check box will be visible..once add inclusion check box is checked then inclusion form will be visible..
		// by default inclusion will be hidden at the time of reservation..
		$('#add_inclusion').change(function() {
        	if($(this).is(":checked")) {
				$("#inclusion").show();
	        }else
	        	$("#inclusion").hide();
	    });
		
		// on the basis of agent selection we need to display agent ..
		// by default travel agent will be selected..
		// corporate agent will be displayed if its selected..
		$('input[type=radio][name=plan_type_id]').change(function () {			
			var plan_type_id = $(this).val();
			if(plan_type_id != "" ){
				calculate_total_room_tarrif(no);
			}
        });

		// we need to write a jquery code to add and remove a css class by using toggle class..
		// this will be used to select and deselect a room number..
		$(document).on('click', '.room_number_bg', function(){
			// get unique room id or get the id for clicked fileds..
			var room_number = $(this).attr('id');
  			$("#"+room_number).toggleClass("btn-inverse");
		});

		// write a function which will calculate the total number of room selected on the basis on inverse class..		

		$("#select_room").click(function(){
			var total_selected_room = 0;
			var room_id = [];
			$('.btn-inverse').each(function() { 
			  	var id = $(this).attr('id');
			  	if(id != undefined) {
			    	room_id.push(id);
			    	total_selected_room++;
			  	}
			});

			// now we need to insert total selected room values to the respective text box..
			$("#no_of_rooms_"+no).val(total_selected_room);
			$("#room-number-selection-modal").modal('toggle');
			$("#room_no_"+no).val(room_id);
			$("#display_room_no_"+no).text(room_id);

		 	// now we need to calculate the total room tarrif cost...
		 	// it will be based on net rate * total no of selected rooms * no of day/night stayed in hotel +
		 	// extra bed * extra bed price * no of day/night stayed in hotel +
		 	// extra person * extra person charge * no of day/night stayed in hotel	

		 	calculate_total_room_tarrif(no);

		});

		// for payment type we need by default hide all bank related html..
		// we will shoow and hide accordingly on the basis of payment type selected from drop down..

		$("#cheque_details_central_reservation").hide();
		$("#dd_details_central_reservation").hide();
		$("#chq_details_central_reservation").hide();	
		$("#cc_details_central_reservation").hide();
		$("#neft_details_central_reservation").hide();
		$(".bank_name_status").hide();

		$('#payment_type').change(function() {
			//alert("change on select..")
			if($('#payment_type').val() != ""){
				/// on the basis of hotel id we need to get its meal plan type and room type for that hotel...
				var payment_type = $('#payment_type').val();

				if(payment_type == "cash" || payment_type == "payment_by_cash" ){
					$("#cheque_details_central_reservation").hide();					
					$("#dd_details_central_reservation").hide();
					$("#chq_details_central_reservation").hide();
					$("#cc_details_central_reservation").hide();
					$("#neft_details_central_reservation").hide();	
					$(".bank_name_status").hide();						
				}
				
				if(payment_type == "cheque" || payment_type == "demand_draft" || payment_type == "credit_card" || payment_type == "debit_card" || payment_type == "neft" || payment_type == "rtgs"){
					//$("#bank_details_central_reservation").show();
					if(payment_type == "cheque" ){
						$("#cheque_details_central_reservation").show();
						$("#chq_details_central_reservation").show();
						$(".bank_name_status").show();
						$("#dd_details_central_reservation").hide();
						$("#cc_details_central_reservation").hide();
						$("#neft_details_central_reservation").hide();		
					}
					if(payment_type == "demand_draft" ){
						$("#cheque_details_central_reservation").show();
						$("#dd_details_central_reservation").show();
						$(".bank_name_status").show();
						$("#chq_details_central_reservation").hide();
						$("#cc_details_central_reservation").hide();
						$("#neft_details_central_reservation").hide();		
					}
					if(payment_type == "credit_card" || payment_type == "debit_card" ){
						$("#cheque_details_central_reservation").hide();
						$("#dd_details_central_reservation").hide();
						$("#chq_details_central_reservation").hide();
						$("#cc_details_central_reservation").show();
						$("#neft_details_central_reservation").hide();		
					}
					if(payment_type == "neft" || payment_type == "rtgs" ){
						$("#cheque_details_central_reservation").hide();
						$("#dd_details_central_reservation").hide();
						$("#chq_details_central_reservation").hide();
						$("#cc_details_central_reservation").hide();
						$("#neft_details_central_reservation").show();
						$(".bank_name_status").show();		
					}
				}										
			} else {
			
				$("#cheque_details_central_reservation").hide();					
				$("#dd_details_central_reservation").hide();
				$("#chq_details_central_reservation").hide();
				$("#cc_details_central_reservation").hide();
				$("#neft_details_central_reservation").hide();
				$(".bank_name_status").hide();		
			}
		    
		});			
		
	});

	// when check on back calculation checkbox and if check box is checked then open a model...

	$('#back_calculation').change(function() {

    	if($(this).is(":checked")) {
    		$(".discount_type").hide();
			$('#back_calculation_modal').modal('toggle');
        }else{
        	$(".discount_type").show();
        	calculate_total_room_tarrif(1);// calculate total room price after change of price..	
        }

    });

	// we need to write a jquery code which will calculate the inclusion price on the basiss of item unit price, quantity and days....

	$(document).on('keyup', '.calculate_inclusion', function(){

		calculate_total_inclusion();// calculate total room price after change of price..

	});

	// we need to write a jquery code which will calculate the total stay days and no of total inclusion days..inclusion days must be <= total stay days.......

	$(document).on('keyup', '.calculate_day', function(){
		var max_days = $("#max_days").val();
		var day = $(this).val();
		if(day > max_days){
			// it means day is wrong....we need to show an error message..
			swal("","Days can not be more than "+max_days+" days.","error");		 		
			$(this).val('');
			$(this).focus();
			return false;
		}else{
			calculate_total_inclusion();// calculate total room price after change of price..
		}
	});

	// we need to write a jquery code to add and remove a css class by using toggle class..
	// this will be used to select and deselect a room number..
	$(document).on('keyup', '.calculate_room_tarrif', function(){

		calculate_total_room_tarrif(no);// calculate total room price after change of price..

	});

	// write a code to calculate the total amount oon the basis of discount, service tax, charge , misc charges, advance etc...
	$(document).on('keyup', '.calculate_total_amount', function(){
		
		calculate_total_room_tarrif(1);// calculate total room price after change of price..
	});

	// we will define a global function which will be used to calculate the date differences...
	// this calculation will be done on the basis of no of day, net rate, extra bed price etc....

	function calculate_total_room_tarrif(no){

	 	// now we need to calculate the total room tarrif cost...
	 	// it will be based on net rate * total no of selected rooms * no of day/night stayed in hotel +
	 	// extra bed * extra bed price * no of day/night stayed in hotel +
	 	// extra person * extra person charge * no of day/night stayed in hotel	
		var checkin_date = $('#checkin_date').val();
		var checkout_date = $('#checkout_date').val();
		var stay_date_from = $('#stay_date_from_'+no).val();
		var stay_date_to = $('#stay_date_to_'+no).val();
	 	var net_rate = $("#net_rate_"+no).val();
	 	var extra_bed = $("#extra_bed_"+no).val();
	 	var extra_bed_price = $("#extra_bed_price_"+no).val();
	 	var extra_person = $("#extra_person_"+no).val();
	 	var extra_person_charge = $("#extra_person_charge_"+no).val();
	 	var luxury_tax = $("#luxury_tax_"+no).val();
	 	var no_of_rooms = $("#no_of_rooms_"+no).val();
	 	var luxury_tax_amount = $("#luxury_tax_amount").val();
	 	var service_tax = $("#service_tax").val();
	 	var service_charge = $("#service_charge").val();
	 	var swachh_bharat_cess = $("#swachh_bharat_cess").val();
	 	var krishi_kalyan_cess = $("#krishi_kalyan_cess").val();
	 	var discount_amount = $("#discount_amount").val();
	 	var discount_type = $('input[type=radio][name=discount_type]:checked').val();
	 	var misc_charge = $("#misc_charge").val();
	 	var advance = $("#advance").val();
	 	var no_of_room = $("#no_of_room").val();
	 	var total_room_tariff = 0;
	 	var luxury_tax_amount = 0;

	 	var base_url = $.cookie("base_url");
//alert("ctrt called..");	
		// we need to check a condition whether back calculation is checked or not...if back calculation is checked then we will send to different function to calculate the total price...else it will move forward in this function only.....

		if($("#back_calculation").is(":checked")){ // it means back calculation is selected....
			calculate_total_back_calculation_amount();
		} else {
			// it means back calculation is not selected...

			if(checkin_date != "" && checkout_date != "" && stay_date_from != "" && stay_date_to != "" && typeof(net_rate) != "undefined" && net_rate != "" && no_of_room != "" && typeof(no_of_room) != "undefined"){		
				//alert("ctrt called..");	
				for (i = 1; i <= no_of_room; i++) { 
					// we need to write a jquery code to get the date differences...
					// stay_date_from = $('#stay_date_from_'+i).datepicker("getDate");
					// stay_date_to = $('#stay_date_to_'+i).datepicker("getDate");
					// no_of_day = (stay_date_to - stay_date_from) / (1000 * 60 * 60 * 24);
					stay_date_from = $('#stay_date_from_'+i).val();
					stay_date_to = $('#stay_date_to_'+i).val();
					// get the no of days different from stay date from and saty date to...
					if(stay_date_from == stay_date_to){
						no_of_day = 1;
					} else{
						var dataString = 'checkin_date='+stay_date_from+'&checkout_date='+stay_date_to;
						$.ajax({
				 			type:"POST",
				 			data:dataString,
				 			async: false,
				 			timeout: 5000, // wait 5 second
				 			url:base_url+"reservation/get_date_diff/",
				 			success:function(return_data){
				 				no_of_day = return_data;
				 			}
						});						
					}
				 	net_rate = $("#net_rate_"+i).val();
				 	no_of_rooms = $("#no_of_rooms_"+i).val();
				 	extra_bed = $("#extra_bed_"+i).val();
				 	extra_bed_price = $("#extra_bed_price_"+i).val();
				 	extra_person = $("#extra_person_"+i).val();
				 	extra_person_charge = $("#extra_person_charge_"+i).val();
				 	luxury_tax = $("#luxury_tax_"+i).val();
					if(typeof(net_rate) != "undefined" && net_rate != "" && no_of_rooms != "" && typeof(no_of_rooms) != "undefined") {
					 	total_room_tariff = total_room_tariff + (net_rate * no_of_rooms * no_of_day);
					 	
					 	if(extra_bed != "" && extra_bed != 0 && extra_bed_price != "" && extra_bed_price != 0 ){
					 		total_room_tariff = total_room_tariff + (extra_bed * extra_bed_price * no_of_day);
					 	} 
					 	if(extra_person != "" && extra_person != 0 && extra_person_charge != "" && extra_person_charge != 0 ){
					 		total_room_tariff = total_room_tariff + (extra_person * extra_person_charge * no_of_day);
					 	} 
					 	if(luxury_tax != "" && luxury_tax != 0 ){
					 		luxury_tax_amount = luxury_tax_amount + (((luxury_tax * net_rate) / 100) * no_of_rooms * no_of_day);
					 	} 
						tax_amount = 0;
						//alert(total_room_tariff);
					 	if($.isNumeric(total_room_tariff)){
					 		$("#total_room_tariff").val(total_room_tariff);

						 	if(luxury_tax_amount != "" && luxury_tax_amount != 0 ){
						 		tax_amount = parseInt(luxury_tax_amount);
						 	} 
						 	if(service_tax != "" && service_tax != 0 ){
						 		tax_amount = parseInt(tax_amount) + parseInt(((service_tax * total_room_tariff) / 100));
						 	} 
						 	if(service_charge != "" && service_charge != 0 ){
						 		tax_amount = parseInt(tax_amount) + parseInt(((service_charge * total_room_tariff) / 100));
						 	} 
						 	if(swachh_bharat_cess != "" && swachh_bharat_cess != 0 ){
						 		tax_amount = parseInt(tax_amount) + parseInt(((swachh_bharat_cess * total_room_tariff) / 100));
						 	} 
						 	if(krishi_kalyan_cess != "" && krishi_kalyan_cess != 0 ){
						 		tax_amount = parseInt(tax_amount) + parseInt(((krishi_kalyan_cess * total_room_tariff) / 100));
						 	} 
						 	if(discount_amount != "" && discount_amount != 0 && discount_type != ""){
						 		if(discount_type == "percentage")
						 			discount_amount = parseInt(((discount_amount * total_room_tariff) / 100));
						 		else if(discount_type == "cash"){
						 			// discount amount must not be more than total room tarrif....
						 			if(parseInt(discount_amount) <= parseInt(total_room_tariff))
						 				discount_amount = parseInt(discount_amount);
						 			else{
						 				swal("","Please check discount amount value. It must not be more than total room tarrif","error");		 		
								 		$("#discount_amount").val('');
								 		$("#discount_amount").focus();
						 			}
						 		}
						 	} 
						 	$("#luxury_tax_amount").val(luxury_tax_amount);
						 	$("#tax_amount").val(tax_amount);
						 	if(discount_amount != "" && discount_amount != 0 )
						 		total_amount = parseInt(tax_amount) + parseInt(total_room_tariff) - parseInt(discount_amount) ;
						 	else
						 		total_amount = parseInt(tax_amount) + parseInt(total_room_tariff);
							$("#total_amount").val(total_amount);
						 	if(misc_charge != "" && misc_charge != 0 )
						 		grand_total = parseInt(total_amount) + parseInt(misc_charge);
						 	else
						 		grand_total = total_amount;
							$("#grand_total").val(grand_total);
						 	if(parseInt(advance) != "" && parseInt(advance) != 0 && parseInt(advance) < parseInt(grand_total)){
						 		due_amount = parseInt(grand_total) - parseInt(advance);
						 		$("#due").val(due_amount);
						 	} else if(parseInt(advance) > parseInt(grand_total)){
						 		$("#due").val(grand_total);
						 		swal("","Please check advance amount value.","error")
						 		$("#advance").val('');
						 		$("#advance").focus();
						 	} else if(parseInt(advance) == parseInt(grand_total)){
						 		$("#due").val(0);
						 	}else {
						 		$("#due").val(grand_total);				 		
						 	}	
						}
					}
				}			
			} else {
				//alert("all data not dere...");
			}
		}	

	}

	// we need to define a global function which will be used to calculate the total and grand total price in case of back calculation...it will be used in that case only.......

	function calculate_total_back_calculation_amount(){

	 	// now we need to calculate the total room tarrif cost...
	 	// it will be based on net rate * total no of selected rooms * no of day/night stayed in hotel +
	 	// extra bed * extra bed price * no of day/night stayed in hotel +
	 	// extra person * extra person charge * no of day/night stayed in hotel	
		var total_amount = $('#total_amount').val();
		var misc_charge = $('#misc_charge').val();
	 	var advance = $("#advance").val();

	 	if(misc_charge != "" && misc_charge != 0 )
	 		grand_total = parseFloat(total_amount) + parseFloat(misc_charge);
	 	else
	 		grand_total = total_amount;
		$("#grand_total").val('');
		$("#grand_total").val(grand_total);
	 	if(parseInt(advance) != "" && parseInt(advance) != 0 && parseInt(advance) < parseInt(grand_total)){
	 		due_amount = parseFloat(grand_total) - parseFloat(advance);
	 		$("#due").val('');
	 		$("#due").val(due_amount);
	 	} else if(parseInt(advance) > parseInt(grand_total)){
	 		$("#due").val(grand_total);
	 		swal("","Please check advance amount value.","error")
	 		$("#advance").val('');
	 		$("#advance").focus();
	 	} else if(parseInt(advance) == parseInt(grand_total)){
	 		$("#due").val(0);
	 	}else {
	 		$("#due").val(grand_total);				 		
	 	}	
	}

	// we will define a global function which will be used to calculate total inclusion price ...
	// this calculation will be done on the basis of no of day, unit price, quantity and total etc....

	function calculate_total_inclusion(){

		var no_of_inclusion = $('#no_of_inclusion').val();
		var unit_price;
		var quantity;
	 	var days ;
	 	var total ;
	 	var all_total = 0;

		for (i = 1; i <= no_of_inclusion; i++) { 
		 	unit_price = $("#unit_price_"+i).val();
		 	quantity = $("#quantity_"+i).val();
		 	days = $("#days_"+i).val();
		 	if(parseInt(unit_price) && parseInt(quantity) && parseInt(days) && unit_price != "" && quantity != "" && days != "" ){
		 		// it means all fields values are perfect...and we need to calculate...
			 	total = unit_price * quantity * days; // calaculate individual total
			 	$("#total_"+i).val(total);
			 	all_total = all_total + total; // calaculate all total i.e. summ of all total
			 	$("#total_inclusion").text(all_total);
		 	}
		}
	}

//		write a function which will work on chnage event of occupancy radio button...
// 		this code will work on change event on radio button...
//		if htel name, meal plan and room type is not selected or not entered.. it wont work....

	function occupancy(no) {

		var room_id = $('#room_id_'+no).val();
		var base_url = $.cookie("base_url");
		var travel_agent_id = "";
		var corporate_agent_id = "";
		var occupancy = $('input[name=occupancy\\['+no+'\\]\\[\\]]:checked').val();
		var plan_type_id = $('#plan_type_id').val();
		var checkin_date = $('#checkin_date').val();
		var checkout_date = $('#checkout_date').val();

		// we need to check a condition where we will check whether any agent is selected or not...if agent is selected....then whcich either travel or corporate...
		if($("#travel").is(":checked")){
			var travel_agent_id = $('#travel_agent_id').val();
		}
		if($("#corporate").is(":checked")){
			var corporate_agent_id = $('#corporate_agent_id').val();
		}				
		
		if(room_id != "" && plan_type_id != "" ){

			var dataString = 'room_id='+room_id+'&plan_type_id='+plan_type_id+'&occupancy='+occupancy+'&travel_agent_id='+travel_agent_id+'&corporate_agent_id='+corporate_agent_id+'&checkin_date='+checkin_date+'&checkout_date='+checkout_date;
			$.ajax({
	 			type:"POST",
	 			data:dataString,
	 			url:base_url+"reservation/get_room_plan_price/",
	 			success:function(return_data){
	 				var return_data = $.parseJSON(return_data);
	 				//alert(return_data);
					// now we have inserted the record in table....
					// now we need to make sure that newly inserted records must be automatically selected in the drop down list..
					$("#room_rate_"+no).val('');
					$("#room_rate_"+no).val(return_data[0]);
					$("#net_rate_"+no).val('');
					$("#net_rate_"+no).val(return_data[4]);				
					calculate_total_room_tarrif(no); // calculate total room price after change of price..
	 			}
			});
			
		}else {
			swal("", "Please check hotel name, meal plan and room type selected values and try again.", "error");
			return false;
		}			

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

	// write a function which will calculate the back calculation

	$("#calculate_back_calculation").click(function(){
		// logic will be like this as explained below..
		// if back calculation is checked then a pop up will appear and we need to enter a last or final or total payable ammount...after that we need to read these fields.. total room tarrif, SBC, KKC, ST, SC, Luxury Tax Amount..on the basis of total room tarrif and luxury tax amount we need to get its luxury tax percentage.....on the basis of total payable amount, total room tarrif and total amount we need to find out new total room tarrif and it will calculate in a way that the total payabele amount will be equal with new amunt....

		if($("#total_room_price").val() != ""){
			// decalre varibales...
			var luxury_tax_percentage = 0;
			var new_trp = 0;
			var temp_total = 0;
			var temp_val = 0;
			var temp_tax_amount = 0;
			// read all required values....
			var total_room_price = $("#total_room_price").val();
			var total_room_tariff = $("#total_room_tariff").val();
			var luxury_tax_amount = $("#luxury_tax_amount").val();
			var swachh_bharat_cess = $("#swachh_bharat_cess").val();
			var krishi_kalyan_cess = $("#krishi_kalyan_cess").val();
			var service_tax = $('#service_tax').val();
			var service_charge = $("#service_charge").val();
			var total_amount = $("#total_amount").val();

			// calculate new total room tarrif...
			if(total_room_tariff != "" && total_room_tariff != 0){
				new_trp = parseFloat(((total_room_price * total_room_tariff ) / total_amount).toFixed(2)) ;
				$("#total_room_tariff").val('');
				$("#total_room_tariff").val(parseFloat(new_trp));
			}

			// calculate luxury tax percentage...
			if(luxury_tax_amount != "" && luxury_tax_amount != 0){
				luxury_tax_percentage = ((luxury_tax_amount * 100 ) / total_room_tariff).toFixed(2) ;
				temp_val = ((new_trp * luxury_tax_percentage ) / 100).toFixed(2) ;
				$("#luxury_tax_amount").val('');
				$("#luxury_tax_amount").val(parseFloat(temp_val));
				temp_total = parseFloat(temp_total) + parseFloat(temp_val) ;
				temp_tax_amount = parseFloat(temp_tax_amount) + parseFloat(temp_val) ;			
				temp_val = 0;
			}

			// calculate SBC...
			if(swachh_bharat_cess != "" && swachh_bharat_cess != 0){
				temp_val = ((new_trp * swachh_bharat_cess ) / 100).toFixed(2) ;
				temp_total = parseFloat(temp_total) + parseFloat(temp_val) ;
				temp_tax_amount = parseFloat(temp_tax_amount) + parseFloat(temp_val) ;			
				temp_val = 0;
			}

			// calculate KKC...
			if(krishi_kalyan_cess != "" && krishi_kalyan_cess != 0){
				temp_val = ((new_trp * krishi_kalyan_cess ) / 100).toFixed(2) ;
				temp_total = parseFloat(temp_total) + parseFloat(temp_val) ;
				temp_tax_amount = parseFloat(temp_tax_amount) + parseFloat(temp_val) ;			
				temp_val = 0;
			}

			// calculate ST...
			if(service_tax != "" && service_tax != 0){
				temp_val = ((new_trp * service_tax ) / 100).toFixed(2) ;
				temp_total = parseFloat(temp_total) + parseFloat(temp_val) ;
				temp_tax_amount = parseFloat(temp_tax_amount) + parseFloat(temp_val) ;			
				temp_val = 0;
			}

			// calculate SC...
			if(service_charge != "" && service_charge != 0){
				temp_val = ((new_trp * service_charge ) / 100).toFixed(2) ;
				temp_total = parseFloat(temp_total) + parseFloat(temp_val) ;
				temp_tax_amount = parseFloat(temp_tax_amount) + parseFloat(temp_val) ;			
				temp_val = 0;
			}
			temp_total = parseFloat(temp_total) + parseFloat(new_trp);

			$("#tax_amount").val('');
			$("#tax_amount").val(parseFloat(temp_tax_amount.toFixed(2)));
			$("#total_amount").val('');
			$("#total_amount").val(parseFloat(total_room_price));
			$("#back_calculation_modal").modal('toggle');
			calculate_total_back_calculation_amount();
		} else {
			swal("","Please enter new total payable amount.","error");
			return false;
		}
	});


	// for booking calendar reservation js is added here....

	$(document).on('change', '#plan_type_id', function(){
		//alert("clk on meal plan change...");
		var room_id = $('#room_id_1').val();
		var travel_agent_id = "";
		var corporate_agent_id = "";
	 	var base_url = $.cookie("base_url");

		// now we need to write a condition where we will chck whether we have entered checked in date or not..
		// if checked in date and meal plan is not entered then we will alert an error message..
		var checkin_date = $('#checkin_date').val();
		var checkout_date = $('#checkout_date').val();
		var plan_type_id = $('#plan_type_id').val();
		var hotel_id = $('#hotel_id').val();
		no = 1;
		var occupancy = $('input[name=occupancy\\['+no+'\\]\\[\\]]:checked').val();
		// we need to check a condition where we will check whether any agent is selected or not...if agent is selected....then whcich either travel or corporate...
		if($("#travel").is(":checked")){
			var travel_agent_id = $('#travel_agent_id').val();
		}
		if($("#corporate").is(":checked")){
			var corporate_agent_id = $('#corporate_agent_id').val();
		}				
						
		// get rooom price on the basis of meal plan and room type and occupancy...					

		var dataString = 'room_id='+room_id+'&plan_type_id='+plan_type_id+'&occupancy='+occupancy+'&travel_agent_id='+travel_agent_id+'&corporate_agent_id='+corporate_agent_id+'&no='+no+'&checkin_date='+checkin_date+'&checkout_date='+checkout_date;
		//alert(dataString);
		$.ajax({
 			type:"POST",
 			data:dataString,
 			url:base_url+"reservation/get_room_plan_price/",
 			success:function(return_data){
 				var return_data = $.parseJSON(return_data);
 				//alert(return_data);
				// now we have inserted the record in table....
				// now we need to make sure that newly inserted records must be automatically selected in the drop down list..
				$(".room_rate").val('');
				$(".room_rate").val(return_data[0]);												
				$(".net_rate").val('');
				$(".net_rate").val(return_data[4]);												
				$(".extra_bed_price").val('');
				$(".extra_bed_price").val(return_data[1]);												
				$(".extra_person_charge").val('');
				$(".extra_person_charge").val(return_data[2]);	
				$(".luxury_tax").val('');
				$(".luxury_tax").val(return_data[3]);												
				$(".luxury_tax_amount").val('');
				$(".luxury_tax_amount").val(return_data[3]);	

			 	calculate_total_room_tarrif(1);
 			}
		});	    
	});

	// for booking calendar reservation js is ended here....						 	


// Javascript added for Wizard 

	$(window).load(function(){ 
		$(".done").click(function(){
			var this_li_ind = $(this).parent().parent("li").index();
			var validation_error = 0;
			var validation_message = "";
			var room_id = [];
			var no_of_rooms = [];
			var net_rate = [];
			var stay_date_from = [];
			var stay_date_to = [];

			if($('.wizard li').hasClass("jump-here")){
				$(this).parent().parent("li").removeClass("active").addClass("completed");
				$(this).parent(".wizard-content").slideUp();
				$('.wizard li.jump-here').removeClass("jump-here");
			}else{
				// we need to write a code where we will find out the id of clicked button..on the basis of selected id we need to validate the input fields...
				var id = $(this).attr('id');
				//alert(id);
				if (id == "step1"){
				//alert("stp1");
					// we need to write a custom validation code which will check whether travel agent or corporate is selected or not..if selected then in respective drop down its respective values must be selected...if nt selected then it will give an error message...
					// check whetehr travel agent or corporate is selected or not...
					if($("#travel").is(":checked")){
						// it means travel agent chec box is selected...
						if($("#travel_agent_id").val() == ""){
							// it means ta is not selected...
							validation_error = 1;
							validation_message = "Please select travel agent from drop down list.";
						}
					}
					if($("#corporate").is(":checked")){
						// it means corporate agent chec box is selected...
						if($("#corporate_agent_id").val() == ""){
							// it means ta is not selected...
							validation_error = 1;
							validation_message = validation_message + "<br/> Please select corporate agent from drop down list.";
						}
					}

					if($("#email").val() != ""){
						// it means email field is not empty...
						var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
						if (!filter.test($("#email").val())) {
							// it means email is not valid....
							validation_error = 1;
							validation_message = validation_message + "Please enter a valid email address.";
						} 
					}
					if($("#total_adults").val() == "" ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter total adults.";
					}						
					if($("#hotel_id").val() == ""){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please select hotel.";
					}						
					if($("#plan_type_id").val() == "" ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please select meal plan.";
					}						
					if($("#checkin_date").val() == ""){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter checkin date.";
					}						
					if($("#checkout_date").val() == "" ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter checkout date.";
					}						
					
					if(validation_error == 1 ){
						swal({
							title: 'Please fill required fields!',
							text: validation_message,
							type: 'error',
							html: true
						})
						return false;
					} else{
						// it means required fields are filled up.....
						// it means all validations are perfect..we need to move next
						validation_error = 0;
						validation_message = "";	
						$("#step1").parent().parent("li").removeClass("active").addClass("completed");
						$("#step1").parent(".wizard-content").slideUp();
						$("#step1").parent().parent("li").next("li:not('.completed')").addClass('active').children('.wizard-content').slideDown();
					}
				}
				if (id == "step2"){
					// write a code which will read room no array and push it into new array ..we will use that array in room no drop down list under inclusion...
					$(".inclusion_room_number").append('<option value="">Select</option>');
					$('input[name^="room_no"]').each(function() {
						if($(this).val() != ""){
							// we need to write a code where we will check whether multiple rooms are sellected or not...if multiple rooms were selected at one time then we will split it on the basis of ,..if only one room were selected then there is no issues...
							var temp_room = $(this).val().split(","); // get an array value
							for(i = 0; i < temp_room.length; i++){
								if(temp_room[i] != ""){
									$(".inclusion_room_number").append('<option value="'+temp_room[i]+'">'+temp_room[i]+'</option>');
								}
							}
						}
					});	

					$("select[name='room_id[]']").each(function() {
					    var value = $(this).val();
					    if (value) {
					        room_id.push(value);
					    }
					});
					$("input[name='no_of_rooms[]']").each(function() {
					    var value = $(this).val();
					    if (value) {
					        no_of_rooms.push(value);
					    }
					});
					$("input[name='net_rate[]']").each(function() {
					    var value = $(this).val();
					    if (value) {
					        net_rate.push(value);
					    }
					});
					$("input[name='stay_date_from[]']").each(function() {
					    var value = $(this).val();
					    if (value) {
					        stay_date_from.push(value);
					    }
					});
					$("input[name='stay_date_to[]']").each(function() {
					    var value = $(this).val();
					    if (value) {
					        stay_date_to.push(value);
					    }
					});

					if($("#email").val() != ""){
						// it means email field is not empty...
						var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
						if (!filter.test($("#email").val())) {
							// it means email is not valid....
							validation_error = 1;
							validation_message = validation_message + "Please enter a valid email address.";
						} 
					}
					if($("#total_adults").val() == "" ){
						validation_error = 1;
						validation_message = "<br/> Please enter total adults.";
					}						
					if($("#hotel_id").val() == ""){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please select hotel.";
					}						
					if($("#plan_type_id").val() == "" ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please select meal plan.";
					}						
					if($("#checkin_date").val() == ""){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter checkin date.";
					}						
					if($("#checkout_date").val() == "" ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter checkout date.";
					}						

					if(typeof room_id == "undefined" || room_id.length == 0 ){
						validation_error = 1;
						validation_message = "Please select room type.";
					}
					if(typeof no_of_rooms == "undefined" || no_of_rooms.length == 0 ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please select room type and select room number.";
					}
					if(typeof net_rate == "undefined" || net_rate.length == 0 ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please add net rate for the selected room type.";
					}
					if(typeof stay_date_from == "undefined" || stay_date_from.length == 0 ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter stay date from.";
					}
					if(typeof stay_date_to == "undefined" || stay_date_to.length == 0 ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter stay date to.";
					}

					if(validation_error == 1 ){
						swal({
							title: 'Please fill required fields!',
							text: validation_message,
							type: 'error',
							html: true
						})
						return false;
					} else{
						// it means required fields are filled up.....
						// it means all validations are perfect..we need to move next
						validation_error = 0;
						validation_message = "";	
						$("#step2").parent().parent("li").removeClass("active").addClass("completed");
						$("#step2").parent(".wizard-content").slideUp();
						$("#step2").parent().parent("li").next("li:not('.completed')").addClass('active').children('.wizard-content').slideDown();
					}
				}
				if (id == "step3"){

					if($("#email").val() != ""){
						// it means email field is not empty...
						var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
						if (!filter.test($("#email").val())) {
							// it means email is not valid....
							validation_error = 1;
							validation_message = validation_message + "Please enter a valid email address.";
						} 
					}
					if($("#total_adults").val() == "" ){
						validation_error = 1;
						validation_message = "<br/> Please enter total adults.";
					}						
					if($("#hotel_id").val() == ""){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please select hotel.";
					}						
					if($("#plan_type_id").val() == "" ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please select meal plan.";
					}						
					if($("#checkin_date").val() == ""){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter checkin date.";
					}						
					if($("#checkout_date").val() == "" ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter checkout date.";
					}						

					$("select[name='room_id[]']").each(function() {
					    var value = $(this).val();
					    if (value) {
					        room_id.push(value);
					    }
					});
					$("input[name='no_of_rooms[]']").each(function() {
					    var value = $(this).val();
					    if (value) {
					        no_of_rooms.push(value);
					    }
					});
					$("input[name='net_rate[]']").each(function() {
					    var value = $(this).val();
					    if (value) {
					        net_rate.push(value);
					    }
					});
					$("input[name='stay_date_from[]']").each(function() {
					    var value = $(this).val();
					    if (value) {
					        stay_date_from.push(value);
					    }
					});
					$("input[name='stay_date_to[]']").each(function() {
					    var value = $(this).val();
					    if (value) {
					        stay_date_to.push(value);
					    }
					});

					if(typeof room_id == "undefined" || room_id.length == 0 ){
						validation_error = 1;
						validation_message = "Please select room type.";
					}
					if(typeof no_of_rooms == "undefined" || no_of_rooms.length == 0 ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please select room type and select room number.";
					}
					if(typeof net_rate == "undefined" || net_rate.length == 0 ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please add net rate for the selected room type.";
					}
					if(typeof stay_date_from == "undefined" || stay_date_from.length == 0 ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter stay date from.";
					}
					if(typeof stay_date_to == "undefined" || stay_date_to.length == 0 ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter stay date to.";
					}

					if($("#booking_status").val() == "" ){
						validation_error = 1;
						validation_message = "<br/> Please select booking status.";
					}						
					if($("#total_room_tariff").val() == ""){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter total room tarrif.";
					}						
					if($("#total_amount").val() == "" ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter total amount.";
					}						
					if($("#grand_total").val() == ""){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please enter grand total amount.";
					}						
					if($("#collection_point_id").val() == "" ){
						validation_error = 1;
						validation_message = validation_message + "<br/> Please select collection point.";
					}						
					if($("#advance").val() != "" && $("#advance").val() > 0){
						// now we need to make sure that payment type and payment date must be selected....
						if($("#payment_type").val() == ""){
							validation_error = 1;
							validation_message = validation_message + "<br/> Please select payment type.";
						} else {
							// it means payment type is selected... now on the basis of payment type we need to check whether the corresponding values are entered or not...
							if($("#payment_type").val() == "cheque"){
								if($("#cheque_no").val() == ""){
									validation_error = 1;
									validation_message = validation_message + "<br/> Please enter cheque number.";
								}
								if($("#bank_name").val() == ""){
									validation_error = 1;
									validation_message = validation_message + "<br/> Please enter bank name.";
								}
							}
							if($("#payment_type").val() == "demand_draft"){
								if($("#dd_no").val() == ""){
									validation_error = 1;
									validation_message = validation_message + "<br/> Please enter demand draft number.";
								}
								if($("#bank_name").val() == ""){
									validation_error = 1;
									validation_message = validation_message + "<br/> Please enter bank name.";
								}
							}
							if($("#payment_type").val() == "credit_card" || $("#payment_type").val() == "debit_card"){
								if($("#card_no").val() == ""){
									validation_error = 1;
									validation_message = validation_message + "<br/> Please enter card number.";
								}
								if($("#expiry_date").val() == ""){
									validation_error = 1;
									validation_message = validation_message + "<br/> Please enter card expiry date.";
								}
							}							
							if($("#payment_type").val() == "neft" || $("#payment_type").val() == "rtgs"){
								if($("#account_no").val() == ""){
									validation_error = 1;
									validation_message = validation_message + "<br/> Please enter account number.";
								}
								if($("#bank_name").val() == ""){
									validation_error = 1;
									validation_message = validation_message + "<br/> Please enter bank name.";
								}
							}
						}
						if($("#payment_date").val() == ""){
							validation_error = 1;
							validation_message = validation_message + "<br/> Please enter payment date.";
						}
					}						

					if(validation_error == 1 ){
						swal({
							title: 'Please fill required fields!',
							text: validation_message,
							type: 'error',
							html: true
						})
						return false;
					} else{
						// it means required fields are filled up.....
						// it means all validations are perfect..we need to move next
						validation_error = 0;
						validation_message = "";	
						//alert("no error");
						// it means required fields are filled up.....
						$("#guest_reservation").submit(); 
					}
				}
			}
		});

		$('.wizard li .wizard-heading').click(function(){
			if($(this).parent().hasClass('completed')){
				var this_li_ind = $(this).parent("li").index();  
				var li_ind = $('.wizard li.active').index();
				if(this_li_ind < li_ind){
					$('.wizard li.active').addClass("jump-here");
				}
				$(this).parent().addClass('active').removeClass('completed');
				$(this).siblings('.wizard-content').slideDown();
			}
		});
	})