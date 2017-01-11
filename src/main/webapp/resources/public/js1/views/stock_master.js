// JavaScript for Stock Master 

// JavaScript for Sweet Alert function 

			!function($) {
			    "use strict";

			    var SweetAlert = function() {};
			    //examples 
			    SweetAlert.prototype.init = function() {

			    $('#sa-warning').click(function(){
			        swal({   
			            title: "Are you sure?",   
			            text: "This Vendor will be deleted and cannot be recovered.",   
			            type: "warning",   
			            showCancelButton: true,   
			            confirmButtonColor: "#DD6B55",   
			            confirmButtonText: "Yes, Delete Vendor.",   
			            closeOnConfirm: false 
			        }, function(){   
			            swal("Deleted!", "Your Vendor has been deleted.", "success"); 
			        });
			    });
			    },

			    
			    
			    $.SweetAlert = new SweetAlert, $.SweetAlert.Constructor = SweetAlert
			}(window.jQuery),

			//initializing 
			function($) {
			    "use strict";
			    $.SweetAlert.init()
			}(window.jQuery);

// Sweet alert code ends 



//password check

		$('#userRPass').on('keyup', function () {
		if ($(this).val() == $('#userPassword').val()) {
		$('#message').html('Passwords match').css('color', 'green');
		} else $('#message').html('Passwords do not match').css('color', 'red');
		});