export interface RandomSourceInterface
{
  /**
   * Inclusive of min, exclusive of max.
   * 
   * @param min
   * @param max
   */
  float(min: number, max: number) : number;
  
  int(min: number, max: number) : number;
  
  alnumString(length: number) : string;
}