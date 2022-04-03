import { NextFunction, Request, Response } from 'express';

const response: { [index: number]: string } = {
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Not Allowed',
    '500': 'Internal Server Error',
    '503': 'Service Unavailable',
};

export default function ResponseHandler(
    status: number,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!response[status]) return next();
    res.status(status).json({
        status,
        message: response[status],
        time: ~~(Date.now() / 1e3),
    });
}
