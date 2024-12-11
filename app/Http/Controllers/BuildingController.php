<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Building;
use Carbon\Carbon;
use Illuminate\Support\Facades\Response;


class BuildingController extends Controller
{
    /**
     * Display a listing of the resource.
     */





    public function store(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'event_date' => 'required|date',
            'event_start_time' => 'required|date_format:H:i',
            'event_end_time' => 'required|date_format:H:i|after:event_start_time',
            'building_id' => 'required|exists:buildings,id',
            'room_id' => 'required|exists:rooms,id',
            'fullname' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'event_name' => 'required|string|max:255',
            'event_description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            // Get the first error message from the validation errors
            $firstError = $validator->errors()->first();

            // Return the error response in the desired format
            return response()->json([
                'error' => $firstError,
            ], 422);
        }

        // Check if an approved notification with the same event date, time, building, and room already exists
        $existingNotification = Notification::where('event_date', $request->input('event_date'))
            ->where('is_approved', 'approved') // Check only approved notifications
            ->where('building_id', $request->input('building_id')) // Check for the same building
            ->where('room_id', $request->input('room_id')) // Check for the same room
            ->where(function ($query) use ($request) {
                // Check if the new event's time range overlaps with any existing event's time range
                $query->where(function ($query) use ($request) {
                    $query->where('event_start_time', '<', $request->input('event_end_time'))
                        ->where('event_end_time', '>', $request->input('event_start_time'));
                });
            })
            ->first();

        if ($existingNotification) {
            // If an approved notification already exists for the given date, time, building, and room, return an error response
            return response()->json([
                'error' => 'An approved event already exists in the schedule for this building (' . $request->input('building_id') .
                    ') and room (' . $request->input('room_id') . ') on this date (' . $request->input('event_date') .
                    ') and time (' . $request->input('event_start_time') . ' - ' . $request->input('event_end_time') . ').',
            ], 409); // Conflict error
        }



        // Store the validated data in the database
        try {
            $notification = Notification::create([
                'event_date' => $request->input('event_date'),
                'event_start_time' => $request->input('event_start_time'),
                'event_end_time' => $request->input('event_end_time'),
                'building_id' => $request->input('building_id'),
                'room_id' => $request->input('room_id'),
                'fullname' => $request->input('fullname'),
                'phone_number' => $request->input('phone_number'),
                'email' => $request->input('email'),
                'event_name' => $request->input('event_name'),
                'event_description' => $request->input('event_description'),
                'is_approved' => 'pending', // Default value
            ]);

            // Return a success response
            return response()->json([
                'message' => 'Notification created successfully!',
                'data' => $notification
            ], 201);
        } catch (\Exception $e) {
            // Return an error response if there is an exception
            return response()->json([
                'error' => 'Sizning so\'rovingizni bajarishda xatolik yuz berdi.',
                'message' => $e->getMessage()
            ], 500); // Internal Server Error
        }
    }





    public function getNotificationsByDate(Request $request)
    {
        // Sana parametrini olish
        $date = $request->input('date');

        // Bino va xonalarni notifications bilan birga olish
        $buildings = Building::with(['rooms' => function ($query) use ($date) {
            $query->with(['notifications' => function ($query) use ($date) {
                $query->whereDate('event_date', $date)->where('is_approved', 'approved');
            }]);
        }])->get();

        $result = $buildings->map(function ($building) use ($date) {
            $rooms = $building->rooms->map(function ($room) use ($date) {
                // Ishlash vaqti chegaralari
                $startOfDay = Carbon::parse("$date 08:00:00");
                $endOfDay = Carbon::parse("$date 20:00:00");

                $available = [];
                $unavailable = [];

                // Notificationsni olish
                $notifications = $room->notifications;

                if ($notifications->isEmpty()) {
                    // Agar notifications yo'q bo'lsa, butun kun bo'sh
                    $available[] = $startOfDay->format('H:i') . ' - ' . $endOfDay->format('H:i');
                } else {
                    $previousEnd = $startOfDay;

                    foreach ($notifications as $notification) {
                        // event_start_time va event_end_time time formatida ishlash
                        $start = Carbon::parse($notification->event_start_time); // Convert to Carbon instance
                        $end = Carbon::parse($notification->event_end_time); // Convert to Carbon instance

                        // Chegaralangan vaqtni tekshirish
                        if ($start < $startOfDay) {
                            $start = $startOfDay;
                        }
                        if ($end > $endOfDay) {
                            $end = $endOfDay;
                        }

                        // Bo'sh vaqtni aniqlash
                        if ($previousEnd < $start) {
                            $available[] = $previousEnd->format('H:i') . ' - ' . $start->format('H:i');
                        }

                        // Band vaqtni qo'shish
                        $unavailable[] = $start->format('H:i') . ' - ' . $end->format('H:i');
                        $previousEnd = $end;
                    }

                    // Oxirgi band vaqt tugaganidan keyin bo'sh vaqt
                    if ($previousEnd < $endOfDay) {
                        $available[] = $previousEnd->format('H:i') . ' - ' . $endOfDay->format('H:i');
                    }
                }

                // Agar bo'sh vaqtlar ro'yxati bo'sh bo'lsa, butun kun band deb ko'rsatsin
                if (empty($available) && empty($unavailable)) {
                    $available[] = '';
                }

                // 08:00 - 20:00 vaqt oralig'i butunlay band bo'lsa, available ga 'band' deb ko'rsatish
                $totalUnavailableTime = collect($unavailable)->reduce(function ($carry, $item) {
                    $times = explode(' - ', $item);
                    $start = Carbon::parse($times[0]);
                    $end = Carbon::parse($times[1]);
                    // Yig'ish uchun add() emas, diffInMinutes ishlatiladi
                    return $carry + $end->diffInMinutes($start);  // Bu yerda diffInMinutes ishlatiladi
                }, 0);

                // Agar band bo'lgan vaqt 720 minut (yani 08:00 - 20:00) bo'lsa, "band" deb belgilash
                if ($totalUnavailableTime >= 720) {
                    $available = [''];
                }

                $available = array_unique($available);
                $unavailable = array_unique($unavailable);

                $available = implode(', ', $available);
                $unavailable = implode(', ', $unavailable);

                return [
                    'id' => $room->id,
                    'room' => $room->name,
                    'available' => $available,
                    'unavailable' => $unavailable,
                ];
            });

            return [
                'id' => $building->id,
                'name' => $building->name,
                'rooms' => $rooms,
            ];
        });

        return response()->json($result);
    }





















}

