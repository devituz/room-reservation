<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\RoomMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function sendEmail(Request $request)
    {
        $request->validate([
            'to' => 'required|email',
            'title' => 'required|string',
            'body' => 'required|string',
        ]);

        $details = [
            'title' => $request->title,
            'body' => $request->body,
        ];

        // Email yuborish
        Mail::to($request->to)->send(new RoomMail($details));

        return response()->json([
            'message' => 'Email has been sent successfully!',
        ]);
    }
}
