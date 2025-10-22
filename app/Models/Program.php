<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
      'id',
      'dept_id',
      'code',
      'name'
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
            $uniqueId = 'PROG_' . mt_rand(000000, 999999);
        } while (self::where('id', $uniqueId)->exists());

        return $uniqueId;
    }

    public function department(){
      return $this->belongsTo(Department::class, 'dept_id', 'id');
    }
}
