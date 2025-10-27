<?php

namespace Database\Seeders;

use App\Models\Trimester;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrimesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Trimester::insert([
          [
            'id' => 'TRI_000000',
            'academic_years_id' => 'AY_000000',
            'name' =>'First Trimester',
            'start_date' => '2025-8-1',
            'end_date' => '2025-11-11',
            'status' => 'active',
          ]
        ]);
    }
}
