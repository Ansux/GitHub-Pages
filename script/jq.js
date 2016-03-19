$('#cateModal').on('hide.bs.modal', function () {
    $("form[name='cateForm']")[0].reset()
});

$('#blogModal').on('hide.bs.modal', function () {
    $("form[name='blogForm']")[0].reset()
});

$("body").scroll(function () {
    console.log('ddd');
});
