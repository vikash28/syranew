!function($) {
    "use strict";

    var FormWizard = function() {};

       function get_status_of_form_basic(formid,position){

    if(formid !="") {
    var flag=1; 

        if(position ==1)
        {
            var url='http://localhost/frontdesk/wizard/check_value_insert_table' 
            $.ajax({
            type: "POST",
            dataType: "json",
            url: url,
            data: {formid:formid,position:position}, // serializes the form's elements.
            success: function(data)
            {
            $('#restaurant_name').val(data[0]["pos_bill_restaurant_name"]);
            $('#restaurant_phone').val(data[0]["pos_bill_restaurant_phone"]);
            $('#restaurant_address').val(data[0]["pos_bill_restaurant_address"]);
            $('#vat_value').val(data[0]["pos_bill_vat_value"]);
            $('#alcholic_beverages_vat').val(data[0]["pos_bill_alcholic_beverages_vat"]);
            $('#service_charge').val(data[0]["pos_bill_service_charge_value"]);
            $('#service_tax').val(data[0]["pos_bill_service_tax_value"]);
            $('#room_service_charge').val(data[0]["pos_bill_room_service_charge_value"]);
            $('#vat_number').val(data[0]["pos_bill_vat_number_value"]);
            $('#tin_number').val(data[0]["pos_bill_tin_number_value"]);
            $('#service_tax_number').val(data[0]["pos_bill_service_tax_number"]);
            var vat_flag=data[0]["pos_bill_vat_flag"];
            var service_tax_flag=data[0]["pos_bill_service_tax_flag"];
            var tin_number_flag=data[0]["pos_bill_tin_number_flag"];
            var vat_number_flag=data[0]["pos_bill_vat_number_flag"];
            var date_time_flag=data[0]["pos_bill_date_time_flag"];
            var bill_number_flag=data[0]["pos_bill_number_flag"];
            var table_number_flag=data[0]["pos_bill_table_number_flag"];
            var room_number_flag=data[0]["pos_bill_room_number_flag"];
            var kot_number_flag=data[0]["pos_bill_kot_flag"];
            var token_number_flag=data[0]["pos_bill_token_number_flag"];
            var service_charge_for_room_service_flag=data[0]["pos_bill_room_service_charge_flag"];
            //alert(vat_flag);
            if(vat_flag == 1) { $('#vat_flag').attr('checked', true);  }
            if(service_tax_flag == 1) { $('#service_tax_flag').attr('checked', true);  }
            if(tin_number_flag == 1) { $('#tin_number_flag').attr('checked', true);  }
            if(vat_number_flag == 1) { $('#vat_number_flag').attr('checked', true);  }
            if(date_time_flag == 1) { $('#date_time_flag').attr('checked', true);  }
            if(bill_number_flag == 1) { $('#bill_number_flag').attr('checked', true);  }
            if(table_number_flag == 1) { $('#table_number_flag').attr('checked', true);  }
            if(room_number_flag == 1) { $('#room_number_flag').attr('checked', true);  }
            if(kot_number_flag == 1) { $('#kot_number_flag').attr('checked', true);  }
            if(token_number_flag == 1) { $('#token_number_flag').attr('checked', true);  }
            if(service_charge_for_room_service_flag == 1) { $('#service_charge_for_room_service_flag').attr('checked', true);  }

            }
            });

        }
        else
        {
                var url=$('#'+formid).attr('action');  
                $.ajax({
                type: "POST",
                url: url,
                data: $('#'+formid).serialize(), // serializes the form's elements.
                success: function(data)
                {
                if(data == '0') { flag=0;}  // show response from the php script.
                },
                 async: false
                }); 
            
        }
    }
    return flag;
    }

    function finished_wizard()
    {
        var base_url = $.cookie("base_url");

		$.ajax({
		url: base_url+"wizard/updateWizardStatus",
		type: 'POST',
		success:function(data)
		{ 
			         if(data=='sucess') {  window.location.href=base_url+'posdashboard/';}
		}      
		});
    
    }    
 
 //creates vertical form
    FormWizard.prototype.createVertical = function() {
        var flag=1;
        var formidint='basic';
        var flag=get_status_of_form_basic(formidint,1);
        $('#wizard_vertical').steps({
            headerTag: "h3",
            bodyTag: "section",
            transitionEffect: "fade",
            stepsOrientation: "vertical",
            onStepChanging: function (event, currentIndex, newIndex) {
                //if(currentIndex == 1) { alert();$('.wizard .content').css("height", '25em');}
                var formid=$('#wizard_vertical-p-'+currentIndex).children().closest("form").attr('id');
                var newformIndex=$('#wizard_vertical-p-'+newIndex).children().closest("form").attr('id');

                if(  formid  =="basic" ){
                    var status=$('#'+formid).valid();
                    if(status ==false){
                    $('#'+formid).validate().settings.ignore = ":disabled,:hidden";
                    return $('#'+formid).valid();
                    }
                    else
                    {
                    var flag=get_status_of_form_basic(formid,0);  
                    } 
                }
                return true;

            },
            onFinishing: function (event, currentIndex) {
            	finished_wizard();    
            },
            onFinished: function (event, currentIndex) {
            	alert('Thanks');
            }
        });
       return true;
    },
    FormWizard.prototype.init = function() {
        //initialzing various forms
        this.createVertical();

    },
    //init
    $.FormWizard = new FormWizard, $.FormWizard.Constructor = FormWizard
}(window.jQuery),

//initializing 
function($) {
    "use strict";
    $.FormWizard.init()
}(window.jQuery);