import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('Authorization');

  const modifiedReq = token
    ? req.clone({
        setHeaders: {
          Authorization: token,
        },
      })
    : req;

  return next(modifiedReq);
};
