import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { otpVeryfiedGuard } from './otp-veryfied.guard';

describe('otpVeryfiedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => otpVeryfiedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
