<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Event Status</title>
</head>
<body>
<p>Dear {{ $notification->fullname }},</p>
<p>Your event has been {{ $notification->is_approved }}. Below are the event details:</p><ul>
    <li><strong>Event Name:</strong> {{ $notification->event_name }}</li>
    <li><strong>Event Date:</strong> {{ $notification->event_date }}</li>
    <li><strong>Start Time:</strong> {{ $notification->event_start_time }}</li>
    <li><strong>End Time:</strong> {{ $notification->event_end_time }}</li>
    <li><strong>Building:</strong> {{ $notification->building_name }}</li>
    <li><strong>Room:</strong> {{ $notification->room_name }}</li>
    <li><strong>Organizer's Full Name:</strong> {{ $notification->fullname }}</li>
    <li><strong>Phone Number:</strong> {{ $notification->phone_number }}</li>
    <li><strong>Email:</strong> {{ $notification->email }}</li>
    <li><strong>Event Description:</strong> {{ $notification->event_description }}</li>
</ul>
<p>Thank you for choosing our services!</p>
</body>
</html>
