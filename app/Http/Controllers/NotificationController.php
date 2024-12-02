<?php

namespace App\Http\Controllers;

use Carbon\Carbon;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function getNotifications()
    {
        // Get only the notifications where 'is_approved' is 'approved'
        $notifications = Notification::where('is_approved', 'approved')->get();

        // Transform the notifications into the required format
        $events = $notifications->map(function ($notification) {
            return [
                'title' => $notification->event_name, // Event title
                'start' => Carbon::parse($notification->event_date . ' ' . $notification->event_start_time)->format('Y-m-d\TH:i:s'), // Date and time in the desired format
                'end' => Carbon::parse($notification->event_date . ' ' . $notification->event_end_time)->format('Y-m-d\TH:i:s'), // Date and time in the desired format
                'description' => $notification->event_description ?? 'No description', // Event description, default to 'No description' if null
                'location' => 'Room ' . $notification->room->number . ' in the ' . $notification->room->name . ' of the ' . $notification->building->name . ' building.',
            ];
        });

        return response()->json([
            'events' => $events, // Return events in the format you need
        ]);
    }

}
