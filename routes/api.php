<?php

use App\Http\Controllers\Api\EmailController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/send-email', [EmailController::class, 'sendEmail']);


//Route::post('notifications-by-date', [BuildingController::class, 'getNotificationsByDate']);
//Route::get('notifications', [NotificationController::class, 'getNotifications']);
//Route::get('getBuilding', [BuildingController::class, 'getBuilding']);
Route::post('notifications', [BuildingController::class, 'store']);
