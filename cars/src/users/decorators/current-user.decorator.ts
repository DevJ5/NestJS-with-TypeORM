import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// ExecutionContext is the request, but instead of calling it request which would imply HTTP we
// call it ExecutionContext to point to all communication protocols.

// Parameter decorators do not have access to DI, thats why we also need an interceptor.

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // console.log(typeof request.session.userId);
    return request.currentUser;
  },
);
