<?php

namespace App\Http\Controllers;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Building;

class BuildingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getBuildings()
    {
        // Barcha binolarni olish
        $buildings = Building::all();

        // JSON formatida qaytarish
        return response()->json($buildings);
    }


    public function getRoomsByBuilding(Request $request)
    {
        // Building id ni POST orqali olish
        $buildingId = $request->input('id');

        // Building id ga asoslangan room larni olish
        $building = Building::find($buildingId);

        if ($building) {
            // Building mavjud bo'lsa, uning barcha roomslarini qaytarish
            $rooms = $building->rooms;
            return response()->json($rooms);
        } else {
            // Agar building topilmasa, xato javob qaytarish
            return response()->json(['message' => 'Building not found'], 404);
        }
    }

    /**
     * Show the form for creating a new resource.
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
                'error' => 'There was an error processing your request.',
                'message' => $e->getMessage()
            ], 500); // Internal Server Error
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Building $building)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Building $building)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Building $building)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Building $building)
    {
        //
    }
}
