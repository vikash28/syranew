// JavaScript for Dashboard Controller
// code for camera images ...i.e. webcam.js...
$("#save_picture").hide();
$("#shoot_again").hide();
$("#shoot_another_picture").hide();
$(".booking_id").click(function(){    
    Webcam.init();   
    Webcam.set({
        width: 242,
        height: 200,
        image_format: 'jpeg',
        jpeg_quality: 100,
        force_flash: true,
    });
    Webcam.attach('#my_web_camera');		        
    $(".no_webcam_image").hide(); // hide no webcam image if web camera not avlbl...
});

$("#close_modal_id").click(function(){    
    Webcam.reset();		      
});

$("#shoot_picture").click(function(){
    Webcam.freeze();
    $("#shoot_picture").hide();
    $("#save_picture").show();
    $("#shoot_another_picture").show();
});

$("#shoot_another_picture").click(function(){
    Webcam.unfreeze();
    $("#shoot_picture").show();
    $("#save_picture").hide();
    $("#shoot_another_picture").hide();
});

$("#save_picture").click(function(){
    $("#save_picture").hide();
    $("#shoot_another_picture").hide();
    $("#shoot_picture").hide();
    $("#shoot_again").show();
    $("#my_web_camera").hide();
    $("#my_web_camera_picture").show();
    var booking_id = $("#booking_id").val();
    Webcam.snap( function(data_uri) {
        $("#my_web_camera_picture").html('<img src="'+data_uri+'"/>');
        $("#guest_image").val(data_uri);
        var  image_path_upload = $.cookie('base_url')+"application/modules/dashboard/views/upload.php?booking_id="+booking_id;
        //alert("ipu = "+image_path_upload);
        Webcam.upload( data_uri, image_path_upload, function(code, text) {
            //alert("res = "+text);
            if(text == "success")
                swal("Success", "Guest image has been uploaded successfully.", "success");
            else if(text == "failed")
                swal("Error on uploading guest image", "Please try again", "error");
        });         
    });    
});

$("#shoot_again").click(function(){
    $("#my_web_camera").show();
    $("#my_web_camera_picture").hide();
    $("#shoot_again").hide();
    $("#shoot_picture").show();
});

    $(document).ready(function(){

        var base_url = $.cookie("base_url");
        $("#phone").mask("9999999999"); // mobile no validation..
        $("#card_no").mask("9999-9999-9999-9999"); // 
        $("#expiry_date").mask("99-99"); // 
        $("#date_of_birth").mask("99-99-9999"); // 
        $("#foreigner").hide();
        $(".bank_name_status").hide();
        $("#passport_issue_date").mask("99-99-9999"); // 
        $("#passport_expiry_date").mask("99-99-9999"); // 
        $("#arrival_date_india").mask("99-99-9999"); // 
        $("#visa_issue_date").mask("99-99-9999"); // 
        $("#visa_expiry_date").mask("99-99-9999"); // 

        $('#is_foreigner').click(function() {
            if($(this).is(':checked'))
                // it means check box is checked...so we will show foreigner section..
                $("#foreigner").show();
            else
           // it means check box is not checked...so we will hide foreigner section..
                $("#foreigner").hide(); 
//                alert('unchecked');
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

        // for payment type we need by default hide all bank related html..
        // we will shoow and hide accordingly on the basis of payment type selected from drop down..

        $("#cheque_details_central_reservation").hide();
        $("#dd_details_central_reservation").hide();
        $("#chq_details_central_reservation").hide();   
        $("#cc_details_central_reservation").hide();
        $("#neft_details_central_reservation").hide();

        // we need to write a jquery code to get booking id on clikck of booking class..and after we need to get its details on the basis of booking id and guest id and fill it up in the model..
        $(document).on('click', '.booking_id', function(){            
            var booking_id = $(this).attr('id');
            var dataString = 'booking_id='+booking_id;
            $.ajax({
                type:"POST",
                data:dataString,
                url:base_url+"dashboard/get_booking_detail/",
                success:function(return_data){
                    var return_data = $.parseJSON(return_data);
                    // get hotel meal plan list..
                    var dataString = 'hotel_id='+return_data[30];
                    $.ajax({
                        type:"POST",
                        data:dataString,
                        url:base_url+"dashboard/get_meal_plan/",
                        success:function(return_data){
                            $("#plan_type_id").html(return_data);
                        }
                    });

                    // now we have inserted the record in table....
                    // now we need to make sure that newly inserted records must be automatically selected in the drop down list..
                    $("#booking_id").val(return_data[0]);
                    $("#booking_reference").html(return_data[1]);
                    $("#guest_name").val('');
                    $("#guest_name").val(return_data[2]);                                                
                    $("#phone").val('');
                    $("#phone").val(return_data[3]);                                                
                    $("#address").val('');
                    $("#address").val(return_data[4]);
                    $("#email").val('');
                    $("#email").val(return_data[5]);                                                
                    $("#total_adults").val('');
                    $("#total_adults").val(return_data[8]);                                                
                    $("#total_child").val('');
                    $("#total_child").val(return_data[9]);                                                
                    $("#extra_bed").val('');
                    $("#extra_bed").val(return_data[11]);                                                
                    $("#plan_type_id").val('');
                    $("#plan_type_id").val(return_data[17]);                                                
                    // $("#full_name").val('');
                    // $("#full_name").val(return_data[7]);                                                
                    $("#billing_instruction").val('');
                    $("#billing_instruction").val(return_data[10]);     
                    $("#room_no").val('');
                    $("#room_no").val(return_data[13]);     
                    $("#room_rate").val('');
                    $("#room_rate").val(return_data[14]);     
                    $("#net_rate").val('');
                    $("#net_rate").val(return_data[14]);     
                    $("#room_type").val('');
                    $("#room_type").val(return_data[15]); 
                    $("#payment_type").val('');
                    $("#payment_type").val(return_data[16]); 
                    $("#user_id").val('');
                    $("#user_id").val(return_data[12]); 
                    $("#users_id").val(return_data[12]); 
                    $("#hotel_id").val(return_data[30]); 
                    $("#checkin_date").val(return_data[20]); 
                    $("#check_in_time").val(return_data[18]); 
                    $("#checkout_date").val(return_data[21]); 
                    $("#check_out_time").val(return_data[19]); 
                    $("#guest_id").val(return_data[29]);
                    $("#organization").val(return_data[31]);
                    $("#designation").val(return_data[32]);                    
                    $("#arrived_from").val(return_data[33]);
                    $("#going_to").val(return_data[34]);
                    $("#police_station").val(return_data[35]);
                    
                    $("#date_of_birth").val(return_data[36]);
                    $("#purpose").val(return_data[37]);
                    $("#id_card_type").val(return_data[51]);                    
                    $("#id_card_number").val(return_data[52]);

                    if(return_data[38] == "1" ){
                        // it means its a foreigner....so we need to putt its other details as wel..
                        $('#is_foreigner').prop('checked', true);
                        $("#nationality").val(return_data[39]);
                        $("#passport_no").val(return_data[40]);                    
                        $("#passport_issue_date").val(return_data[40]);
                        $("#passport_expiry_date").val(return_data[41]);
                        $("#visa_no").val(return_data[42]);
                        $("#visa_issue_date").val(return_data[43]);
                        $("#visa_expiry_date").val(return_data[44]);                                                                  
                        $("#arrival_date_india").val(return_data[45]);
                        $("#duration_in_india").val(return_data[46]);
                        $("#is_employed_in_india").val(return_data[47]);                    
                        $("#arrival_place_india").val(return_data[48]);
                    }
                    if(return_data[53] != "" ){
                        // it means guest image is there so we will auto populate the guest image...
                        var image = '<img src="'+base_url+'assets/guest_image/guest_image_'+return_data[0]+'.jpg" alt="Guest Image" title="Guest Image" />';
                        $("#my_web_camera").hide();
                        $("#my_web_camera_picture").html(image);
                        $("#guest_image").val(return_data[53]);
                    }
                                                                                                          
                    // we need to write a condition to check whats the type of payment and accordingly we need to display the other options as well..
                    if(return_data[16] == "payment_by_company" || return_data[16] == "cash"){
                        $("#cheque_details_central_reservation").hide();
                        $("#chq_details_central_reservation").hide();
                        $("#dd_details_central_reservation").hide();
                        $("#cc_details_central_reservation").hide();
                        $("#neft_details_central_reservation").hide();
                    }else if(return_data[16] == "cheque"){
                        $("#cheque_details_central_reservation").show();
                        $(".bank_name_status").show();
                        $("#chq_details_central_reservation").show();
                        $("#dd_details_central_reservation").hide();
                        $("#cc_details_central_reservation").hide();
                        $("#neft_details_central_reservation").hide();
                        $("#cheque_no").val(return_data[23]); 
                        $("#bank_name").val(return_data[22]); 
                    }
                    else if(return_data[16] == "demand_draft"){
                        $("#cheque_details_central_reservation").show();
                        $(".bank_name_status").show();
                        $("#dd_details_central_reservation").show();
                        $("#chq_details_central_reservation").hide();                       
                        $("#cc_details_central_reservation").hide();
                        $("#neft_details_central_reservation").hide();
                        $("#dd_no").val(return_data[24]); 
                        $("#bank_name").val(return_data[22]); 
                    }
                    else if(return_data[16] == "credit_card" || return_data[16] == "debit_card"){
                        $("#cheque_details_central_reservation").show();
                        $("#cc_details_central_reservation").show();
                        $(".bank_name_status").hide();
                        $("#chq_details_central_reservation").hide();
                        $("#dd_details_central_reservation").hide();                        
                        $("#neft_details_central_reservation").hide();
                        $("#card_no").val(return_data[25]); 
                        $("#expiry_date").val(return_data[28]); 
                    }
                    else if(return_data[16] == "neft" || return_data[16] == "rtgs"){
                        $("#cheque_details_central_reservation").show();
                        $("#neft_details_central_reservation").show();
                        $(".bank_name_status").show();
                        $("#chq_details_central_reservation").hide();
                        $("#dd_details_central_reservation").hide();
                        $("#cc_details_central_reservation").hide();
                        $("#account_no").val(return_data[26]); 
                        $("#ifsc_code").val(return_data[27]); 
                        $("#bank_name").val(return_data[22]);                                              
                    }
                }
            });
        });

        // we need to write a jquery code to validate a GRC form...for validation purpose we will use swal to show an error message..

        $(document).on('click', '.form_validation', function(){   

            var validation_error = 0;
            var validation_message = "";

            if($("#guest_name").val() == "" ){
                validation_error = 1;
                validation_message = "Please enter guest name.";
            }                       
            if($("#phone").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter mobile number.";
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
            if($("#address").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter guest address.";
            }                       
            if($("#arrived_from").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter arrived from.";
            }                       
            if($("#going_to").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter going to.";
            }                       
            if($("#checkin_date").val() == ""){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter arival date.";
            }                       
            if($("#check_in_time").val() == ""){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter arival time.";
            }                       
            if($("#checkout_date").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter checkout date.";
            }                       
            if($("#check_out_time").val() == ""){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter arival time.";
            }                       
            if($("#purpose").val() == ""){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter purpose of visit.";
            } 
            // foreigners validation starts...                      
            // we need to check whether foreigners check box is selected or not..if foreigners check box is selected then these validations must be passed..
            if($("#is_foreigner").is(":checked")){
                // it means foreigners check box is selected....

                if($("#country").val() == "" ){
                    validation_error = 1;
                    validation_message = validation_message + "<br/> Please select country name.";
                }                       
                if($("#passport_no").val() == "" ){
                    validation_error = 1;
                    validation_message = validation_message + "<br/> Please enter passport number.";
                }                       
                if($("#passport_issue_date").val() == "" ){
                    validation_error = 1;
                    validation_message = validation_message + "<br/> Please enter passport issue date.";
                }                       
                if($("#passport_expiry_date").val() == "" ){
                    validation_error = 1;
                    validation_message = validation_message + "<br/> Please enter passport expiry date.";
                }                       
                if($("#arrival_date_india").val() == "" ){
                    validation_error = 1;
                    validation_message = validation_message + "<br/> Please enter arrival date in India.";
                }                       
                if($("#visa_no").val() == "" ){
                    validation_error = 1;
                    validation_message = validation_message + "<br/> Please enter visa number.";
                }                       
                if($("#visa_issue_date").val() == "" ){
                    validation_error = 1;
                    validation_message = validation_message + "<br/> Please enter visa issue date.";
                }                       
                if($("#visa_expiry_date").val() == "" ){
                    validation_error = 1;
                    validation_message = validation_message + "<br/> Please enter visa expiry date.";
                }                       
                if($("#arrival_place_india").val() == "" ){
                    validation_error = 1;
                    validation_message = validation_message + "<br/> Please enter place of arrival in India.";
                }
            }

            // foreigners validation ends...  
            if($("#room_no").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter room number.";
            }                       
            if($("#room_type").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please select room type.";
            }                       
            if($("#room_rate").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter total room tarrif.";
            }
            if($("#total_adults").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please enter total adults.";
            }                       
            if($("#plan_type_id").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please select meal plan.";
            }                       
            if($("#user_id").val() == "" ){
                validation_error = 1;
                validation_message = validation_message + "<br/> Please select booked by.";
            }                       

            if(validation_error == 1 ){
                swal({
                    title: 'Please Fill Required fields',
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
                // it means required fields are filled up.....
                // now we need to get the id of clicked button and on the basis of id clicked we will submit the form in a different way..
                var button_id = $(this).attr('id');
                if(button_id == "checkin_guest_print_grc"){
                    $("#grc_form").attr("target","_blank");
                    $("#grc_form").submit();
                    $("#grc_form").removeAttr("target"); 
                    $(this).delay(100).queue(function() {
                        $(".bs-example-modal-lg").modal('toggle'); 
                        location.reload(true);                     
                        //$(this).dequeue();
                    });                    
                } else{
                    $("#grc_form").submit(); 
                }
            }

        });

        $('#payment_type').change(function() {
            if($('#payment_type').val() != ""){
                /// on the basis of hotel id we need to get its meal plan type and room type for that hotel...
                var payment_type = $('#payment_type').val();

                if(payment_type == "cash" || payment_type == "payment_by_cash" )
                    $("#cheque_details_central_reservation").hide();                    
                    $("#dd_details_central_reservation").hide();
                    $("#chq_details_central_reservation").hide();
                    $("#cc_details_central_reservation").hide();
                    $("#neft_details_central_reservation").hide(); 
                    $(".bank_name_status").hide();     
                
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
        
        $("#checkout_date").datepicker({ dateFormat: 'dd-mm-yy', minDate: 0}).bind("change",function(){ });

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

        // $("#checkin_date").datetimepicker({ dateFormat: 'dd-mm-yy', minDate: 0, controlType: 'select',  oneLine: true,  timeFormat: 'hh:mm tt',altField: "#check_in_time"}).bind("change",function(){
        //     var minValue = $(this).val();
        //     minValue = $.datepicker.parseDate("dd-mm-yy", minValue);
        //     minValue.setDate(minValue.getDate()+1);
        //     $("#checkout_date").datetimepicker( "option", "minDate", minValue );            
        // })     

        $('.sa-warning').click(function(){
            var booking_id = $(this).attr('id');
            swal({
                title: "Are you sure?",
                text: "This Booking will be marked as No-Show and you will not be able to Check-in Guest.The Room will be vacated.",                
                type: "input",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, mark as NO SHOW",
                closeOnConfirm: false,
                inputPlaceholder: "Reason for No Show",
                inputType: 'text',  
                inputValue: 'Guest is not coming.'                 
            }, function(inputValue){   
                if (inputValue === false) return false;      
                if (inputValue === "") {     
                    swal.showInputError("Please write the reason for No Show!");     
                    return false 
                }  
                if(booking_id != "" ){
                    // it means booking id is there ..so we can proceed now...

                    var dataString = 'booking_id='+booking_id+'&no_show_reason='+inputValue;
                    $.ajax({
                        type: 'POST',
                        //dataType: "json",
                        data: dataString,  
                        url: base_url+"dashboard/update_checkin_status_noshow",
                       
                        success: function(msg) {
                            swal({
                                title: "Done!",
                                text: "Your Booking was marked as NO SHOW",
                                type: "success"
                            },
                            location.reload(true)
                            );
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            swal("Error on changing a status", "Please try again", "error");
                        }
                    });
                }
            });
        });

        $('#change_room').click(function(){
            var booking_id = $("#booking_id").val();
            swal({
                title: "Are you sure?",
                text: "You will be redirected to different page to edit a booking.Once you will edit a booking and submit that page then again you will be redirected to dashboard page and you need to again check in this guest.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, move to booking edit page",
                closeOnConfirm: false
            }, function (isConfirm) {
                if (!isConfirm) return;
                $(location).attr("href", base_url+"reservation/edit_booking/"+booking_id);
            });
        });

        // we need to write a jquery code to get the room number on the basis of selected room type....we need to make sure that we will only populate vacant room number..and if there is no any vacant room number on that selected room type and date then we need to display an alert message for the same....so that user can seletc different room type....
//         $(document).on('change', '.room_id', function(){
//             //alert("change on select..")
//             // get id attribute values on the basis of class name click..
//             var select_id = $(this).attr('id');
//             var room_no = [];
//             var checkin_date_no;
//             var booking_record_no;
//             var split
// //          alert(select_id);
//             // we need to get the no of row for check in room...it will be id values like 1,2 etc....
//             // it will be in form of room_id_1_1.....
//             split = select_id.substring(8).split('_');
//             checkin_date_no = split[1];
//             booking_record_no = split[0];

//             if($('#'+select_id).val() != ""){
//                 var room_id = $('#'+select_id).val();
//               alert(room_id);
//                 // now we need to write a condition where we will chck whether we have entered checked in date or not..
//                 // if checked in date and meal plan is not entered then we will alert an error message..
//                 var checkin_date = $('#checkin_date_'+checkin_date_no).val();
// //                 var checkout_date = $('#checkout_date').val();
// //                 var plan_type_id = $('#plan_type_id').val();
// //                 var occupancy = $('input[name=occupancy\\['+no+'\\]\\[\\]]:checked').val();
// //                 var travel_agent_id = $('#travel_agent_id').val();
// //                 var corporate_agent_id = $('#corporate_agent_id').val();
// // //              var room_no = $('input[name=room_no\\[\\]]').val();
// //                 var selected_room_id = $('input[name=room_id\\[\\]]').val();
// //                 $('input[name^="room_no"]').each(function() {
// // //                  alert($(this).val());
// //                     if($(this).val() != "")
// //                         room_no.push($(this).val());
// //                 });             
// //              alert(room_no);
                
// //              alert(checkin_date);
// //                 if(checkin_date != "" && plan_type_id != "" && checkout_date != "" ){
// //                     var dataString = 'room_id='+room_id+'&checkin_date='+checkin_date+'&checkout_date='+checkout_date+'&account_id='+account_id+'&room_no='+room_no+'&selected_room_id='+selected_room_id;
// //                     $.ajax({
// //                         type:"POST",
// //                         data:dataString,
// //                         url:base_url+"reservation/get_hotel_room/",
// //                         success:function(return_data){
// //     //                      alert(return_data);
// //                             //  now we need to check whether we have any vacant room or not....
// //                             if(return_data == ""){// it means there is no any room vacant....so we will just display a message..
// //                                 $('#room-number-selection-modal').modal('hide');
// //                                 // remove all previous values if anything is there...
// //                                 $("#room_rate_"+no).val('');
// //                                 $("#net_rate_"+no).val('');
// //                                 $("#extra_bed_price_"+no).val('');
// //                                 $("#extra_person_charge_"+no).val('');
// //                                 $("#luxury_tax_"+no).val('');
// //                                 $("#luxury_tax_amount").val('');

// //                                 alert("Please select any other room type and date. All rooms are booked under this type and date.");
// //                                 $("#room_id_"+no+" > option").removeAttr("selected");
// //                                 return false;
// //                             }else {                             
// //                                 // now we have inserted the record in table....
// //                                 // now we need to make sure that newly inserted records must be automatically selected in the drop down list..
// //                                 $("#room_number").html('');
// //                                 $("#room_number").html(return_data);                                                

// //                                 // get rooom price on the basis of meal plan and room type and occupancy...                 

// //                                 var dataString = 'room_id='+room_id+'&plan_type_id='+plan_type_id+'&occupancy='+occupancy+'&travel_agent_id='+travel_agent_id+'&corporate_agent_id='+corporate_agent_id+'&no='+no+'&checkin_date='+checkin_date+'&checkout_date='+checkout_date;
// //                                 $.ajax({
// //                                     type:"POST",
// //                                     data:dataString,
// //                                     url:base_url+"reservation/get_room_plan_price/",
// //                                     success:function(return_data){
// //                                         var return_data = $.parseJSON(return_data);
// // //                                      alert(return_data);
// //                                         // now we have inserted the record in table....
// //                                         // now we need to make sure that newly inserted records must be automatically selected in the drop down list..
// //                                         $("#room_rate_"+no).val('');
// //                                         $("#room_rate_"+no).val(return_data[0]);                                                
// //                                         $("#net_rate_"+no).val('');
// //                                         $("#net_rate_"+no).val(return_data[0]);                                             
// //                                         $("#extra_bed_price_"+no).val('');
// //                                         $("#extra_bed_price_"+no).val(return_data[1]);                                              
// //                                         $("#extra_person_charge_"+no).val('');
// //                                         $("#extra_person_charge_"+no).val(return_data[2]);  
// //                                         $("#luxury_tax_"+no).val('');
// //                                         $("#luxury_tax_"+no).val(return_data[3]);                                               
// //                                         $("#luxury_tax_amount").val('');
// //                                         $("#luxury_tax_amount").val(return_data[3]);    

// //                                     }
// //                                 });

// //                                 $('#room-number-selection-modal').modal();

// //                                 calculate_total_room_tarrif(no);

// //                             }
// //                         }
// //                     });


// //                 } else {
// //                     $("#room_id_"+no+" > option").removeAttr("selected");
// //                     alert("Please enter your check in date and select meal plan type.");
// //                     return false;
// //                 }
//             }
            
//         });

//         $(document).on('change', '.room_id', function(){          
//             var room_id = $(this).attr('val');
//             var dataString = 'room_id='+room_id;
//             $.ajax({
//                 type:"POST",
//                 data:dataString,
//                 url:base_url+"dashboard/get_booking_detail/",
//                 success:function(return_data){
//                     var return_data = $.parseJSON(return_data);
//                     // now we have inserted the record in table....
//                     // now we need to make sure that newly inserted records must be automatically selected in the drop down list..
//                     $("#booking_id").val(return_data[0]);
//                     $("#booking_reference").html(return_data[1]);
//                     $("#guest_name").val('');
//                     $("#guest_name").val(return_data[2]);                                                
//                     $("#guest_id").val(return_data[29]);                                                
//                     $("#phone").val('');
//                     $("#phone").val(return_data[3]);                                                
//                     $("#address").val('');
//                     $("#address").val(return_data[4]);
//                     $("#email").val('');
//                     $("#email").val(return_data[5]);                                                
//                     $("#total_adults").val('');
//                     $("#total_adults").val(return_data[8]);                                                
//                     $("#total_child").val('');
//                     $("#total_child").val(return_data[9]);                                                
//                     $("#extra_bed").val('');
//                     $("#extra_bed").val(return_data[11]);                                                
//                     $("#plan_type_id").val('');
//                     $("#plan_type_id").val(return_data[17]);                                                
//                     // $("#full_name").val('');
//                     // $("#full_name").val(return_data[7]);                                                
//                     $("#billing_instruction").val('');
//                     $("#billing_instruction").val(return_data[10]);     
//                     $("#room_no").val('');
//                     $("#room_no").val(return_data[13]);     
//                     $("#room_rate").val('');
//                     $("#room_rate").val(return_data[14]);     
//                     $("#room_type").val('');
//                     $("#room_type").val(return_data[15]); 
//                     $("#payment_type").val('');
//                     $("#payment_type").val(return_data[16]); 
//                     $("#user_id").val('');
//                     $("#user_id").val(return_data[12]); 
//                     $("#users_id").val(return_data[12]); 
//                     $("#hotel_id").val(return_data[30]); 
//                     $("#checkin_date").val(return_data[20]); 
//                     $("#check_in_time").val(return_data[18]); 
//                     $("#checkout_date").val(return_data[21]); 
//                     $("#check_out_time").val(return_data[19]); 

//                     // we need to write a condition to check whats the type of payment and accordingly we need to display the other options as well..
// //                    alert(return_data[18]);
//                     if(return_data[16] == "payment_by_company" || return_data[16] == "cash"){
//                         $("#cheque_details_central_reservation").hide();
//                         $("#chq_details_central_reservation").hide();
//                         $("#dd_details_central_reservation").hide();
//                         $("#cc_details_central_reservation").hide();
//                         $("#neft_details_central_reservation").hide();
//                     }else if(return_data[16] == "cheque"){
//                         $("#cheque_details_central_reservation").show();
//                         $("#chq_details_central_reservation").show();
//                         $("#dd_details_central_reservation").hide();
//                         $("#cc_details_central_reservation").hide();
//                         $("#neft_details_central_reservation").hide();
//                         $("#cheque_no").val(return_data[23]); 
//                         $(".bank_name").val(return_data[22]); 
//                     }
//                     else if(return_data[16] == "demand_draft"){
//                         $("#cheque_details_central_reservation").show();
//                         $("#dd_details_central_reservation").show();
//                         $("#chq_details_central_reservation").hide();                       
//                         $("#cc_details_central_reservation").hide();
//                         $("#neft_details_central_reservation").hide();
//                         $("#dd_no").val(return_data[24]); 
//                         $(".bank_name").val(return_data[22]); 
//                     }
//                     else if(return_data[16] == "credit_card" || return_data[16] == "debit_card"){
//                         $("#cheque_details_central_reservation").show();
//                         $("#cc_details_central_reservation").show();
//                         $("#chq_details_central_reservation").hide();
//                         $("#dd_details_central_reservation").hide();                        
//                         $("#neft_details_central_reservation").hide();
//                         $("#card_no").val(return_data[25]); 
//                         $("#expiry_date").val(return_data[28]); 
//                     }
//                     else if(return_data[16] == "neft" || return_data[16] == "rtgs"){
//                         $("#cheque_details_central_reservation").show();
//                         $("#neft_details_central_reservation").show();
//                         $("#chq_details_central_reservation").hide();
//                         $("#dd_details_central_reservation").hide();
//                         $("#cc_details_central_reservation").hide();
//                         $("#account_no").val(return_data[26]); 
//                         $("#ifsc_code").val(return_data[27]); 
//                         $(".bank_name").val(return_data[22]);                                              
//                     }
//                 }
//             });
//         });

    }); // close of document jquery.....