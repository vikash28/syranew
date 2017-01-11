// Javascript for POS Bill Design page


$(document).on('keypress', '.digit_only', function(e){    
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $('.error_msg').html("Digits Only").show().fadeOut("slow");
        return false;
    }     
});


$(document).ready(function() { 
	var base_url = $.cookie("base_url");
	
    $("#bill_design_form").validate({ 
         rules: {
            
            restaurant_name: {
                required: true,
                lettersonly: true,                     
                noSpace: true
            }
            
         },
         messages: {
            restaurant_name: {
                    required: "Please enter restaurant name",
                    lettersonly: "only letters are allowed"
                }          
         },
         submitHandler: function(form) {
            var restaurant_name = $('#restaurant_name').val();
            var restaurant_address = $('#restaurant_address').val();
            var restaurant_phone = $('#restaurant_phone').val();
            var header_message = $('#header_message').val();
            var footer_message = $('#footer_message').val();
            
            if($("#date_time_flag").prop("checked")==true){ var date_time_flag = 1; }else{ var date_time_flag = 0;  }
            if($("#bill_number_flag").prop("checked")==true){ var bill_number_flag = 1; }else{ var bill_number_flag = 0;  }
            if($("#table_number_flag").prop("checked")==true){ var table_number_flag = 1; }else{ var table_number_flag = 0;  }
            if($("#room_number_flag").prop("checked")==true){ var room_number_flag = 1; }else{ var room_number_flag = 0;  }
            if($("#kot_number_flag").prop("checked")==true){ var kot_number_flag = 1; }else{ var kot_number_flag = 0;  }
            if($("#token_number_flag").prop("checked")==true){ var token_number_flag = 1; }else{ var token_number_flag = 0;  }
            if($("#vat_number_flag").prop("checked")==true){ var vat_number_flag = 1; }else{ var vat_number_flag = 0;  }
            if($("#tin_number_flag").prop("checked")==true){ var tin_number_flag = 1; }else{ var tin_number_flag = 0;  }
            if($("#service_charge_for_room_service_flag").prop("checked")==true){ var service_charge_for_room_service_flag = 1; }else{ var service_charge_for_room_service_flag = 0;  }
            if($("#service_tax_flag").prop("checked")==true){ var service_tax_flag = 1; }else{ var service_tax_flag = 0;  }
            if($("#vat_flag").prop("checked")==true){ var vat_flag = 1; }else{ var vat_flag = 0;  }
            //alert(date_time_flag);

        var dataString = 'restaurant_name='+ restaurant_name
                        + '&restaurant_address=' +restaurant_address
                        + '&restaurant_phone=' + restaurant_phone
                        + '&header_message=' + header_message
                        + '&footer_message=' + footer_message
                        + '&vat_flag=' + vat_flag
                        + '&service_tax_flag=' + service_tax_flag
                        + '&service_charge_for_room_service_flag=' + service_charge_for_room_service_flag
                        + '&tin_number_flag=' + tin_number_flag
                        + '&vat_number_flag=' + vat_number_flag
                        + '&date_time_flag=' + date_time_flag
                        + '&bill_number_flag=' + bill_number_flag
                        + '&table_number_flag=' + table_number_flag
                        + '&room_number_flag=' + room_number_flag
                        + '&kot_number_flag=' + kot_number_flag
                        + '&token_number_flag=' + token_number_flag
        //alert(dataString);
       
            $.ajax({
                    type: 'POST',
                    url: base_url+"pos_bill_design/previewBillDesign",
                    data: dataString,
                    dataType: "json",
                    success:function(data)
                    { 
                        //alert(data.item);
                        $('#bill_preview').html(data.item);
                    }      
                });
        }
        
    });

});



$('#save_bill_data').click(function(){
    var pos_bill_design_id = $('#pos_bill_design_id').val();
    var base_url = $.cookie("base_url");
    var restaurant_name = $('#restaurant_name').val();
    var restaurant_address = $('#restaurant_address').val();
    var restaurant_phone = $('#restaurant_phone').val();
    var header_message = $('#header_message').val();
    var footer_message = $('#footer_message').val();
    
    if($("#date_time_flag").prop("checked")==true){ var date_time_flag = 1; }else{ var date_time_flag = 0;  }
    if($("#bill_number_flag").prop("checked")==true){ var bill_number_flag = 1; }else{ var bill_number_flag = 0;  }
    if($("#table_number_flag").prop("checked")==true){ var table_number_flag = 1; }else{ var table_number_flag = 0;  }
    if($("#room_number_flag").prop("checked")==true){ var room_number_flag = 1; }else{ var room_number_flag = 0;  }
    if($("#kot_number_flag").prop("checked")==true){ var kot_number_flag = 1; }else{ var kot_number_flag = 0;  }
    if($("#token_number_flag").prop("checked")==true){ var token_number_flag = 1; }else{ var token_number_flag = 0;  }
    if($("#vat_number_flag").prop("checked")==true){ var vat_number_flag = 1; }else{ var vat_number_flag = 0;  }
    if($("#tin_number_flag").prop("checked")==true){ var tin_number_flag = 1; }else{ var tin_number_flag = 0;  }
    if($("#service_charge_for_room_service_flag").prop("checked")==true){ var service_charge_for_room_service_flag = 1; }else{ var service_charge_for_room_service_flag = 0;  }
    if($("#service_tax_flag").prop("checked")==true){ var service_tax_flag = 1; }else{ var service_tax_flag = 0;  }
    if($("#vat_flag").prop("checked")==true){ var vat_flag = 1; }else{ var vat_flag = 0;  }
            //alert(date_time_flag);

    var dataString = 'pos_bill_design_id='+ pos_bill_design_id
                    + '&restaurant_name=' +restaurant_name
                    + '&restaurant_address=' +restaurant_address
                    + '&restaurant_phone=' + restaurant_phone
                    + '&header_message=' + header_message
                    + '&footer_message=' + footer_message
                    + '&vat_flag=' + vat_flag
                    + '&service_tax_flag=' + service_tax_flag
                    + '&service_charge_for_room_service_flag=' + service_charge_for_room_service_flag
                    + '&tin_number_flag=' + tin_number_flag
                    + '&vat_number_flag=' + vat_number_flag
                    + '&date_time_flag=' + date_time_flag
                    + '&bill_number_flag=' + bill_number_flag
                    + '&table_number_flag=' + table_number_flag
                    + '&room_number_flag=' + room_number_flag
                    + '&kot_number_flag=' + kot_number_flag
                    + '&token_number_flag=' + token_number_flag
        //alert(dataString);
   
    $.ajax({
            type: 'POST',
            url: base_url+"pos_bill_design/updateBillDesign",
            data: dataString,
            dataType: "json",
            success:function(data)
            { 
                //alert(data.item);
                //$('#bill_preview').html(data.item);

                swal({   
                        title: "Success",   
                        text: "Bill Design Has been Saved.", 
                        type: "success"    
                    },
                function(){
                        window.location.href = 'pos_bill_design';
                    });
            }      
        });
});






