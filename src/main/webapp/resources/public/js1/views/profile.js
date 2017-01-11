
$('#rpass').on('keyup', function () {
    if ($(this).val() == $('#pass').val()) {
        $('#message').html('Passwords match').css('color', 'green');
    } else $('#message').html('Passwords do not match').css('color', 'red');
});
