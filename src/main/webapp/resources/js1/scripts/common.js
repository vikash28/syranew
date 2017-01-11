var syraCommon = function () {
	var init = function () {
	
		toastr.options = {
		  "closeButton": true,
		  "debug": false,
		  "positionClass": "toast-bottom-right",
		  "onclick": null,
		  "showDuration": "1000",
		  "hideDuration": "1000",
		  "timeOut": "5000",
		  "extendedTimeOut": "1000",
		  "showEasing": "swing",
		  "hideEasing": "linear",
		  "showMethod": "fadeIn",
		  "hideMethod": "fadeOut"
		}
		
		
		$(document).ready(function(){
		
			// AJAX spinners !!
			$(document)
			.ajaxStart(function(){
				$(".page-spinner-bar").removeClass("hide");
			})
			.ajaxStop(function(){
				$(".page-spinner-bar").addClass("hide");
			});
			
			// Master AJAX setup with toastr integration
			
			$.postJSON = function(url, data, callback) {
				 
				return jQuery.ajax({
				headers: { 
					'Accept': 'application/json',
					'Content-Type': 'application/json' 
				},
				'type': 'POST',
				'url': url,
				'data': JSON.stringify(data),
				'dataType': 'json',
				'success': callback,
				'error': function(xhr, textStatus, errorThrown){	
					// Disable auto hide/close
					var tmpTimeout = toastr.options.timeOut;
					var tmpExtendedTimeOut = toastr.options.extendedTimeOut;
					toastr.options.timeOut=0;
					toastr.options.extendedTimeOut=0;
					
					// Parse XHR Server error text
					var strErr = errorThrown;
					try{
						jQuery.each(jQuery.parseHTML(xhr.responseText), function(index, elem) {
							if (elem.nodeName == "H1") {
								strErr = elem.innerHTML;
								return false;
							}
						});
					}catch(e){}
					
					// Show Toast
					toastr["error"](strErr, xhr.status + " - " + xhr.statusText);
					
					// Reset hide/close settings
					toastr.options.timeOut=tmpTimeout;
					toastr.options.extendedTimeOut=tmpExtendedTimeOut;
				  }
				})
			  .fail(function() {
				/*var tmpTimeout = toastr.options.timeOut;
				toastr.options.timeOut=0;
				toastr["error"]("","API Error occurred..");
				toastr.options.timeOut=tmpTimeout;*/
			  });
			};
			
		});
		
	}
	
	var validateConnectionForm = function(form){
        var error = $('.alert-danger', form);
        var success = $('.alert-success', form);

        $.validator.addMethod("valueNotEquals", function(value, element, arg){
        	  return arg != value;
        	 }, "Invalid value");

        form.validate({
            doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                //source
                hiveThriftServer: {
                    minlength: 5,
                    required: true
                },
                hdfsConnectionString: {
                    required: true
                },
                hdfsPath: {
                    required: true
                },
                hdfsAccessUser: {
                    required: true
                },
                hdfsFieldDelim: {
                    required: true
                },
                s3AccessKey: {
                    minlength: 5,
                    required: true
                },
                s3SecreteKey: {
                    minlength: 5,
                    required: true,
                },
                //destination
                redshiftDBURL: {
                    minlength: 5,
                    required: true
                },
                redshiftUser: {
                    required: true,
                },
                redshiftPassword: {
                    required: true
                },
                s3FileName: {
                    required: true
                },
                s3FileUrl: {
                    required: true
                },
                s3FieldDelim: {
                    required: true
                },
                hdfsTmpDir: {
                    required: true
                },
                mappingName: {
                    required: true
                },
                wfParent: {
                    required: true,
                    valueNotEquals: "-1"
                }
            },

            errorPlacement: function (error, element) { // render error placement for each input type
				error.insertAfter(element); // for other inputs, just perform default behavior
            },

            invalidHandler: function (event, validator) { //display error alert on form submit   
                success.hide();
                error.show();
                Metronic.scrollTo(error, -200);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                 // display success icon for other inputs
				label
					.addClass('valid') // mark the current input as valid and display OK icon
				.closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
            },

            submitHandler: function (form) {
                success.show();
                error.hide();
                //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
            }

        });		
	}
	
    return {

        //main function to initiate the module
        init: function () {

            if (!jQuery || !toastr) {
                return;
            }

            init();

        },
        validateConnectionForm: function (id) {
	
	        if (!jQuery().validate) {
	            return;
	        }
	
	        validateConnectionForm(id);
	
	    }

    };
}()