import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should allow access if user has required role', () => {
    const requiredRoles = ['local'];
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: requiredRoles },
        }),
      }),
      getHandler: () => {},
      getClass: () => {},
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValueOnce(requiredRoles);
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access if user does not have required role', () => {
    const requiredRoles = ['local'];
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: ['remote'] },
        }),
      }),
      getHandler: () => {},
      getClass: () => {},
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValueOnce(requiredRoles);
    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });
});
