<?php

namespace App\Enums;

enum TodoStatus: string
{
    case TODO = 'TODO';
    case PENDING = 'PENDING';
    case COMPLETED = 'COMPLETED';
}
