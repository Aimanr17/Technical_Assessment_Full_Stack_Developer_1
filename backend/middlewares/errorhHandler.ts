const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
    let status = 500;
    let message = 'Internal server error';

    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
        status = 400;
        message = error.errors[0].message;
    }

    if (error.name === 'NotFound') {
        status = 404;
        message = 'Data not found';
    }

    res.status(status).json({
        message
    });
};

export default errorHandler;