<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProgramsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Program::insert(
          [
            [
              'id' =>  'PROG_000000',
              'dept_id' => 'DEP_000000',
              'code' => 'BSIT',
              'name' => 'Bachelor of Science in Information Technology'
            ],
            [
              'id' =>  'PROG_000002',
              'dept_id' => 'DEP_000000',
              'code' => 'BSCS',
              'name' => 'Bachelor of Science in Computer Science'
            ],
            [
              'id' =>  'PROG_000003',
              'dept_id' => 'DEP_111111',
              'code' => 'BSSE',
              'name' => 'Bachelor of Science in Secondary Education'
            ],
            [
              'id' =>  'PROG_000004',
              'dept_id' => 'DEP_111111',
              'code' => 'BSEE',
              'name' => 'Bachelor of Science in Elementary Education'
            ],
          ]
      );
    }
}
