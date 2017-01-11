

$("#cancel_all").change(function () {
    $("#cancel_table").find("input:checkbox").prop('checked', $(this).prop("checked"));
});

$(document).ready(function(){
        $("#card_no").mask("9999-9999-9999-9999"); // 
        $("#expiry_date").mask("99/99"); //


        var base_url = $.cookie("base_url");

        $("#cheque_details").hide();
        $("#dd_details").hide();
        $("#chq_details").hide();   
        $("#cc_details").hide();
        $("#neft_details").hide();
        $("#bank_details").hide();

        $('#payment_type').change(function() {
            //alert("change on select..")
            if($('#payment_type').val() != ""){
                /// on the basis of hotel id we need to get its meal plan type and room type for that hotel...
                var payment_type = $('#payment_type').val();

                if(payment_type == "cash" || payment_type == "payment_by_cash" )
                    $("#cheque_details").hide();                    
                    $("#dd_details").hide();
                    $("#chq_details").hide();
                    $("#cc_details").hide();
                    $("#neft_details").hide();  
                    $("#bank_details").hide();    
                
                if(payment_type == "cheque" || payment_type == "demand_draft" || payment_type == "credit_card" || payment_type == "debit_card" || payment_type == "neft" || payment_type == "rtgs"){
                    //$("#bank_details_central_reservation").show();
                    if(payment_type == "cheque" ){
                        $("#cheque_details").show();
                        $("#chq_details").show();
                        $("#bank_details").show();
                        $("#dd_details").hide();
                        $("#cc_details").hide();
                        $("#neft_details").hide();      
                    }
                    if(payment_type == "demand_draft" ){
                        $("#cheque_details").show();
                        $("#dd_details").show();
                        $("#bank_details").show();
                        $("#chq_details").hide();
                        $("#cc_details").hide();
                        $("#neft_details").hide();
                             
                    }
                    if(payment_type == "credit_card" || payment_type == "debit_card" ){
                        $("#cheque_details").hide();
                        $("#dd_details").hide();
                        $("#chq_details").hide();
                        $("#cc_details").show();
                        $("#neft_details").hide(); 
                        $("#bank_details").hide();      
                    }
                    if(payment_type == "neft" || payment_type == "rtgs" ){
                        $("#cheque_details").hide();
                        $("#dd_details").hide();
                        $("#chq_details").hide();
                        $("#cc_details").hide();
                        $("#neft_details").show(); 
                        $("#bank_details").show();     
                    }
                }
                                        

            } else {
            
                $("#cheque_details").hide();                    
                $("#dd_details").hide();
                $("#chq_details").hide();
                $("#cc_details").hide();
                $("#neft_details").hide(); 
                $("#bank_details").hide();     
            }
            
        });

});

function markUnmarkRoomNumber(s){
$(s).parent().parent().parent().parent().find(".cancel_stay_date").prop('checked',false);
}

function markUnmarkStaydate(s){
//$(s).parent().parent().parent().find(".cancel_room_number").prop('checked',false);
$(s).parent().parent().parent().parent().find(".cancel_room_number").prop('checked',false);
}

 $("#cancelBooking").click(function() {
                 
                var refund_amount = $("#refund_amount").val();
                var advance = $("#advance").text();
                var checked_cancel_stay_date = $("input.cancel_stay_date:checked").length;
                var checked_cancel_room_number = $("input.cancel_room_number:checked").length;
                //alert(checked_cancel_stay_date);
                //alert(checked_cancel_room_number);
              

                if((checked_cancel_room_number>0)||(checked_cancel_stay_date>0)){

                    if (refund_amount=="") {

                            swal("Please enter refund amount");
                            return false;
                    };

                    //alert(parseFloat(refund_amount) );
                    //alert(parseFloat(advance));

                    if (parseFloat(refund_amount) > parseFloat(advance)) {
                        
                            swal("Refund amount can`t be more than Advance amount.","Advance is "+advance+" and you entered refund "+refund_amount+" ");
                            return false;
                    };

                    
                    dynamic = $("#collectionPt").val();
                    // alert(dynamic);
                         if(dynamic==""){
                           swal("Collection point or Payment type not selected ");   
                           return false;
                      }   

                    payment_type = $("#payment_type").val();
                    // alert(dynamic);
                         if(payment_type==""){
                           swal("Payment type not selected ");   
                           return false;
                      }   

                 
                    $( "#cancelform" ).submit();
                                  
            } else {

                swal("Please select at least one date or room for cancellation");
                return false;
            }           
            
       });
