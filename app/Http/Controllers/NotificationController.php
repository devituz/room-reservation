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
            // Define colors based on the 'is_color' field
            $colors = [
                'red' => '#b81212',      // Qizil rang
                'yellow' => '#f9c100',   // Sariq rang
                'green' => '#28a745',    // Yashil rang
            ];

            $color = $colors[$notification->is_color] ?? '#28a745';

            return [
                'title' => $notification->event_name, // Event title
                'start' => Carbon::parse($notification->event_date . ' ' . $notification->event_start_time)->format('Y-m-d\TH:i:s'), // Date and time in the desired format
                'end' => Carbon::parse($notification->event_date . ' ' . $notification->event_end_time)->format('Y-m-d\TH:i:s'), // Date and time in the desired format
                'description' => $notification->event_description ?? 'No description', // Event description, default to 'No description' if null
                'location' => $notification->building->name . ', ' . $notification->room->name. ', ' . $notification->room->number,
                'color' => $color, // Add color based on 'is_color'
            ];
        });

        return response()->json([
            'events' => $events, // Return events in the format you need
        ]);
    }


}
