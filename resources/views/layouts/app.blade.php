<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{env('APP_NAME')}}</title>
    <link rel="stylesheet" href="{{asset('assets/calendar/fullcalendar.bundle.css')}}">
    <link rel="stylesheet" href="{{asset('assets/calendar/plugins.bundle.css')}}">
    <link rel="stylesheet" href="{{asset('assets/calendar/style.bundle.css')}}">
    <link rel="stylesheet" href="{{asset('assets/css/style.css')}}">

</head>
<body>

<div id="kt_app_content" class="app-content  flex-column-fluid ">

@include('calendar.calendar')

@include('modal.modal')
<!-- partial -->


</div>

<script src="{{asset('assets/calendar/plugins.bundle.js')}}"></script>
<script src="{{asset('assets/calendar/scripts.bundle.js')}}"></script>
<script src="{{asset('assets/calendar/fullcalendar.bundle.js')}}"></script>
<script src="{{asset('assets/calendar/calendar.js')}}"></script>
</body>
</html>
