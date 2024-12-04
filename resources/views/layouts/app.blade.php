<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{env('APP_NAME')}}</title>
    <link rel="stylesheet" href="{{asset('assets/calendar/fullcalendar.bundle.css')}}">
    <link rel="stylesheet" href="{{asset('assets/calendar/plugins.bundle.css')}}">
    <link rel="stylesheet" href="{{asset('assets/calendar/style.bundle.css')}}">
    <link rel="stylesheet" href="{{asset('assets/css/style.css')}}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

</head>
<body>

<div id="kt_app_content" class="app-content  flex-column-fluid ">

@include('calendar.calendar')

@include('modal.modal')
<!-- partial -->


</div>
<script>
    document.addEventListener("DOMContentLoaded", () => {
        const modalId = "kt_modal_view_event";
        const cssHref = "{{ asset('assets/css/style.css') }}";

        const modalElement = document.getElementById(modalId);
        const cssLink = Array.from(document.querySelectorAll('link')).find(link => link.href.includes(cssHref));


        modalElement.addEventListener("show.bs.modal", () => {
            if (cssLink) {
                cssLink.disabled = true;
            }
        });

        modalElement.addEventListener("hidden.bs.modal", () => {
            if (cssLink) {
                cssLink.disabled = false; // CSS faylni yoqish
            }
        });
    });

</script>

<script src="{{asset('assets/calendar/plugins.bundle.js')}}"></script>
<script src="{{asset('assets/calendar/scripts.bundle.js')}}"></script>
<script src="{{asset('assets/calendar/fullcalendar.bundle.js')}}"></script>
<script src="{{asset('assets/calendar/calendar.js')}}"></script>
</body>
</html>
