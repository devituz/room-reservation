<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RoomMail extends Mailable
{
    use Queueable, SerializesModels;

    public $details; // Emailga yuboriladigan ma'lumotlar

    /**
     * Create a new message instance.
     *
     * @param  array  $details
     */
    public function __construct($details)
    {
        $this->details = $details;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->details['title'], // Emailning sarlavhasi
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.room', // `emails.room` view fayli
            with: [
                'body' => $this->details['body'], // Body ma'lumotlari
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
        return []; // Agar ilovalar bo'lsa, ularni bu yerga qo'shing
    }
}
