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


    public function getBuilding(Request $request)
    {
        // Binolarni olish
        $buildings = Building::all();

        // JSON formatida javob yuborish
        return response()->json([
            'buildings' => $buildings
        ]);
    }


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

        // Check if an approved notification with the same event date and time already exists
        $existingNotification = Notification::where('event_date', $request->input('event_date'))
            ->where('is_approved', 'approved') // Check only approved notifications
            ->where(function ($query) use ($request) {
                // Check if the new event's time range overlaps with any existing event's time range
                $query->where(function ($query) use ($request) {
                    $query->where('event_start_time', '<', $request->input('event_end_time'))
                        ->where('event_end_time', '>', $request->input('event_start_time'));
                });
            })
            ->first();

        if ($existingNotification) {
            // If an approved notification already exists for the given date and time, return an error response
            return response()->json([
                'error' => 'Bu sana (' . $request->input('event_date') . ') va vaqt (' .
                    $request->input('event_start_time') . ' - ' . $request->input('event_end_time') .
                    ') uchun jadvalda mavjud bo\'lgan tasdiqlangan tadbir bor.',
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

        // Har bir bino va xonani olish, va `notifications`ni sana bo'yicha filtrlash
        $buildings = Building::with(['rooms' => function ($query) use ($date) {
            $query->with(['notifications' => function ($query) use ($date) {
                // Bu yerda notificationsni faqat event_date va is_approved = 'approved' bo'yicha filtrlash
                $query->where('event_date', $date)
                    ->where('is_approved', 'approved');  // is_approved = 'approved' bo'lganlarni tanlash
            }]);
        }])->get();

        // Formatlash
        $result = $buildings->map(function ($building) use ($date) {
            $rooms = $building->rooms->map(function ($room) use ($date) {
                // Vaqtlarni ajratish
                $available = [];
                $unavailable = [];

                // Xonada mavjud bo'lgan notifications ni tekshirib chiqamiz
                $notifications = $room->notifications->filter(function ($notification) use ($date) {
                    return $notification->event_date == $date;
                });

                // Agar notifications mavjud bo'lmasa, barcha kunni available deb ko'rsatamiz
                if ($notifications->isEmpty()) {
                    $available[] = "All day available";  // Butun kun uchun available
                } else {
                    // Agar notifications mavjud bo'lsa, status bo'yicha ajratamiz
                    $unavailablePeriods = [];

                    foreach ($notifications as $notification) {
                        // Har doim is_approved = 'approved' bo'lganlarni olishni ta'minlaymiz
                        if ($notification->is_approved == 'approved') {
                            $unavailablePeriods[] = [
                                'start' => $notification->event_start_time,
                                'end' => $notification->event_end_time
                            ];
                        }
                    }

                    // Band vaqtlar bo'yicha available va unavailable vaqtlarni hisoblash
                    $startOfDay = Carbon::createFromFormat('Y-m-d', $date)->setTime(8, 0);  // 08:00 AM
                    $endOfDay = Carbon::createFromFormat('Y-m-d', $date)->setTime(20, 0);    // 08:00 PM

                    $previousEnd = $startOfDay;

                    // Unavailable vaqtlar oralig'ini ajratib olish
                    foreach ($unavailablePeriods as $period) {
                        $start = Carbon::parse($period['start']);
                        $end = Carbon::parse($period['end']);

                        // Band vaqtni faqat 08:00 AM dan 08:00 PM gacha ko'rib chiqamiz
                        if ($start < $startOfDay) {
                            $start = $startOfDay;
                        }

                        if ($end > $endOfDay) {
                            $end = $endOfDay;
                        }

                        // Bo'sh vaqtni available sifatida qo'shamiz
                        if ($previousEnd < $start) {
                            $available[] = $previousEnd->format('h:i A') . ' - ' . $start->format('h:i A');
                        }

                        $unavailable[] = $start->format('h:i A') . ' - ' . $end->format('h:i A');
                        $previousEnd = $end;
                    }

                    // Kun oxiriga qadar bo'sh vaqtni available sifatida qo'shish
                    if ($previousEnd < $endOfDay) {
                        $available[] = $previousEnd->format('h:i A') . ' - ' . $endOfDay->format('h:i A');
                    }
                }

                // Har bir xona uchun mavjud va mavjud emas vaqtlar
                return [
                    'room' => $room->name,
                    'available' => implode(', ', $available),
                    'unavailable' => implode(', ', $unavailable),
                ];
            });

            // Har bir bino uchun qaytariladigan ma'lumotlar
            return [
                'id' => $building->id,
                'name' => $building->name,
                'rooms' => $rooms,
            ];
        });

        // JSON javobini qaytarish
        return Response::json($result);
    }









}

