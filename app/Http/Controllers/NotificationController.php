<?php

namespace App\Http\Controllers;

use Carbon\Carbon;

use App\Models\Notification;

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
                'start' => Carbon::parse($notification->event_date . ' ' . $notification->event_start_time)->format('Y-m-d\TH:i:s'),
                'end' => Carbon::parse($notification->event_date . ' ' . $notification->event_end_time)->format('Y-m-d\TH:i:s'),
                'description' => $notification->event_description ?? 'No description',
                'location' => $notification->building->name . ', ' . $notification->room->name,
                'color' => $color,
                'name' => $notification->fullname,
                'phone_number' => $notification->phone_number,
                'email' => $notification->email,

            ];
        });

        return response()->json([
            'events' => $events,
        ]);
    }


}
