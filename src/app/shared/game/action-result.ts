export class ActionResult {
  success: boolean;
  previousState: any;
  nextState: any;

  constructor(success: boolean) {
    this.success = success;
  }
}
