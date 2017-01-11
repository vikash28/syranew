  $(document).ready(function(){	
   var base_url = $.cookie("base_url"); 
	   $('#stock_qty').css("display", "none"); 
	   $('#in_stock').change(function(){
		    if(this.checked)
			 $('#stock_qty').css("display", "block"); 
			 else  $('#stock_qty').css("display", "none"); 
			  });
	  $( document ).on( "click", ".item", function() {
		var total_amount=$("#total_amount").val();
		if(total_amount=="" || total_amount==0){
			 swal("Error!", "All field are required", "error");
		 return false;
		}
		 else
		 return true;

 
});
	  $("#other_item_form").validate({
			     rules: {
					
					item_id: {
						required: true,						
					},days: {
						required: true,	
						max: 99,
						min: 1,
						number: true					
					
					},no_of_item: {
						required: true,	
						max: 100,
						min: 1,
						number: true					
					},price: {
						required: true,						
						number: true					
					}
					
					
			     },
			     messages: {
						
					
						
			     },
				
		}); 
		
		  $( document ).on( "click", "#save_item", function() {
		 $("#edit_other_item_form").validate({
			     rules: {
					
					item_id: {
						required: true,						
					},days: {
						required: true,	
						max: 99,
						min: 1,
						number: true					
					
					},no_of_item: {
						required: true,	
						max: 100,
						min: 1,
						number: true					
					},price: {
						required: true,						
						number: true					
					}
					
					
			     },
			     messages: {
						
					
						
			     },
				
		});
		});  
	  
	 
	  
	  $("#hotel_id").change(function() {
	
	var hotel_id=$("#hotel_id").val();
	$.ajax({
		url: base_url+"other_income/order_list",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id},  
		success: function(msg) {
		$('#order_list').html(msg.item);
		}
		});
	
	 });
		$("#dt").datepicker({
		maxDate: 0
		});
	   $('#dt').change(function(){
		    if(this.checked)
			 $('#stock_qty').css("display", "block"); 
			 else  $('#stock_qty').css("display", "none"); 
			  });
	  
		
		$('.edit_item').click(function() { 
    	var item_id = $(this).attr('id');
		$.ajax({
			url: base_url+"other_income/editincome",
		type: 'POST',
		dataType: "json",
		data: {'item_id': item_id},  
		
		success: function(msg) {
		$('#edit-new-item').html(msg.item);
		}
		});
							
});
});
 function isNumber(evt) {
         var charCode = (evt.which) ? evt.which : event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57 ))
            return false;
  
         return true;
      }

	function edit_order(item_booked_id) { 
    	var base_url = $.cookie("base_url");
		$.ajax({
			url: base_url+"other_income/editorder",
		type: 'POST',
		dataType: "json",
		data: {'item_booked_id': item_booked_id},  
		
		success: function(msg) {
		$('#edit-new-item').html(msg.item);
		}
		});
							
}	




function getiteminfo(item_id) {
	var base_url = $.cookie("base_url");
	if (typeof item_id === "undefined"){
    	var item_id = $('#item_id').val();}
		console.log(item_id);
		$.ajax({
			url: base_url+"other_income/getiteminfo",
		type: 'POST',
		dataType: "json",
		data: {'item_id': item_id},  
		
		success: function(msg) {
		$('#no_of_item').prop("disabled", false);
		$('#available').prop("disabled", false);
		$('#use').prop("disabled", false);
	
			if(msg.in_stock==0){
				
			$('#no_of_item').val("");
			$('#available').val("");
			$('#use').val("");
			$('#no_of_item').val('1');
			$('#available').prop("disabled", true);
			$('#use').prop("disabled", true);
			$('#price').val(msg.price);
			$('#total_amount').val(msg.price);
			
			}
			else{
			$('#available').val(msg.no_of_item);
			//$('#available').val(msg.available);
			$('#use').val(msg.use);
			$('#total_amount').val(msg.price);
			$('#price').val(msg.price);
			$('#days').val('1');
			$('#no_of_item').val('1');
			$('#available').prop("disabled", true);
			$('#use').prop("disabled", true);
			}
			
		//$('#edit-new-item').html(msg.item);
		}
		});
							
}
	function getlist(){
		$('form#item_list').submit();
	}

	function getinformation() { 
		var base_url = $.cookie("base_url");
    	var date = $('#dt').val();
		var hotel_id = $('#hotel_id1').val();
		if(hotel_id==""){
		   swal("please select a hotel first");	
		   $('#dt').val('');
		   return false;
		
		}
		$.ajax({
			url: base_url+"other_income/getroomno",
		type: 'POST',
		dataType: "json",
		data: {'date': date,'hotel_id': hotel_id},  
		
		success: function(msg) {
		$('#room_number').replaceWith(msg.item);
		$('#item_id').replaceWith(msg.item1);
		}
		});
							
}
	function getbooking() {
			var base_url = $.cookie("base_url");
			var room = $('#room_number').val();
			var hotel_id = $('#hotel_id1').val();
			if(hotel_id==""){
			  // swal("please select a hotel first");	
			   $('#dt').val('');
			   return false;
			
			}
			$.ajax({
				url: base_url+"other_income/getbookingid",
			type: 'POST',
			dataType: "json",
			data: {'room': room,'hotel_id': hotel_id},  
			
			success: function(msg) {
				//alert(msg.booking_id);
			$('#booking_id').val(msg.booking_id);
			$('#booking_referenc').val(msg.booking_reference);
			
			}
			});
								
	}

	
	function confirmDeleteItem(item_id) {
		var base_url = $.cookie("base_url");
    swal({
        title: "Are you sure?",
        text: "This Item will be deleted and cannot be recovered.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
   		 }, function (isConfirm) {
        if (!isConfirm) return;
        $.ajax({
			url: base_url+"other_income/itemdelete",
			type: 'POST',
			dataType: "json",
			data: {'item_id': item_id},  
			
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

		function confirmreturn(item_booked_id) {
			var base_url = $.cookie("base_url");
    swal({
        title: "Are you sure?",
        text: "This item will be returned to Stock so you can issue it to someone else.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
   		 }, function (isConfirm) {
        if (!isConfirm) return;
        $.ajax({
			url: base_url+"other_income/bookeditemreturn",
			type: 'POST',
			dataType: "json",
			data: {'item_booked_id': item_booked_id},  
			
			success: function(msg) {
		sweetAlert({
    title: "Done!",
    text: "Item was succesfully returned!",
    type: "success"
},

 function getorder_list() {
	 	var base_url = $.cookie("base_url");	
	var hotel_id=$("#hotel_id").val();
	$.ajax({
		url: base_url+"other_income/order_list",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id},  
		success: function(msg) {
		$('#order_list').html(msg.item);
		}
		});
	
	 
});         },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Error deleting!", "Please try again", "error");
            }
        });
    });
}

	function confirmDelete1(item_booked_id) {
			var base_url = $.cookie("base_url");
    swal({
        title: "Are you sure?",
        text: "This order will be removed from the system and cannot be recovered later.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
   		 }, function (isConfirm) {
        if (!isConfirm) return;
        $.ajax({
			url: base_url+"other_income/bookeditemDelete",
			type: 'POST',
			dataType: "json",
			data: {'item_booked_id': item_booked_id},  
			
			success: function(msg) {
		sweetAlert({
    title: "Done!",
    text: "Inclusion Order was succesfully deleted!",
    type: "success"
},

 function getorder_list() {
	 	var base_url = $.cookie("base_url");
	
	var hotel_id=$("#hotel_id").val();
	$.ajax({
		url: base_url+"other_income/order_list",
		type: 'POST',
		dataType: "json",
		data: {'hotel_id': hotel_id},  
		success: function(msg) {
		$('#order_list').html(msg.item);
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

	function total() {
		var available = $('#available').val();
		var price = $('#price').val();
		var days = $('#days').val();
		var no_of_item = $('#no_of_item').val();
		if(parseInt(available) < parseInt(no_of_item)){
			swal("Error!", "please add right no", "error");
			$("#total_amount").val('');
			$('#no_of_item').val('');
			return false;
		}
		else{
			var total = (price*days*no_of_item);
			$("#total_amount").val(total);
		}
		
			
			
		}	
