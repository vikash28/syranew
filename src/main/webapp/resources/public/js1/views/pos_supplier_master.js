// Javascript for Wizard

$(document).on('click', function(){
        $("#supplier_form").validate({
         rules: {
            
            supplier_name: {
                required: true,                     
                lettersonly: true,
                noSpace: true
            },
            website:{   
                url: true
            },
            city: {
                lettersonly: true,
                noSpace: true
            },
            contact_name: {
                lettersonly: true,
                noSpace: true
            },
            email: {
                newemail: true
            }
            
         },
         messages: {
            supplier_name: {
                    required: "Please enter supplier name"
                    
                }
         },
        
        });
});



$(document).on('keypress', '.digit_only', function(e){    
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $('.error_msg').html("Digits Only").show().fadeOut("slow");
        return false;
    }    
});

$(document).on('keypress', '.digit_only1', function(e){    
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $('.error_msg1').html("Digits Only").show().fadeOut("slow");
        return false;
    }     
});

$(document).on('keypress', '.digit_only2', function(e){    
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $('.error_msg2').html("Digits Only").show().fadeOut("slow");
        return false;
    }    
});

$(document).on('keypress', '.digit_only3', function(e){    
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $('.error_msg3').html("Digits Only").show().fadeOut("slow");
        return false;
    }    
});


$(document).on('keypress', '.digit_only4', function(e){    
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $('.error_msg4').html("Digits Only").show().fadeOut("slow");
        return false;
    }    
});

$(document).on('keypress', '.digit_only5', function(e){    
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $('.error_msg5').html("Digits Only").show().fadeOut("slow");
        return false;
    }    
});




