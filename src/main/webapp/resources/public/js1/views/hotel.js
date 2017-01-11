$(document).ready(function() {
	var base_url = $.cookie("base_url");
	var url = document.location.toString();
	
	
	$('.wysihtml5').wysihtml5();

        // $('.summernote').summernote({
        //     height: 200,                 // set editor height

        //     minHeight: null,             // set minimum height of editor
        //     maxHeight: null,             // set maximum height of editor

        //     focus: true                 // set focus to editable area after initializing summernote
        // });

  

  /*  if (url.match('#')) {
        $('.nav-tabs a[href=#'+url.split('#')[1]+']').tab('show') ;
    } 
    
    // Change hash for page-reload
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;

    });*/
	
	  $("#hotelForm").validate({
			     rules: {
					
					hotel_name: {
						required: true,						
						lettersonly: true,
						noSpace: true
					},
					phone1: {
						required: true,						
						maxlength: 11,
						minlength: 10,
						number: true
					},
					phone2:{	
						minlength: 10,									
						maxlength: 11,
						number: true
					},
					fax:{	
						minlength: 10,									
						maxlength: 11,
						number: true
					},
					website:{	
						url: true
					},
					city: {
						required: true,						
						lettersonly: true,
						noSpace: true
					},
					hotel_contact_person: {
						required: true,						
						lettersonly: true,
						noSpace: true
					},
					contact_email: {
						required: true,						
						newemail: true
					},
					booking_office_address :{
						required: true
					},
					booking_office_phone_number: {
						required: true,						
						maxlength: 11,
						minlength: 10,
						number: true
					},
					service_tax :{
						required: true,
						number: true,
						max:99.99
					},
					swachh_bharat_cess :{
						required: true,
						number: true,
						max:99.99
					},
					service_charge :{
						required: true,
						number: true,
						max:99.99
					},
					standard_tac :{
						required: true,
						number: true,
						max:99.99
					},
					hotel_prefix :{
						required: true,
						lettersonly: true,
						maxlength: 6
					},
					img : {
						//required: true,
						accept: "jpg,png,jpeg,gif"
					},
					"meal_plans[]": { 
							required: true, 
							minlength: 1 
					} 
					
			     },
			     messages: {
						
						 hotel_name: {
							required: "Please enter hotel name"
							
						},
						phone1: {												
						//maxlength: 11,
						number: "Please specify a valid phone number"
					},
					booking_office_phone_number: {												
						//maxlength: 11,
						number: "Please specify a valid phone number"
					},
					img : {
						  required: 'Select an image to upload',
                           accept: 'Only images with type jpg/png/jpeg/gif are allowed'
					},
					"meal_plans[]": {
					required: "Please select at least one meal Plans."
					}
						
			     },
				
		});
	
	
	
	
	
	$('#free_website').click(function(){		
		$.ajax({
		url: base_url+"hotel/free_website_email",
		type: 'POST',
		dataType: "json",
		success: function(msg) {
				$('#free_website_succ').html(msg.item);		
		}
		});
	
	});
	
	


	
});

 function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#blah')
                        .attr('src', e.target.result)
                        .width(200)
                        .height(100);
                };

                reader.readAsDataURL(input.files[0]);
            }
        }

// JavaScript for Sweet Alert function -- used for deleting hotel 
function confirmDelete(hotel_id) {
	var base_url = $.cookie("base_url");
            swal({
				title: "Are you sure?",
				text: "This hotel will be deleted from your system and cannot be recovered!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function (isConfirm) {
                if (!isConfirm) return;

                if(hotel_id != "" ){
                    // it means booking id is there ..so we can proceed now...
                    $.ajax({
                        url: base_url+"hotel/hotelDelete",
						type: 'POST',
						dataType: "json",
						data: {'hotel_id': hotel_id}, 
                       
                       success: function(msg) {
                       	var cm_use=msg['data'];
                       	var cm_typ=msg['typ'];

                       	if (cm_use=='No') {
                            swal({
                                title: "Hotel Not Deleted!",
                                text: "This Hotel Can`t be deleted because it is using Channel Manager",
                                type: "error"
                            });
                        	} else {

                        		swal({
                                title: "Done!",
                                text: "Hotel was succesfully deleted!",
                                type: "success"
                            },location.reload(true)
                            );
                        	}
                        },                        
                        error: function (xhr, ajaxOptions, thrownError) {
                            swal("Error on changing a status", "Please try again", "error");
                        }
                    });
                }
            });
}// JavaScript Document

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