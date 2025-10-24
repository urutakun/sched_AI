<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
          'id' => 'USR_000000',
          'first_name' => 'Batman',
          'last_name' => 'Deguzman',
          'role' => 'admin',
          'email' => 'batman@gotham.com',
          'password' => Hash::make('batman@123')
        ]);
    }
}
