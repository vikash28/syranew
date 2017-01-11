
var base_url;

$(function(){
    
base_url = $.cookie("base_url");


$("#guestArrivalsDatatable").dataTable({ 
        "paging":   true,
        "pagingType": "simple_numbers",
        "iDisplayLength":3,
        "lengthMenu": [ 3, 10, 25, 50, 75, 100 ]
    });



}); // end of ready

function fetchConnectedOtaDetails(s){
   $("#dashboard_ota_total_bookings").html('<center><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></center>');
    $.post(base_url+"index.php/channel_manager/otaTotalBookingsDashboard",{"hotel_id":$(s).val()},function(data){
     
     $("#dashboard_ota_total_bookings").html(data);   
        
    });
                                    }

function fetchLatestOtaBookings(){

//$("#dashboard_ota_total_bookings").html('<center><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></center>');
    $.post(base_url+"index.php/channel_manager/fetchLatestOtaBookings",{},function(data){
     
     $("#latestOtaBookings").html(data);   
        
    });
       
                                }    
    
  setInterval(function(){fetchLatestOtaBookings();}, 3000);  




