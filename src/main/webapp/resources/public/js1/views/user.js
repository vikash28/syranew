$(document).ready(function(){
	$( document ).on( "click", "#sbmt", function(e) {
	 var checked = $("input:checked").length > 0;
    if (!checked){
        swal("Error!", "Please select at list one page", "error");
        return false;
    }
	});
	$('.current_hotel_id').prop('checked', true);
	
	
	  $("#MyForm").validate({
			     rules: {
					user_name:{ 
					   required: true,
					   noSpace: true,				   
					   remote: "user/user_name_unique"
					},
					hotel_id: {
						required: true
					},
					full_name: {
						required: true,
						lettersonly: true,
						noSpace: true
					},
					password: {
						required: true,
						minlength: 5
						},
					
					cpassword: {
						required: true,
						minlength: 5,
						equalTo: "#password"
					},
					"hotel_id[]": { 
							required: true, 
							minlength: 1 
					} 
			     },
			     messages: {
						user_name:{ 
						   required: "Please enter your email",				
						   remote: "User name already exists"
						},
						 hotel_id: {
							required: "Please Select hotel"
							
						},
						 full_name: {
							required: "Please enter full name"
						
						},
						
						 password: {
							required: "Please provide a password",
							minlength: "Your password must be at least 5 characters long"
						},
						cpassword: {
							required: "Please provide a password",
							minlength: "Your password must be at least 5 characters long",
							equalTo: "Please enter the same password as above"
						},
						"hotel_id[]": {
							required: "Please select at least one hotel."
							}
						
			     },
				
		});		
	
	 $("#MyFormEdit").validate({
			     rules: {
					
					hotel_id: {
						required: true
					},
					full_name: {
						required: true
					},
					
					cpassword: {
						equalTo: "#password"
					},
					"hotel_id[]": { 
							required: true, 
							minlength: 1 
					} 
			     },
			     messages: {
						
						 hotel_id: {
							required: "Please Select hotel"
							
						},
						 full_name: {
							required: "Please enter full name"
						
						},
						
						cpassword: {
							
							equalTo: "Please enter the same password "
						},
						"hotel_id[]": {
							required: "Please select at least one hotel."
							}
						
			     },
				
		});
	
	
	
	
	$( document ).on( "click", 'input[name="all"]', function() {
		var status = $(this).is(':checked');
		$('[id^=checkall]').prop('checked', status);
		$('input[name="fd"]').prop('checked', status);
		$('input[name="pos"]').prop('checked', status);
		$('input[name="fd"]').prop('disabled', status);
		$('input[name="pos"]').prop('disabled', status);
		$('[id^=checkall]').closest('fieldset').find('input').prop('checked',status);
	});
	$( document ).on( "click", 'input[name="fd"]', function() {
		var status = $(this).is(':checked');
		$('#checkall1').prop('checked', status);
		$('.fd').prop('checked', status);
		$('.fd').closest('fieldset').find('input').prop('checked',status);
		
	});
	$( document ).on( "click", 'input[name="pos"]', function() {
		var status = $(this).is(':checked');
		$('#checkall54').prop('checked', status);
		$('#checkall59').prop('checked', status);
		$('.pos').prop('checked', status);
		$('.pos').closest('fieldset').find('input').prop('checked',status);
		
	});

	$( document ).on( "click", 'input[name="all"]', function() {
		var status = $(this).is(':checked');
		$('[id^=checkall]').prop('checked', status);
		$('[id^=checkall]').closest('fieldset').find('input').prop('checked',status);
	});
	/*$('input[name="all"],[id^=checkall]').bind('click', function(){
	var status = $(this).is(':checked');
	$(this).prop('checked', status);
	$(this).closest('fieldset').find('input').prop('checked',status);
});*/
/**/
	$('[id^=checkall]').click(function(){
		var status = $(this).is(':checked');
		$(this).closest('fieldset').find('input').prop('checked',status);
	});
	
	 $(".children_checkbox").change(function () {
		var branch=$(this).parent().parent().parent().find(':checkbox').attr('id');
		$('#'+branch).prop('checked', true);
  });
	
	
});


function confirmDelete(id) 
{
	var base_url = $.cookie("base_url");
	 
    swal({
			title: "Are you sure?",
			text: "This user will be deleted and cannot be recovered!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: false
			 }, function (isConfirm) {
			if (!isConfirm) return;
			$.ajax({
				url: base_url+"user/userUpdate",
				type: 'POST',
				dataType: "json",
				data: {'id': id},  
				
			success: function(msg) {
					swal("Done!", "User was succesfully deleted!", "success");
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