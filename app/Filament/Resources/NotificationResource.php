<?php

namespace App\Filament\Resources;

use Filament\Tables\Actions\Action;

use App\Filament\Resources\NotificationResource\Pages;
use App\Models\Notification;
use Filament\Forms;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BooleanColumn;
use Filament\Tables\Table;

class NotificationResource extends Resource
{
    protected static ?string $model = Notification::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form
            ->schema([
                DatePicker::make('event_date')
                    ->label('Event Date')
                    ->required(),
                TimePicker::make('event_start_time')
                    ->label('Start Time')
                    ->required(),
                TimePicker::make('event_end_time')
                    ->label('End Time')
                    ->required(),
                Select::make('building_id')
                    ->relationship('building', 'name')
                    ->label('Building')
                    ->required(),
                Select::make('room_id')
                    ->relationship('room', 'name')
                    ->label('Room')
                    ->required(),
                TextInput::make('fullname')
                    ->label('Full Name')
                    ->required(),
                TextInput::make('phone_number')
                    ->label('Phone Number')
                    ->required(),
                TextInput::make('email')
                    ->label('Email')
                    ->email()
                    ->required(),
                TextInput::make('event_name')
                    ->label('Event Name')
                    ->required(),
                Textarea::make('event_description')
                    ->label('Event Description'),

            ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->defaultSort('created_at', 'desc') // Sukut bo‘yicha tartiblash
            ->columns([
                TextColumn::make('event_date')->label('Event Date')->sortable(),
                TextColumn::make('event_start_time')->label('Start Time'),
                TextColumn::make('event_end_time')->label('End Time'),
                TextColumn::make('building.name')->label('Building'),
                TextColumn::make('room.name')->label('Room'),
                TextColumn::make('fullname')->label('Full Name'),
                TextColumn::make('phone_number')->label('Phone Number'),
                TextColumn::make('email')->label('Email'),
                TextColumn::make('event_name')->label('Event Name'),
                TextColumn::make('created_at')->label('Created At'),
                BadgeColumn::make('is_approved')
                    ->label('Approval Status')
                    ->getStateUsing(fn($record) => ucfirst($record->is_approved)) // Enum qiymatlarini ko'rsatish
                    ->colors([
                        'pending' => 'warning',
                        'approved' => 'success',
                        'rejected' => 'danger',
                    ])

            ])
            ->filters([
                //

            ])
            ->actions([

                Action::make('approve')
                    ->label('Approve')
                    ->color('success')
                    ->icon('heroicon-o-check')
                    ->action(function ($record) {
                        $record->update(['is_approved' => 'approved']);
                    }),
                Action::make('reject')
                    ->label('Reject')
                    ->color('danger')
                    ->icon('heroicon-o-x-mark')
                    ->action(function ($record) {
                        $record->update(['is_approved' => 'rejected']);
                    }),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNotifications::route('/'),
            'create' => Pages\CreateNotification::route('/create'),
            'edit' => Pages\EditNotification::route('/{record}/edit'),
        ];
    }
}
