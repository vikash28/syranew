
var base_url = "";
$(function(){
    $.noty.defaults.killer = true; // will kill default attributes of noty
    $("#accordion").hide(); // hide the accordion UI first on page load and show when HTML data is inserted
    base_url = $.cookie("base_url");   
   
   
  $.datepicker.setDefaults({
     "changeMonth" : true,
     "changeYear" : true,
     "dateFormat": "dd M yy",
     "minDate":"0",
     "maxDate":"+30",
}); 
   
   
   
   
$('#start').datepicker({
      onSelect: function(selectedDate) {
            $('#end').datepicker('option', 'minDate', selectedDate || $("#start").val());
            getHotelDetails($('#hotelSelect'));
      }
                         });
$('#end').datepicker({
      onSelect: function(selectedDate) {
            $('#start').datepicker('option', 'maxDate', selectedDate || $("#end").val());
            getHotelDetails($('#hotelSelect'));
      }
});
   
   
}); // end of ready

 
!function($) {
    "use strict";
    var startDate=$("#start").val();
    var endDate=$("#end").val();
    var dt_rage=startDate + "- "+ endDate;

    var SweetAlert = function() {};

    //examples 
    SweetAlert.prototype.init = function() {
        

    //Warning Message
    $('#sa-warning').click(function(){
        swal({   
            title: "Are you sure?",   
            text: "This will Push Room Inventory to MakeMyTrip, Cleartrip and Booking.com for the date range "+dt_rage,   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "Yes, Push it!",   
            closeOnConfirm: false 
        }, function(){   
            swal("Done!", "Room Inventory has been pushed.", "success"); 
        });
    });

    },
    //init
    $.SweetAlert = new SweetAlert, $.SweetAlert.Constructor = SweetAlert
}(window.jQuery),

//initializing 
function($) {
    "use strict";
    $.SweetAlert.init()
}(window.jQuery);


function getHotelDetails(s){
    var startDate=$("#start").val();
    var endDate=$("#end").val();
    $("#startDate").val(startDate);
    $("#endDate").val(endDate);
    var dt_rage=startDate + "- "+ endDate;

    $("#dt_rage").html(dt_rage);

    var hotel_id= $(s).val();
    $("#hotel_id").val(hotel_id);    
    if (hotel_id!=""){
  $.ajax({
            url:base_url+"channel_manager/getOtaListforratepush",
            type: 'POST',
            data: {'hotel_id': hotel_id}, 
            dataType: "json", 
            success:function(data)
            { 
                $("#otalist").html(data.item);
                $("#ota").val(data.ota_list);
                
              
            }      
        });


}
                          }


function getHotelDetailsforAllDates(s){
  // this function will fetch hotel details like rooms and connected OTAS to the 1st accordion from controller 
 var hotel_id= $(s).val();    
 if (hotel_id!=""){ 
     
 $.post(base_url+"index.php/channel_manager/fetchforAlldatesPanel",
  {"hotel_id":hotel_id,},
  function(data){
    
     $("#allDatesPanel").html(data);
    
  }); // end of post   
 } else { $("#allDatesPanel").html("<center><H3>Select a hotel first</H3></center>"); }
    
}






function selectAll(s){
 // this will deal with the select all checkbox w.r.t the OTA PANEL. this same 
 // function will deal with all different OTA panels
 //alert();
  
 var status_ = $(s).is(":checked");
 if (status_==true){
  $(s).parent().parent().parent().parent().find("#otaList").find(".checkbox-inline").each(function(){
  $(this).find("input:checkbox").prop("checked",true);   
 });
  }else{
    $(s).parent().parent().parent().parent().find("#otaList").find(".checkbox-inline").each(function(){
  $(this).find("input:checkbox").prop("checked",false);   
 }); 
       }
    
}

function removeSelectAll(s){
  var stat = 0; // this will keep track whether all the supporting checkboxes are selected or not
  var total_checkboxes = 0;  // total checkboxes found
  var selected_checkboxes = 0;  // total selected checboxes
  // if selected checboxes equals to totalchecboxes then selectAll checkbox will be auto selected
  
  
  $(s).parent().parent().parent().parent().find("input:checkbox:first").prop("checked",false);
  $(s).parent().parent().parent().find(".otas").each(function(){
     $(this).find("input:checkbox").each(function(){
         total_checkboxes += 1;
       if($(this).is(":checked")){ selected_checkboxes += 1;  }         
     }); // end of each 
  }); // end of each

if(total_checkboxes==selected_checkboxes){ $(s).parent().parent().parent().parent().find("input:checkbox:first").prop("checked",true);}
}

    
function pushRoomInventoryAndSave(s){
    /*    
    swal({   
            title: "Are you sure?",   
            text: "This will Push Room Inventory to MakeMyTrip, Cleartrip and Booking.com for the date range 13th June-2016 - 15th June 2016",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "Yes, Push it!",   
            closeOnConfirm: false 
        }, function(){   
            swal("Done!", "Room Inventory has been pushed.", "success"); 
        });
   */
  pushInventoryForSpecificDates(s);
                                    }
 


function pushInventoryForAllDates(s){

//alert(validationNotificationsforAllDates(s));

if (validationNotificationsforAllDates(s)=="success"){  // do the validationa nd check for success return

var dateRange = $("#dateRange").val();
var startDate = dateRange.split("~")[0];
var endDate = dateRange.split("~")[1];
var room_details = "[";

$(s).parent().parent().find("#otaList .otas").each(function(){


    $(this).find("input:checkbox").each(function(){
   if($(this).is(":checked")){
   
var checkbox_val = $(this).val();
$(s).parent().parent().find("#roomtypelist .rooms_panel").each(function(){


room_details += '{"room_id":'+$(this).find(".roomid").val()+',"push_count":'+$(this).find("input:text").val()+',"startdate":"'+startDate+'","enddate":"'+endDate+'","cm_hotel_mapping_id":'+checkbox_val+'},';

});

                            }
        }); // end of sub each
                              
});



room_details = room_details.slice(",", -1); // remove last character
room_details += "]";

if(room_details.length>1){
 
 
   alert(room_details);  
             }
  

else { room_details = "";}

}  // if validation is successful only then the above codes will work

}


function pushInventoryForSpecificDates(s){
//alert($(s).parent().parent().parent().find());
if (validationNotificationsforSpecificDates(s)=="success"){
var room_details = "[";
$(s).parent().parent().parent().find("#contents").find(".differentdayspanel").each(function(){
 

$(this).find("#otaList").find(".otas").each(function(){

   $(this).find("input:checkbox").each(function(){
       var checkbox_val = $(this).val();

   if($(this).is(":checked")){     

$(this).parent().parent().parent().parent().parent().parent().parent().parent().find("#roomtypelist").find(".rooms_panel").each(function(){

room_details += '{"room_id":'+$(this).find(".roomid").val()+',"push_count":'+$(this).find("input:text").val()+',"startdate":"'+$(this).find(".date_").val()+'","enddate":"'+$(this).find(".date_").val()+'","cm_hotel_mapping_id":'+checkbox_val+'},';

});    
                            } // end of checked OTAS
             }); // end of sub each
                              
});   // end of each OTAS


}); // end of each days panel

room_details = room_details.slice(",",-1);
room_details += "]";

if(room_details.length>1){
    $.post(base_url+"index.php/channel_manager/inventory_push",{"json_data":room_details},function(data){
      alert(data);  
    }); // end of post
}
else { room_details = ""; alert(room_details);}

}
} // end of function








 //BELOW ARE THE TWO VALIDATION FUNCTIONS FOR SPECIFIC DATES AND FOR ALL DATES
 //===============================================================================
 //=========================================================
function validationNotificationsforAllDates(s){
 var stat=0;
 var isRoomPushValueProvided = "";
 var validationResult = "error";  // will return success or error if validation not succesfull
  
    $(s).parent().parent().parent().find("#otaList .otas").each(function(){


    $(this).find("input:checkbox").each(function(){
   if($(this).is(":checked")){
     stat = 1;  
                            }
        }); // end of sub each
                              
});

$(s).parent().parent().find("#roomtypelist .rooms_panel").each(function(){

if($.isNumeric($(this).find("input:text").val())==false){ isRoomPushValueProvided += $(this).find("label").text()+","; } 

});


if(stat==0){ //sweetAlert("Missing OTA", "OTA's not selected. Please select OTA's first.", "warning"); 
    noty({
    text: 'OTAs not selected. Please select OTAs first.',
    type: 'error',
    layout: 'bottomRight',
    theme: 'relax',
    timeout:12000
});
    validationResult = "error";       } else {
         
     if (isRoomPushValueProvided.length>1){          
    isRoomPushValueProvided = isRoomPushValueProvided.slice(",",-1);           
     noty({
    text: 'Invalid push values provided for '+isRoomPushValueProvided+' rooms',
    type: 'error',
    layout: 'bottomRight',
    theme: 'relax',
    timeout:12000
});          
      validationResult = "error";        }else {
  
  validationResult = "success"; 
                                               }     
           }   
 return validationResult;  
}



function validationNotificationsforSpecificDates(s){
 var stat=0;
 var isRoomPushValueProvided = "";
 var validationResult = "success";  // will return success or error if validation not succesfull
 var errorMessage = ""; 
 var date_ = ""; 
  $(s).parent().parent().parent().find("#contents").find(".differentdayspanel").each(function(){
    stat=0;
    errorMessage = "";
    date_ = "";
    isRoomPushValueProvided = "";
      $(this).find("#otaList").find(".otas").each(function(){

   $(this).find("input:checkbox").each(function(){
       if($(this).is(":checked")){     
        stat = 1;            } // end of checked OTAS
             }); // end of sub each
                              
});   // end of each OTAS

if (stat==0){ errorMessage = "Atleast one OTA must be selected.";}
$(this).find("#roomtypelist").find(".rooms_panel").each(function(){
if($.isNumeric($(this).find("input:text").val())==false){ isRoomPushValueProvided += $(this).find("label").text()+","; } 

date_ = $(this).find(".date_").val();
date_ = $.datepicker.formatDate('dd M yy', new Date(date_));
});    


if (isRoomPushValueProvided.length>1){          
    isRoomPushValueProvided = isRoomPushValueProvided.slice(",",-1); 
    isRoomPushValueProvided = "Invalid push value(s) provided for "+isRoomPushValueProvided+" room(s).";
    }
    
var notymessage = ' <div class="text-wrapper">'
           + '<div class="title" data-notify-html="title"><u><b>Inventory Push issue for '+date_+'</b></u></div>'
           + '<div class="text" data-notify-html="text"><br>'+errorMessage+"<br>"+isRoomPushValueProvided+'</div>'
           + '</div>'  
    
    
    if (errorMessage!=="" || isRoomPushValueProvided!==""){
    noty({
    text: notymessage,
    type: 'error',
    layout: 'bottomRight',
    theme: 'relax',
    maxVisible : 30,
    timeout:12000,
    
        });  
        validationResult = "error";                        } 


}); // end of each for .differentdayspanel

 return validationResult;  
}
// =============END OF VALIDATION FUNCTIONS
//=========================================================
//=========================================================