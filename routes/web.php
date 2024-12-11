<?php

use App\Http\Controllers\Api\EmailController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('layouts.app');
});
//Route::get('/modal', [BuildingController::class, 'getBuilding'])->name('modal.modal');
Route::post('/notifications-by-date', [BuildingController::class, 'getNotificationsByDate'])->name('modal.modal');
Route::post('/notifications', [BuildingController::class, 'store'])->name('modal.store');
Route::get('/notifications', [NotificationController::class, 'getNotifications']);
Route::post('/send-email', [EmailController::class, 'sendEmail']);
