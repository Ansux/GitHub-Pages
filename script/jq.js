$(function () {
    $('#cateModal').on('hide.bs.modal', function () {
        $("form[name='cateForm']")[0].reset()
    });

    $('#blogModal').on('hide.bs.modal', function () {
        $("form[name='blogForm']")[0].reset()
    });

//    $(window).scroll(function () {
//        if ($(window).scrollTop() != 0) {
//            $('.navbar').addClass('navbar-shadow');
//        } else {
//            $('.navbar').removeClass('navbar-shadow');
//        }
//    });
});