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
        User::insert(
          [
            [
              'id' => 'USR_000000',
              'first_name' => 'SchedAI',
              'last_name' => 'Admin',
              'role' => 'admin',
              'email' => 'admin@sched.ai',
              'password' => Hash::make('schedai@123'),
              'must_change_password' => false,
            ],
            [
              'id' => 'USR_111111',
              'first_name' => 'Batman',
              'last_name' => 'Deguzman',
              'role' => 'admin',
              'email' => 'batman@gotham.com',
              'password' => Hash::make('batman@123'),
              'must_change_password' => false,
            ],
          ]
      );
    }
}
