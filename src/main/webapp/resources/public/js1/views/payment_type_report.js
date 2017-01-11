    // check in and check out date picker...
        $("#to_booking_date").datepicker({ dateFormat: 'dd-mm-yy', maxDate : 0});
        $("#from_booking_date").datepicker({ dateFormat: 'dd-mm-yy', maxDate : 0}).bind("change",function(){
            var minValue = $(this).val();
            minValue = $.datepicker.parseDate("dd-mm-yy", minValue);
            minValue.setDate(minValue.getDate()+1);
            $("#to_booking_date").datepicker( "option", "minDate", minValue );
        })
        $("#download").click(function() {
            $("#csv").val(1);            
            $("#my_from").attr("action",$.cookie("base_url")+"payment_type_report/print_report");
            $("#my_from").submit();  
            $("#csv").val('');   
            $( "#my_from" ).removeAttr("target");
            $( "#my_from" ).attr("action"," ");         
        });

        $("#print").click(function() {
            $( "#my_from" ).attr("target","_blank");
            $("#csv").val(''); 
            $( "#my_from" ).attr("action",$.cookie("base_url")+"payment_type_report/print_report");
            $( "#my_from" ).submit();
            $( "#my_from" ).removeAttr("target");
            $( "#my_from" ).attr("action"," ");
        });

        // define a function which will clear all form filed data and reload the page ..
        $("#clear_form_date").click(function() {
            $("#from_booking_date").val("");
            $("#to_booking_date").val("");
            $('#hotel_id option:selected').removeAttr('selected');
            $('#payment_type option:selected').removeAttr('selected');
            window.location.reload(true);
        });

// write a validation which will accept only numbers in fileds values. But 0 shouldn't be allowed at 1st place.
        
        $(document).on('keypress', '.only_digit', function(e){ 
            if (this.value.length == 0 && e.which == '48' ){
              return false;
            } else if (e.which < 48 || e.which > 57 ){
                return false;          
            }
        });