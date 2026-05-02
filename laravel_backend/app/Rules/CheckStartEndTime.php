<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use DateTime;

class CheckStartEndTime implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        preg_match("/availableSlot\.(\d+)\.end_time/",$attribute, $found);
        $index = $found[1]??null;
        if($index){
            $start = request()->input("availableSlot.$index.start_time");
            if($start){
                $startTime = DateTime::createFromFormat("H:i:s", $start);
                $endTime = DateTime::createFromFormat("H:i:s", $value);
                if($startTime >= $endTime){
                    $fail("The end_time must be after the start_time for slot $index.");
                }
            }
        }
    }
}
