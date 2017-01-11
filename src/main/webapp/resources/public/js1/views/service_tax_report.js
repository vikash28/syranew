// Javascript for Tutorial Video

$(document).ready(function() {
  $(".youtube").each(function() {
    $(this).css('background-image', 'url(//i.ytimg.com/vi/' + this.id + '/hqdefault.jpg)');
    $(document).delegate('#' + this.id, 'click', function() {
      var iframe_url = "//www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
      if ($(this).data('params')) iframe_url += '&' + $(this).data('params');
      var iframe = $('<iframe/>', {'allowfullscreen':'allowfullscreen', 'frameborder': '0', 'src': iframe_url})
      $(this).append(iframe);
    });
  }); 

});

// JS for Service Tax report
jQuery(document).ready(function(){ 
var url = window.location;
var base_url = url.protocol + "//" + url.host + "/" + url.pathname.split('/')[1];

$("#to_date").datepicker({ dateFormat: 'dd-mm-yy'});
        $("#from_date").datepicker({ dateFormat: 'dd-mm-yy'}).bind("change",function(){
            var minValue = $(this).val();
            minValue = $.datepicker.parseDate("dd-mm-yy", minValue);
            minValue.setDate(minValue.getDate()+1);
            $("#to_date").datepicker( "option", "minDate", minValue );
        })

        // define a function which will clear all form filed data and reload the page ..
        $("#clear_form_date").click(function() {

            $("#from_date").val("");
            $("#to_date").val("");
            $("#bookingID").val("");
            $('#hotel_id option:selected').removeAttr('selected');
            //$('#hotel_id option:first').removeAttr('selected');
            window.location.reload(true);
        });


 $("#downloadReport").click(function() {
     $( "#csv" ).val(1);
     $( "#reportFrom" ).submit();
     $( "#csv" ).val('');
});

$("#printReport").click(function() {
    $( "#reportFrom" ).attr("target","_blank");
    $( "#reportFrom" ).attr("action",base_url+"/service_tax_report/print_report");
    $( "#reportFrom" ).submit();
    $( "#reportFrom" ).removeAttr("target");
    $( "#reportFrom" ).attr("action"," ");
});

 });
