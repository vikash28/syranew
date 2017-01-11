$(document).ready(function(){
	$( document ).on( "click", "#sbmt", function(e) {
	 var checked = $("input:checked").length > 0;
    if (!checked){
        swal("Error!", "Please select at list one page", "error");
        return false;
    }
	});
	
	  $("#MyForm").validate({
			     rules: {
					email:{ 
					   required: true,
					   newemail: true,
					   remote: "user/email_unique"
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
					phone: {
						required: true,
						maxlength: 11,
						minlength: 10,
						number: true
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
						email:{ 
						   required: "Please enter your email",
						   email: "Please enter a valid email address",
						   remote: "Email address already exists"
						},
						 hotel_id: {
							required: "Please Select hotel"
							
						},
						 full_name: {
							required: "Please enter full name"
						
						},
						phone: {
							required: "Please enter phone number",
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
					
					phone: {
						required: true,
						maxlength: 11,
						minlength: 10
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
						phone: {
							required: "Please enter your phone number",
						},
						cpassword: {
							
							equalTo: "Please enter the same password "
						},
						"hotel_id[]": {
							required: "Please select at least one hotel."
							}
						
			     },
				
		});
	
	
	
	
	 $(".children_checkbox").change(function () {
		 var set1 = new Array("8","46", "47", "48","25","42");
		  var set2 = new Array("13", "27", "34");
		   var set3 = new Array("24", "36");
		var id = $(this).val();
		var status=$(this).is(':checked');
		//alert(status);
		if($.inArray( id, set1 )!= -1){
			jQuery.each( set1, function( i, val ) {
		  $('#checkbox'+val).prop('checked', status);
		  //alert('#checkbox'+val);

		});
		}
		else if($.inArray( id, set2 )!= -1){
			jQuery.each( set2, function( i, val ) {
		  $('#checkbox'+val).prop('checked', status);
		});
		}
		else if($.inArray( id, set3 )!= -1){
			jQuery.each( set3, function( i, val ) {
		  $('#checkbox'+val).prop('checked', status);
		});
		
		}
		//var branch=$(this).closest('fieldset').find(':checkbox').attr('id');
		//$('#'+branch).prop('checked', status);
  });
	
	
});


