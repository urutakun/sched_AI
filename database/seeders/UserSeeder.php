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
              'password' => Hash::make('schedai@123')
            ],
            // [
            //   'id' => 'USR_000001',
            //   'first_name' => 'Joel Miller',
            //   'last_name' => 'Go',
            //   'role' => 'instructor',
            //   'dept_id' => 'DEP_111111',
            //   'max_load' => 12,
            //   'instructor_type' => 'part-time',
            //   'email' => 'joel@example.com',
            //   'password' => Hash::make('joel@123')
            // ],
            // [
            //   'id' => 'USR_000002',
            //   'first_name' => 'Leonardo',
            //   'last_name' => 'Risma',
            //   'role' => 'instructor',
            //   'dept_id' => 'DEP_000000',
            //   'max_load' => 12,
            //   'instructor_type' => 'part-time',
            //   'email' => 'leonardo@example.com',
            //   'password' => Hash::make('leonardo@123')
            // ],
            // [
            //   'id' => 'USR_000003',
            //   'first_name' => 'Jane',
            //   'last_name' => 'Doe',
            //   'role' => 'instructor',
            //   'dept_id' => 'DEP_111111',
            //   'max_load' => 12,
            //   'instructor_type' => 'full-time',
            //   'email' => 'jane@example.com',
            //   'password' => Hash::make('jane@123')
            // ],
          ]
      );
    }
}
