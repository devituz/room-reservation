<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RoomApproved extends Mailable
{
    use Queueable, SerializesModels;

    public $notification; // Notification ma'lumotlari


    /**
     * Create a new message instance.
     */
    public function __construct($notification, $type)
    {
        $this->notification = $notification;
        $this->type = $type;
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->type === 'approved' ? 'Your Event Has Been Approved' : 'Your Event Has Been Rejected';

        return new Envelope(
            subject: $subject, // Emailning sarlavhasi
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notification_approved', // The view file `emails.notification_approved`
            with: [
                'eventName' => $this->notification->event_name,
                'eventDate' => $this->notification->event_date,
                'startTime' => $this->notification->event_start_time,
                'endTime' => $this->notification->event_end_time,
                'fullName' => $this->notification->fullname,
                'buildingName' => $this->notification->building_name,
                'roomName' => $this->notification->room_name,
                'phoneNumber' => $this->notification->phone_number,
                'email' => $this->notification->email,
                'eventDescription' => $this->notification->event_description,
                'is_approved' => $this->notification->is_approved,

            ]
        );
    }


    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }



}
