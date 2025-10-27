<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
          UserSeeder::class,
          DeparmentSeeder::class,
          ProgramsSeeder::class,
          AcademicYearSeeder::class,
          TrimesterSeeder::class,
        ]);
    }
}
