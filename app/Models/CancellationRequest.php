<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CancellationRequest extends Model
{
    protected $fillable = [
        'id',
        'session_id',
        'type',
        'reason',
        'status',
        'attachment'
    ];

    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $keyType = 'string';

    protected static function boot(){
        parent::boot();

        static::creating(function ($request) {
            $request->id = self::generateUniqueId();
        });
    }

    private static function generateUniqueId()
    {
        do {
            $uniqueId = 'CR_' . mt_rand(000000, 999999);
        } while (self::where('id', $uniqueId)->exists());

        return $uniqueId;
    }

    public function schedule_session(){
      return $this->belongsTo(ScheduleSession::class, 'session_id', 'id');
    }
}
