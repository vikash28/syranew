// JS for Invoice Module
jQuery(document).ready(function(){

 
       $('.wysihtml5').wysihtml5();

        $('.summernote').summernote({
            height: 200,                 // set editor height

            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor

            focus: true                 // set focus to editable area after initializing summernote
        });

        $('#email_message').summernote({
            height: 800,                 // set editor height

            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor

            focus: true              // set focus to editable area after initializing summernote
        });


 });


!function($) {
    "use strict";

    var SweetAlert = function() {};

    //examples 
    SweetAlert.prototype.init = function() {
    },
    //init
    $.SweetAlert = new SweetAlert, $.SweetAlert.Constructor = SweetAlert
}(window.jQuery),

//initializing 
function($) {
    "use strict";
    $.SweetAlert.init()
    var url = window.location;
    var base_url = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];
    //$('#invoice_message').hide();
    var no=0;
    var account_id = '<?=$this->session->userdata("account_id")?>';

    jQuery.validator.addMethod("multiemail", function (value, element) {
    if (this.optional(element)) {
    return true;
    }

    var emails = value.split(','),
    valid = true;

    for (var i = 0, limit = emails.length; i < limit; i++) {
    value = emails[i];
    valid = valid && jQuery.validator.methods.email.call(this, value, element);
    }

    return valid;
    }, "Invalid email format: please use a comma to separate multiple email addresses.");

    jQuery.fn.ForceAlphaNumericOnly =
    function()
    {
         
        return this.each(function()
        {
            $(this).keydown(function(e)
            {
                var key = e.charCode || e.keyCode || 0;
                // allow backspace, tab, delete, arrows, letters, numbers and keypad numbers ONLY
                return (
                    key == 8 || 
                    key == 9 ||
                    key == 46 ||
                    key == 32 ||
                    (key >= 37 && key <= 40) ||
                    //(key >= 48 && key <= 57) ||
                    (key >= 65 && key <= 90) ||
                    (key >= 96 && key <= 105));
            })
        })
    };


     $("#invoice_form").validate({
             rules: {
                
                invoice_name: {
                    required: true,                     
                    //noSpace: true
                },
                invoice_phone_no: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    number: true
                },
                invoice_subject_line: {
                    required: true
                },
                invoice_email: {
                    required: true,
                    email: true

                },
                invoice_email_cc: {
                required: false,    
                multiemail: true
                },
                invoice_email_bcc: {
                required: false,  
                multiemail: true
                }

             },
             messages: {
                invoice_name: {
                        required: "Please enter invoice name",
                        //noSpace:  "Please enter invoice name without space"
                    },    
                invoice_phone_no: {
                        required: "Please enter hotel phone no",
                         number: "Please phone no a number",
                         minlength: "Please enter phone no of 10 digit",
                         maxlength: "Please enter phone no of 10 digit"
                    },
                invoice_subject_line: {
                        required: "Please enter invoice subject line"
                    },
                invoice_email: {
                        required: "Please enter invoice email",
                        email: "Please specify email"
                    },
               invoice_email_cc: {
                        multiemail: "You must enter a valid email, or comma separate multiple"
                    },
               invoice_email_bcc: {
                        multiemail: "You must enter a valid email, or comma separate multiple"
                    }
                             
             },
 
     });
$("#send_invoice_form").validate({
             rules: {
                
                email: {
                    required: true,
                    email: true

                }
                ,
                phone:
                {   
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    number: true

                } 

             },
             messages: {
                email: {
                        required: "Please enter valid email",
                        email: "Please specify email"
                    },
                    phone: {
                        required: "Enter phone no",
                         number: "phone no a number",
                         minlength: "Enter phone-no of 10 digit",
                         maxlength: "Enter phone-no of 10 digit"
                    } 
                             
             },
 
     });


    $(document).on('keypress', '.interger_no_valid', function(event){
    var $this = $(this);
    if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
       ((event.which < 48 || event.which > 57) &&
       (event.which != 0 && event.which != 8))) {
           event.preventDefault();
    }    
});


 
$(document).on('keypress', '.only_digit_decimal', function(event){
    var $this = $(this);
    if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
       ((event.which < 48 || event.which > 57) &&
       (event.which != 0 && event.which != 8))) {
           event.preventDefault();
    }

    var text = $(this).val();
    if ((event.which == 46) && (text.indexOf('.') == -1)) {
        setTimeout(function() {
            if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
            }
        }, 1);
    }

    if ((text.indexOf('.') != -1) &&
        (text.substring(text.indexOf('.')).length > 2) &&
        (event.which != 0 && event.which != 8) &&
        ($(this)[0].selectionStart >= text.length - 2)) {
            event.preventDefault();
    }      
});
 
    $("#guest_name").ForceAlphaNumericOnly();
    
    

    $("#send_an_invoice_link").click(function()
    {
    $('#sent_invoices').removeClass('tab-pane active in').addClass('tab-pane');
    $('#sent_invoices_li').removeClass('active').addClass('');
    
    $('#send_invoice').removeClass('tab-pane').addClass('tab-pane active in');
    $('#send_invoice_li').removeClass('').addClass('active');

    });

    $(document).on('click', '.create-invoice-class', function(){
    $('#invoice_form')[0].reset(); 
    $('#create-invoice-modal').modal('show');
    $('#form_type').val('insert');
    });



     $(document).on('click', '#submit_invoice', function(){

    var formdate=$('#invoice_form').serialize();
    var status=$('#invoice_form').valid();
    var msg=$('#form_type').val();
    var invoice_name=$('#invoice_name').val();

   if(status==true){
        $.ajax({
             url:  base_url+"/invoice/create_update_invoice",
             type: "POST",
             data: formdate,
             //dataType: 'json',
             success: function (data) {
             if(data =='done')
             {
             $('#invoice_form')[0].reset(); 
             var redirect_url=base_url+"/invoice/index/"+msg+"/";
             $('#create-invoice-modal').modal('hide');
             window.location.href = redirect_url;
             }
             if(data =='error')
             {
             swal("", "This Invoice Name - ("+invoice_name+") aleady exists. Please enter a different name", "error");
             $('#invoice_name').val(''); 
             $('#create-invoice-modal').modal('show'); 
             }
             //$('#invoice_message').html('You have successfully created the invoice - Invoice for '+data+'.'); 
             //$('#invoice_message').show();//alert(data);  -
             },error: function (xhr, ajaxOptions, thrownError) {alert("ERROR:" + xhr.responseText+" - "+thrownError);}
          });
    
    
    }
    
    });

    $(document).on('click', '.edit_invoice', function(){
    var invoice_id=$(this).attr('id');
    $('#form_type').val('update');
    $('#hiddden_invoice_id').val(invoice_id);

    var invoice=invoice_json;    
    var allfilter=getObjects(invoice, 'invoice_id',invoice_id);
    var allfilter_array=JSON.stringify(allfilter);
    $.each(allfilter, function (index, valueobj) {
    $('#invoice_name').val(valueobj['invoice_name']);
    $('#invoice_subject_line').val(valueobj['invoice_subject_line']);
    $('#invoice_phone_no').val(valueobj['invoice_phone_no']);
    $('#invoice_email').val(valueobj['invoice_email']);
    $('#invoice_email_cc').val(valueobj['invoice_cc_email']);
    $('#invoice_email_bcc').val(valueobj['invoice_bcc_email']);
    $('#invoice_inclusions').next().next().contents().find('.wysihtml5.form-control.wysihtml5-editor').html(valueobj['invoice_inclusions']);
   // $(".wysihtml5-sandbox").contents().find('.wysihtml5.form-control.wysihtml5-editor').html("dcbek");
    $('#invoice_terms').next().next().contents().find('.wysihtml5.form-control.wysihtml5-editor').html(valueobj['invoice_terms']);

    });
    $('#create-invoice-modal').modal('show');
    

    });

    $(document).on('click', '.delete_invoice', function(){
    var invoice_id=$(this).attr('id');
    swal({
        title: "Are you sure?",
        text: "This invoive will be deleted and cannot be recovered!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
         }, function (isConfirm) {
            //alert(isConfirm); 
        if (!isConfirm) return;


    
    var msg='delete';
            $.ajax({
             url:  base_url+"/invoice/delete_invoice",
             type: "POST",
             data: {invoice_id:invoice_id},
             //dataType: 'json',
             success: function (data) { 
            swal("Done!", "Invoice was succesfully deleted!", "success");
            var redirect_url=base_url+"/invoice/index/"+msg+"/";
            window.location.href = redirect_url;
             },error: function (xhr, ajaxOptions, thrownError) { alert(thrownError); swal("Error deleting!", "Please try again", "error"); }
             ,async: false
           });
        });

    });
      
 

   $('#hotel_id').change(function() {

            if($('#hotel_id').val() != ""){
                /// on the basis of hotel id we need to get its meal plan type and room type for that hotel...
                var hotel_id = $('#hotel_id').val();
                
                $.ajax({
                    type:"POST",
                    data:hotel_id,
                    url:base_url+"/invoice/get_meal_plan/"+hotel_id,
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
                    url:base_url+"/invoice/get_hotel_room_type/"+hotel_id,
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
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "Yes, move to add room for this hotel",
                                closeOnConfirm: false
                            }, function (isConfirm) {
                                if (!isConfirm) return;
                                $(location).attr("href", base_url+"/room");
                            });
                        }
                    }
                });
    }
    else
    {
                 $('#meal_plan').html('');
                 remove_extra_row(); 
                 calculate_total_room_tarrif(1);

    }
}); 
  
$("#checkout_date").datepicker({ dateFormat: 'dd-mm-yy', minDate: 0}).bind("change",function(){
            var maxDate = $(this).val();
            maxDate = $.datepicker.parseDate("dd-mm-yy", maxDate);
            maxDate.setDate(maxDate.getDate());
            calculate_total_room_tarrif(1);// calculate total room price after change of price..
});

$("#checkin_date").datepicker({ dateFormat: 'dd-mm-yy', minDate: 0}).bind("change",function(){
            var minDate = $(this).val();
            minDate = $.datepicker.parseDate("dd-mm-yy", minDate);
            minDate.setDate(minDate.getDate()+1);
            $("#checkout_date").datepicker( "option", "minDate", minDate );
             
            calculate_total_room_tarrif(1);// calculate total room price after change of price..
}); 

$('.add_room_button').click(function()
{
var add_room_id=$('#no_of_room').val();
var get_room_type=$('#room_id_1').html();
var no_of_rooms=$('#no_of_rooms_'+add_room_id).val();
if( get_room_type  !="" && no_of_rooms !="")
{
add_room_id++;

var div_append='<div class="row" id="room_details_row_'+add_room_id+'"> <div class="col-md-12"><div class="col-md-2"><div class="form-group"><label for="">Select Room</label><select class="form-control room_id" id="room_id_'+add_room_id+'" name="room_id[]" required="">'+get_room_type+'</select></div></div> <div class="col-md-2" style="width:10%;"><div class="form-group"><label for="">No of Rooms</label><input type="text" class="form-control" id="no_of_rooms_'+add_room_id+'" name="no_of_rooms[]" readonly data-val="true" required="" placeholder=""><input type="hidden" value="" id="room_no_'+add_room_id+'" name="room_no[]" ><span class="error"></span></div></div><div class="col-md-1"><div class="form-group"><label for="">Net Rate</label><input type="text" class="form-control only_digit_decimal calculate_room_tarrif" id="net_rate_'+add_room_id+'" name="net_rate[]" placeholder=""  ><span class="error"></span></div></div><div class="col-md-1"><div class="form-group"><label for="">Extra Bed</label><input type="text" class="form-control only_digit calculate_room_tarrif" id="extra_bed_'+add_room_id+'" name="extra_bed[]" placeholder="" maxlength="6"></div></div><div class="col-md-2" style="width:13%;"><div class="form-group"><label for="">Extra Bed Price</label><input type="text" class="form-control only_digit calculate_room_tarrif" id="extra_bed_price_'+add_room_id+'" name="extra_bed_price[]" placeholder="" ></div></div><div class="col-md-2" style="width:13%;"><div class="form-group"><label for="">Extra Person</label><input type="text" class="form-control only_digit calculate_room_tarrif" id="extra_person_'+add_room_id+'" name="extra_person[]" placeholder="" maxlength="5"></div> </div> <div class="col-md-2" style="width:15%;"><div class="form-group"><label for="">Extra Person Charge</label><input type="text" class="form-control only_digit_decimal calculate_room_tarrif" id="extra_person_charge_'+add_room_id+'" name="extra_person_charge[]" placeholder="" ></div></div> <div class="col-md-2" style="width:15%;"><div class="form-group"><label for="" >Selected Room No</label><div id="display_room_no_'+add_room_id+'"></div></div></div></div>';                         
$('#add_room').append(div_append);

$('#no_of_room').val(add_room_id);
}
else
{
 swal("Error!", "Please select hotel ,get room type,add no of rooms ", "error");    
}
});
$('.remove_room_button').click(function()
{
var add_room_id=$('#no_of_room').val();
if(add_room_id != '1')
{
$('#room_details_row_'+add_room_id).remove();
add_room_id--;
$('#no_of_room').val(add_room_id);
}
});


$(document).on('change', '.room_id', function(){ 
            //get id attribute values on the basis of class name click..
            var select_id = $(this).attr('id');
            
            var room_no = [];
            //we need to get the no of row for check in room...it will be id values like 1,2 etc....
            //it will be in form of room_id_1.....
            no= select_id.substring(8);

            if($('#'+select_id).val() != ""){
            var room_id = $('#'+select_id).val();
            var travel_agent_id = "";
            var corporate_agent_id = "";
            // on the basis of room id selection we need to fetch total no of bed and on the basis of that bed we will decide wedr its single or double occupancy...
            var dataString = 'room_id='+room_id;

            var checkin_date = $('#checkin_date').val();
            var checkout_date = $('#checkout_date').val();
            var plan_type_id = $('#plan_type_id').val();
            var hotel_id = $('#hotel_id').val();
            $('input[name^="room_no"]').each(function() {
                  //alert($(this).val());
                    if($(this).val() != "")
                        room_no.push($(this).val());
                }); 
                
                if(checkin_date != "" && plan_type_id != "" && checkout_date != "" ){
                    var dataString = 'room_id='+room_id+'&checkin_date='+checkin_date+'&checkout_date='+checkout_date+'&account_id='+account_id+'&room_no='+room_no+'&hotel_id='+hotel_id;
            
                $.ajax({
                        type:"POST",
                        data:dataString,
                        url:base_url+"/invoice/get_hotel_room/",
                        success:function(return_data){
                             //  now we need to check whether we have any vacant room or not....
                            if(return_data == ""){// it means there is no any room vacant....so we will just display a message..
                                $('#room-number-selection-modal').modal('hide');
                                // remove all previous values if anything is there...
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

                               var dataString = 'room_id='+room_id+'&plan_type_id='+plan_type_id+'&occupancy=double&travel_agent_id='+0+'&corporate_agent_id='+0+'&no='+no+'&checkin_date='+checkin_date+'&checkout_date='+checkout_date;
                               
                                $.ajax({
                                    type:"POST",
                                    data:dataString,
                                    url:base_url+"/invoice/get_room_plan_price/",
                                    success:function(return_data){
                                        var return_data = $.parseJSON(return_data); 
                                        // now we have inserted the record in table....
                                             
                                        $("#net_rate_"+no).val('');
                                        $("#net_rate_"+no).val(return_data[0]);                                             
                                        $("#extra_bed_price_"+no).val('');
                                        $("#extra_bed_price_"+no).val(return_data[1]);                                              
                                        $("#extra_person_charge_"+no).val('');
                                        $("#extra_person_charge_"+no).val(return_data[2]);  
                    
                                    }
                                });
                                $('#room-number-selection-modal').modal();
                                calculate_total_room_tarrif(no);
                            }
                        }
                    });
            }
            else {
                    $("#room_id_"+no+" > option").removeAttr("selected");
                    swal("","Please enter your check in & out date and select meal plan type.","error")                 
                    return false;
                }
            
        }
        else
        {
            $("#net_rate_"+no).val(0);
            $("#no_of_rooms_"+no).val(0);
            $("#extra_bed_"+no).val(0);
            $("#extra_bed_price_"+no).val(0);
            $("#extra_person_"+no).val(0);
            $("#extra_person_charge_"+no).val(0);
            $("#room_no_"+no).val(0);
            $("#display_room_no_"+no).text('');  
            calculate_total_room_tarrif(no);          
        }
    });

        // we need to write a jquery code to add and remove a css class by using toggle class..
        // this will be used to select and deselect a room number..
        $(document).on('click', '.room_number_bg', function(){
            // get unique room id or get the id for clicked fileds..
            var room_number = $(this).attr('id');
//          $("#"+room_number).removeClass("btn-default");
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
         //var no=$('#no_of_room').val();
         //alert(no);
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
 $("#cancel_room").click(function(){
            $("#net_rate_"+no).val(0);
            $("#no_of_rooms_"+no).val(0);
            $("#extra_bed_"+no).val(0);
            $("#extra_bed_price_"+no).val(0);
            $("#extra_person_"+no).val(0);
            $("#extra_person_charge_"+no).val(0);
            $("#room_no_"+no).val(0);
            $("#display_room_no_"+no).text('');
             calculate_total_room_tarrif(no);
            });

$(document).on('keyup', '.calculate_room_tarrif', function(){

        calculate_total_room_tarrif(no);// calculate total room price after change of price..

    });

$(document).on('keyup', '.calculate_total_amount', function(){

        calculate_total_room_tarrif(no);// calculate total room price after change of price..

    });



$("#send_invoice_button").click(function(){
    var status=$('#send_invoice_form').valid();
    var no_of_room_rows=$('#no_of_room').val();
    var no_of_rooms_status=true;
    var net_rate_status=true;

    for(var i=1;i <= no_of_room_rows; i++)
    {
        var no_of_rooms=$('#no_of_rooms_'+i).val();
        var net_rate=$('#net_rate_'+i).val();
        if( (no_of_rooms == 0 || no_of_rooms < 1 ) && (net_rate == 0 || net_rate < 0) ) {  swal("","Please select atleast one room number , Room Net Rate can't be 0 value.","error");  
        $('#no_of_rooms_'+i).focus(); no_of_rooms_status=false;
        $('#net_rate_'+i).focus(); net_rate_status=false; }

        if( (no_of_rooms == 0 || no_of_rooms < 1 ) && (net_rate != 0 || net_rate > 0 )) {  swal("","Please select atleast one room number.","error");  $('#no_of_rooms_'+i).focus(); no_of_rooms_status=false;}
        if( (net_rate == 0 || net_rate < 0 ) && (no_of_rooms != 0 || no_of_rooms > 1 ) ) {  swal("","Room Net Rate can't be 0 value.","error");  $('#net_rate_'+i).focus(); net_rate_status=false;}
    }

    if(status==true  && no_of_rooms_status==true && net_rate_status ==true){
    var formdate=$('#send_invoice_form').serialize();
        $.ajax({
             url:  base_url+"/invoice/invoice_send",
             type: "POST",
             data: formdate,
             dataType: 'json',
             success: function (data) { 
            if(data.status=="success")  {
            $('#send_invoice_form')[0].reset();
            //$('#send_invoice_form').serialize();

             $('#to_email').val(data.guest_email);
             $('#cc_email').val(data.invoice_cc_email);
             $('#bcc_email').val(data.invoice_bcc_email);
             $('#email_subject').val(data.invoice_subject_line);
             $('#booking_reference').val(data.booking_reference);
             $('#hotel_name').val(data.hotel_name);
             $('#hotel_guest_name').val(data.hotel_guest_name);

             $('#email_message').code(data.invioce_bill);

             $('#send-invoice-modal').modal('show');
             }
             else
             {
             	swal("","Booking not done.","error");
             }
             // var redirect_url=base_url+"/invoice/index/invoice_send_sucess/";
             // window.location.href = redirect_url;
             //$('#invoice_message').html('You have successfully created the invoice - Invoice for '+data+'.'); 
             //$('#invoice_message').show();//alert(data);  -
             },error: function (xhr, ajaxOptions, thrownError) {alert("ERROR:" + xhr.responseText+" - "+thrownError);}
             ,async: false
          });
 
    }  

});
// write a funcion to send email to guest modal...
	$("#send_email_to_guest_button").click(function(){

		$('#send_invoice_form')[0].reset();
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
	 			url:base_url+"/invoice/send_guest_email/",
	 			success:function(return_data){
	 				if(return_data == "OK"){ // success
       					swal("", "Your Email has been sent to the guest.", "success");
       					$("#send-invoice-modal").modal('toggle');
                        window.location.reload();
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


$(document).on('click', '.convert_to_booking', function(){
var booking_id=$(this).attr('id');
	swal({
	    title: "Are you sure?",
	    text: "This will convert the Invoice entry into a booking",   
	    type: "warning",
	    showCancelButton: true,
	    confirmButtonColor: "#DD6B55",
	    confirmButtonText: "Yes, make booking!",   
	    closeOnConfirm: false
	     }, function (isConfirm) {
 
	    if (!isConfirm) return;

        $.ajax({
         url:  base_url+"/invoice/converttobooking",
         type: "POST",
         data: {booking_id:booking_id},
         success: function (data) { 
        swal("Done!", "Your invoice has been converted into a booking. Please check Booking calendar.", "success"); 
        window.location.reload();
         },error: function (xhr, ajaxOptions, thrownError) {   swal("Error!", "Please try again", "error"); }
         ,async: false
       });
    });

});

$(document).on('click', '.re_send_invoice', function(){
var id=$(this).attr('id');
var idsplit=id.split('_');
var booking_id=idsplit[0];
var invoice_send_id=idsplit[1];

    swal({
        title: "Are you sure?",
        text: "This will re-send invoice",   
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",   
        closeOnConfirm: true
         }, function (isConfirm) {
 
        if (!isConfirm) return;

        $.ajax({
        url:  base_url+"/invoice/print_invoice_bill/"+booking_id+'/'+invoice_send_id,
        type: "POST",
        dataType: 'json',
        data: {booking_id:booking_id,invoice_send_id:invoice_send_id},
         success: function (data) { 
        if(data.status=="success")  {
             $('#to_email').val(data.guest_email);
             $('#cc_email').val(data.invoice_cc_email);
             $('#bcc_email').val(data.invoice_bcc_email);
             $('#email_subject').val(data.invoice_subject_line);
             $('#booking_reference').val(data.booking_reference);
             $('#hotel_name').val(data.hotel_name);
             $('#hotel_guest_name').val(data.hotel_guest_name);

             $('#email_message').code(data.invioce_bill);

             $('#send-invoice-modal').modal('show');
             }
             else
             {
                swal("","Please try again.","error");
             }
         },error: function (xhr, ajaxOptions, thrownError) {   swal("Error!", "Please try again", "error"); }
         ,async: false
       });
   
    });

});

$(document).on('click', '.delete_invoice_and_booking', function(){
var id=$(this).attr('id');
var idsplit=id.split('_');
var booking_id=idsplit[0];
var invoice_send_id=idsplit[1];

    swal({
        title: "Are you sure?",
        text: "This will Delete Booking & Invoice. Are you Sure?",   
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",   
        closeOnConfirm: true
         }, function (isConfirm) {
 
        if (!isConfirm) return;

        $.ajax({
        url:  base_url+"/invoice/delete_invoice_booking/"+booking_id+'/'+invoice_send_id,
        type: "POST",
        data: {booking_id:booking_id,invoice_send_id:invoice_send_id},
         success: function (data) {
        swal("Done!", "Your Booking & Invoice has been Deleted. Please check Booking calendar.", "success"); 
        window.location.reload(); 
         },error: function (xhr, ajaxOptions, thrownError) {   swal("Error!", "Please try again", "error"); }
         ,async: false
       });
   
    });

});




}(window.jQuery);
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}
function calculate_total_room_tarrif(no){
        // now we need to calculate the total room tarrif cost...
        // it will be based on net rate * total no of selected rooms * no of day/night stayed in hotel +
        var checkin_date = $('#checkin_date').val();
        var checkout_date = $('#checkout_date').val();
        var net_rate = $("#net_rate_"+no).val();
        var extra_bed = $("#extra_bed_"+no).val();
        var extra_bed_price = $("#extra_bed_price_"+no).val();
        var extra_person = $("#extra_person_"+no).val();
        var extra_person_charge = $("#extra_person_charge_"+no).val();
        var no_of_rooms = $("#no_of_rooms_"+no).val();

        var service_tax = 0;
        var service_charge = 0;
        var discount_amount = $("#discount_amount").val();
        if( discount_amount =="") {discount_amount=0;}

        var advance = $("#advance").val();
        var no_of_room = $("#no_of_room").val();
        var total_room_tariff = 0;
        var total_amount = 0;
        var grand_total=0
        var tax_amount  = $("#tax_amount").val();
        if( tax_amount =="") {tax_amount=0;}


        if(checkin_date != "" && checkout_date != "" && typeof(net_rate) != "undefined" && net_rate != "" && no_of_room != "" && typeof(no_of_room) != "undefined"){          
           
            for (i = 1; i <= no_of_room; i++) { 
                // we need to write a jquery code to get the date differences...
                var stay_date_from = $('#checkin_date').datepicker("getDate");
                var stay_date_to = $('#checkout_date').datepicker("getDate");

                var no_of_day = (stay_date_to - stay_date_from) / (1000 * 60 * 60 * 24);
                net_rate = $("#net_rate_"+i).val();
                no_of_rooms = $("#no_of_rooms_"+i).val();
                extra_bed = $("#extra_bed_"+i).val();
                extra_bed_price = $("#extra_bed_price_"+i).val();
                extra_person = $("#extra_person_"+i).val();
                extra_person_charge = $("#extra_person_charge_"+i).val();

                if(typeof(net_rate) != "undefined" && net_rate != "" && no_of_rooms != "" && typeof(no_of_rooms) != "undefined") {
                    total_room_tariff = total_room_tariff + (net_rate * no_of_rooms * no_of_day);
                    
                    if(extra_bed != "" && extra_bed != 0 && extra_bed_price != "" && extra_bed_price != 0 ){
                        total_room_tariff = total_room_tariff + (extra_bed * extra_bed_price * no_of_day);
                    } 
                    if(extra_person != "" && extra_person != 0 && extra_person_charge != "" && extra_person_charge != 0 ){
                        total_room_tariff = total_room_tariff + (extra_person * extra_person_charge * no_of_day);
                    } 


                    if($.isNumeric(total_room_tariff)){
                        $("#total_room_tariff").val(total_room_tariff);


                        if(discount_amount != "" && discount_amount != 0  ){
                            
                                // discount amount must not be more than total room tarrif....
                                if(parseFloat(discount_amount) <= parseInt(total_room_tariff))
                                    discount_amount = parseFloat(discount_amount);
                                else{
                                    discount_amount=0;
                                    swal("","Please check discount amount value. It must not be more than total room tarrif","error");              
                                    $("#discount_amount").val('');
                                    $("#discount_amount").focus();
                                }

                        } 

                        if(discount_amount != "" && discount_amount != 0 )
                            total_amount = parseFloat(tax_amount) + parseFloat(total_room_tariff) - parseFloat(discount_amount) ;
                        else
                            total_amount = parseFloat(tax_amount) + parseFloat(total_room_tariff);                                  

                         $("#grand_total").val((parseFloat(total_amount).toFixed(2)));
                         grand_total=parseFloat(total_amount);
                        if(advance != "" && advance != 0 && advance < grand_total){
                            due_amount = grand_total - parseInt(advance);
                            $("#due").val(parseFloat(due_amount).toFixed(2));
                        } else if(advance > grand_total){
                            $("#due").val(parseFloat(grand_total).toFixed(2));
                            swal("","Please check advance amount value.","error")
                            $("#advance").val('');
                            $("#advance").focus();
//                                  return false;
                        }else {
                            $("#due").val(parseFloat(grand_total).toFixed(2));                        
                        }   
                    }
                }
            }           
        }

    }
function remove_extra_row()
{
var add_room_id=$('#no_of_room').val();
for (i = 2; i <= add_room_id; i++) { 
$('#room_details_row_'+i).remove();
}
$('#room_id_1').html('');
$("#net_rate_1").val(0);
$("#no_of_rooms_1").val(0);
$("#extra_bed_1").val(0);
$("#extra_bed_price_1").val(0);
$("#extra_person_1").val(0);
$("#extra_person_charge_1").val(0);
$("#room_no_1").val(0);
$("#display_room_no_1").text(''); 
$('#no_of_room').val(1);
}
// function validateEmail(field) {
//     var regex=/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i;
//     return (regex.test(field)) ? true : false;
// }

// function validateMultipleEmailsCommaSeparated(value) {
//     var result = value.split(",");
//     for(var i = 0;i < result.length;i++)
//     if(!validateEmail(result[i])) 
//             return false;           
//     return true;
// }
