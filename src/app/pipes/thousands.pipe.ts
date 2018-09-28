import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'thousandsSpace'})
export class ThousandsSpacePipe implements PipeTransform {
  transform(value: number): string {
  
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
}